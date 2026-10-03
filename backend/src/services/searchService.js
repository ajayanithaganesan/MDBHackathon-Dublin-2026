/**
 * Hybrid Search Service — Person 2 (Search & Retrieval Backend Lead)
 *
 * Implements P0.2 "Search Historical Memory" from the OpsMemory build plan.
 *
 * Retrieval combines two MongoDB mechanisms:
 *   1. Keyword Search  — weighted `$text` index (title/rootCause/symptoms/description/resolution)
 *   2. Vector Search   — Atlas `$vectorSearch` over the `embedding` field (cosine similarity)
 *
 * They are merged into a single normalized relevance score ("hybrid search").
 *
 * Robustness: if Atlas Vector Search or embeddings are unavailable (e.g. local
 * mongod for development), the service degrades gracefully to keyword-only and
 * reports `search.mode`. The API contract never changes.
 */

import { connectToDatabase } from "../db/connection.js";
import { getEmbedding, isEmbeddingEnabled } from "./embeddingService.js";

const TEXT_INDEX_NAME = process.env.TEXT_INDEX_NAME || "idx_text_search_incident_memory";
const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || "vector_index_incidents";
const DEFAULT_TOP_K = Number(process.env.SEARCH_TOP_K) || 5;
const CANDIDATE_LIMIT = Number(process.env.SEARCH_CANDIDATE_LIMIT) || 25;

const SEARCHABLE_STATUS = "resolved";

// Tri-state so a missing Atlas vector index is only probed/logged once per process.
let vectorSearchState = "unknown"; // "unknown" | "available" | "unavailable"
let vectorSearchWarningLogged = false;

const SEVERITY_ALIASES = {
  p1: "Critical",
  "sev1": "Critical",
  critical: "Critical",
  p2: "High",
  "sev2": "High",
  high: "High",
  p3: "Medium",
  "sev3": "Medium",
  medium: "Medium",
  p4: "Low",
  "sev4": "Low",
  low: "Low"
};

const ENVIRONMENT_ALIASES = {
  prod: "Production",
  production: "Production",
  staging: "Staging",
  stage: "Staging",
  development: "Development",
  dev: "Development",
  dr: "DR"
};

/**
 * Accept both the frontend snake_case contract and the stored camelCase schema.
 */
function normalizeIncidentInput(body = {}) {
  const symptoms = Array.isArray(body.symptoms)
    ? body.symptoms
    : typeof body.symptoms === "string"
      ? body.symptoms.split(/[,;\n]/)
      : [];

  const severityRaw = String(body.severity || "").trim();
  const environmentRaw = String(body.environment || "").trim();

  return {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    service: String(body.service || "").trim(),
    environment: ENVIRONMENT_ALIASES[environmentRaw.toLowerCase()] || environmentRaw,
    severity: SEVERITY_ALIASES[severityRaw.toLowerCase()] || severityRaw,
    symptoms: symptoms.map((s) => String(s).trim()).filter(Boolean),
    errorMessage: String(body.errorMessage || body.error_message || "").trim()
  };
}

function buildQueryText(incident) {
  return [
    incident.title,
    incident.description,
    incident.symptoms.join(" "),
    incident.errorMessage
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/["\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .match(/[a-z0-9][a-z0-9._-]{1,}/g) || []
  );
}

function overlapCount(a, b) {
  let count = 0;
  for (const token of a) if (b.has(token)) count++;
  return count;
}

function round(value, digits = 3) {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(digits));
}

/**
 * Min-max normalize a map of { key -> rawScore } into 0..1.
 * When all values are equal (or a single result), every entry maps to 1.
 */
function normalizeScores(rawScores) {
  const values = [...rawScores.values()];
  if (values.length === 0) return new Map();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const normalized = new Map();
  for (const [key, value] of rawScores.entries()) {
    normalized.set(key, range === 0 ? 1 : (value - min) / range);
  }
  return normalized;
}

/**
 * Weighted keyword (text) search using the existing MongoDB `$text` index.
 * @returns {Promise<Map<string, {incident: object, score: number}>>}
 */
async function keywordSearch(db, queryText) {
  const results = new Map();
  if (!queryText) return results;

  try {
    const cursor = db
      .collection("incidents")
      .find(
        { $text: { $search: queryText }, status: SEARCHABLE_STATUS },
        { projection: { embedding: 0, score: { $meta: "textScore" } } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(CANDIDATE_LIMIT);

    for await (const doc of cursor) {
      results.set(doc.incidentNumber, { incident: doc, score: doc.score || 0 });
    }
  } catch (error) {
    // A missing text index (fresh DB) should not crash the request.
    if (!/text index/i.test(error.message || "")) throw error;
    console.warn("[search] Keyword search skipped: no text index found.");
  }

  return results;
}

/**
 * Atlas Vector Search over the `embedding` field using cosine similarity.
 * @returns {Promise<Map<string, {incident: object, score: number}>>}
 */
async function vectorSearch(db, queryVector) {
  const results = new Map();
  if (!queryVector || queryVector.length === 0 || vectorSearchState === "unavailable") {
    return results;
  }

  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector,
          numCandidates: Math.max(CANDIDATE_LIMIT * 4, 100),
          limit: CANDIDATE_LIMIT,
          filter: { status: SEARCHABLE_STATUS }
        }
      },
      {
        $project: {
          embedding: 0,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    const docs = await db.collection("incidents").aggregate(pipeline).toArray();
    for (const doc of docs) {
      results.set(doc.incidentNumber, { incident: doc, score: doc.score || 0 });
    }
    vectorSearchState = "available";
  } catch (error) {
    vectorSearchState = "unavailable";
    if (!vectorSearchWarningLogged) {
      vectorSearchWarningLogged = true;
      console.warn(
        `[search] Atlas Vector Search unavailable (${error.message}). Falling back to keyword-only. ` +
          `Create a Vector Search index named "${VECTOR_INDEX_NAME}" to enable hybrid mode.`
      );
    }
  }

  return results;
}

function buildMatchReasons(incident, query, queryTokens, symptomTokens, errorTokens) {
  const reasons = [];

  if (query.service && incident.service && query.service.toLowerCase() === incident.service.toLowerCase()) {
    reasons.push("Same service");
  }
  if (query.environment && incident.environment && query.environment.toLowerCase() === incident.environment.toLowerCase()) {
    reasons.push("Same environment");
  }
  if (query.severity && incident.severity && query.severity.toLowerCase() === incident.severity.toLowerCase()) {
    reasons.push("Similar severity");
  }

  const incidentSymptomTokens = tokenize((incident.symptoms || []).join(" "));
  if (overlapCount(symptomTokens, incidentSymptomTokens) > 0) {
    reasons.push("Similar symptoms");
  }

  const incidentErrorTokens = tokenize(incident.errorMessage || "");
  if (errorTokens.size > 0 && overlapCount(errorTokens, incidentErrorTokens) > 0) {
    reasons.push("Matching error signature");
  }

  const incidentKeywordTokens = tokenize(
    [incident.title, incident.description, incident.rootCause, incident.resolution].join(" ")
  );
  if (overlapCount(queryTokens, incidentKeywordTokens) > 0) {
    reasons.push("Keyword match");
  }

  return reasons;
}

function computeConfidence(matches) {
  if (matches.length === 0) return "NONE";
  const top = matches[0].relevance;
  if (top >= 0.75) return "HIGH";
  if (top >= 0.5) return "MEDIUM";
  return "LOW";
}

/**
 * Attach feedback status (helpful / not_helpful) to matched incidents.
 */
async function attachFeedback(db, matches) {
  if (matches.length === 0) return matches;

  const numbers = matches.map((m) => m.incidentNumber);
  const feedbackDocs = await db
    .collection("feedback")
    .find({ incidentNumber: { $in: numbers } })
    .sort({ createdAt: -1 })
    .toArray();

  const latest = new Map();
  for (const fb of feedbackDocs) {
    if (!latest.has(fb.incidentNumber)) latest.set(fb.incidentNumber, fb.rating);
  }

  for (const match of matches) {
    match.feedback = latest.get(match.incidentNumber) || null;
  }
  return matches;
}

/**
 * Main entry point: hybrid retrieval + ranking.
 *
 * @param {object} rawIncident - Incident fields from the request body.
 * @param {{ topK?: number, database?: import('mongodb').Db }} [options]
 * @returns {Promise<object>} Search result payload (without AI analysis).
 */
export async function hybridSearch(rawIncident, options = {}) {
  const db = options.database || (await connectToDatabase()).db;
  const topK = Math.min(Math.max(Number(options.topK) || DEFAULT_TOP_K, 1), 10);

  const query = normalizeIncidentInput(rawIncident);
  const queryText = buildQueryText(query);

  if (!queryText) {
    return {
      query,
      search: {
        mode: "none",
        semanticScore: 0,
        keywordScore: 0,
        serviceMatch: 0,
        environmentMatch: 0,
        overallConfidence: "NONE",
        totalCandidates: 0
      },
      matches: []
    };
  }

  const [keywordResults, queryVector] = await Promise.all([
    keywordSearch(db, queryText),
    isEmbeddingEnabled()
      ? getEmbedding(queryText).catch((error) => {
          console.warn(`[search] Query embedding failed: ${error.message}`);
          return null;
        })
      : Promise.resolve(null)
  ]);

  const vectorResults = await vectorSearch(db, queryVector);

  // Merge candidates by incidentNumber.
  const candidateIds = new Set([...keywordResults.keys(), ...vectorResults.keys()]);
  if (candidateIds.size === 0) {
    return {
      query,
      search: {
        mode: queryVector ? "hybrid" : "keyword",
        semanticScore: 0,
        keywordScore: 0,
        serviceMatch: 0,
        environmentMatch: 0,
        overallConfidence: "NONE",
        totalCandidates: 0
      },
      matches: []
    };
  }

  const keywordNorm = normalizeScores(
    new Map([...keywordResults].map(([id, v]) => [id, v.score]))
  );
  const vectorNorm = normalizeScores(
    new Map([...vectorResults].map(([id, v]) => [id, v.score]))
  );

  const hasVector = vectorResults.size > 0;
  const hasKeyword = keywordResults.size > 0;
  // Redistribute weight when only one retrieval mechanism produced results.
  let keywordWeight = 0.5;
  let vectorWeight = 0.5;
  if (!hasVector) {
    keywordWeight = 1;
    vectorWeight = 0;
  } else if (!hasKeyword) {
    keywordWeight = 0;
    vectorWeight = 1;
  }

  const queryTokens = tokenize(queryText);
  const symptomTokens = tokenize(query.symptoms.join(" "));
  const errorTokens = tokenize(query.errorMessage);

  const matches = [];
  for (const id of candidateIds) {
    const keywordEntry = keywordResults.get(id);
    const vectorEntry = vectorResults.get(id);
    const incident = (keywordEntry || vectorEntry).incident;

    const keywordScore = keywordNorm.get(id) ?? 0;
    const semanticScore = vectorNorm.get(id) ?? 0;
    const relevance = round(keywordWeight * keywordScore + vectorWeight * semanticScore);

    matches.push({
      incidentNumber: incident.incidentNumber,
      title: incident.title,
      description: incident.description,
      service: incident.service,
      environment: incident.environment,
      severity: incident.severity,
      symptoms: incident.symptoms || [],
      errorMessage: incident.errorMessage || null,
      rootCause: incident.rootCause,
      resolution: incident.resolution,
      resolutionSummary: incident.resolutionSummary || null,
      status: incident.status,
      createdAt: incident.createdAt,
      resolvedAt: incident.resolvedAt,
      relevance,
      semanticScore: round(semanticScore),
      keywordScore: round(keywordScore),
      matchReasons: buildMatchReasons(incident, query, queryTokens, symptomTokens, errorTokens)
    });
  }

  matches.sort((a, b) => b.relevance - a.relevance);
  const topMatches = matches.slice(0, topK);
  await attachFeedback(db, topMatches);

  const avg = (field) =>
    topMatches.length === 0
      ? 0
      : round(topMatches.reduce((sum, m) => sum + m[field], 0) / topMatches.length);

  const sameService = topMatches.filter(
    (m) => query.service && m.service && m.service.toLowerCase() === query.service.toLowerCase()
  ).length;
  const sameEnvironment = topMatches.filter(
    (m) => query.environment && m.environment && m.environment.toLowerCase() === query.environment.toLowerCase()
  ).length;

  return {
    query,
    search: {
      mode: hasVector && hasKeyword ? "hybrid" : hasVector ? "vector" : "keyword",
      semanticScore: avg("semanticScore"),
      keywordScore: avg("keywordScore"),
      serviceMatch: topMatches.length ? round(sameService / topMatches.length) : 0,
      environmentMatch: topMatches.length ? round(sameEnvironment / topMatches.length) : 0,
      overallConfidence: computeConfidence(topMatches),
      totalCandidates: candidateIds.size
    },
    matches: topMatches
  };
}

export { normalizeIncidentInput, buildQueryText };

export default {
  hybridSearch,
  normalizeIncidentInput,
  buildQueryText
};
