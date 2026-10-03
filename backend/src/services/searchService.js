/**
 * Hybrid Search Service — Person 2 (Search & Retrieval Backend Lead)
 *
 * Implements P0.2 "Search Historical Memory" from the OpsMemory build plan.
 *
 * Retrieval combines two MongoDB mechanisms:
 *   1. Keyword Search  — weighted `$text` index (title/rootCause/symptoms/description/resolution)
 *   2. Vector Search   — Atlas `$vectorSearch` over the `embedding` field (cosine similarity)
 *
 * They are merged into a single normalized 0..1 relevance score ("hybrid search").
 *
 * Scoring is ABSOLUTE (not min-max relative) so that a weak/noisy candidate set
 * still reports LOW/NONE confidence — required for the difficult-case demo.
 *   keywordScore = query-token coverage across the incident's searchable text
 *   semanticScore = Atlas vector cosine similarity (0..1)
 *   relevance    = weighted combination (+ service-match boost)
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

// Absolute-evidence confidence thresholds (applied to the top relevance).
const CONFIDENCE_HIGH = 0.6;
const CONFIDENCE_MEDIUM = 0.4;
const CONFIDENCE_LOW = 0.15;
const SERVICE_BOOST = 0.1;

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

// Common words that would otherwise inflate token-coverage relevance.
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "at", "by", "from", "with",
  "after", "before", "during", "for", "is", "are", "was", "were", "be", "been", "being",
  "that", "this", "these", "those", "it", "its", "as", "but", "not", "no", "do", "does",
  "did", "has", "have", "had", "can", "could", "will", "would", "should", "may", "might",
  "when", "while", "into", "over", "under", "again", "then", "than", "so", "such", "very",
  "too", "also", "users", "user", "multiple", "all", "their", "they", "them", "we", "our",
  "you", "your", "its", "any", "some", "each", "more", "most", "other", "only", "new"
]);

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

/** Tokenize and drop stopwords — used for absolute keyword coverage. */
function tokenizeSignificant(text) {
  const tokens = tokenize(text);
  const significant = new Set();
  for (const token of tokens) {
    if (!STOPWORDS.has(token)) significant.add(token);
  }
  return significant;
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

function incidentSearchableText(incident) {
  return [
    incident.title,
    incident.description,
    (incident.symptoms || []).join(" "),
    incident.errorMessage,
    incident.rootCause,
    incident.resolution
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Absolute keyword relevance: fraction of significant query tokens that appear
 * anywhere in the incident's searchable text. 0..1, independent of result set.
 */
function keywordCoverage(queryTokens, incident) {
  if (queryTokens.size === 0) return 0;
  const docTokens = tokenizeSignificant(incidentSearchableText(incident));
  let hits = 0;
  for (const token of queryTokens) {
    if (docTokens.has(token)) hits++;
  }
  return hits / queryTokens.size;
}

/**
 * Weighted keyword (text) search using the existing MongoDB `$text` index.
 * Raw textScore is used for candidate ordering only; relevance uses coverage.
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
 * Only runs when a query vector is available. The vectorSearchScore is already
 * an absolute 0..1 similarity for cosine.
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
  if (top >= CONFIDENCE_HIGH) return "HIGH";
  if (top >= CONFIDENCE_MEDIUM) return "MEDIUM";
  if (top >= CONFIDENCE_LOW) return "LOW";
  return "NONE";
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

  const emptySearch = (mode) => ({
    query,
    search: {
      mode,
      semanticScore: 0,
      keywordScore: 0,
      serviceMatch: 0,
      environmentMatch: 0,
      overallConfidence: "NONE",
      totalCandidates: 0
    },
    matches: []
  });

  if (!queryText) return emptySearch("none");

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

  const candidateIds = new Set([...keywordResults.keys(), ...vectorResults.keys()]);
  if (candidateIds.size === 0) {
    return emptySearch(queryVector ? "hybrid" : "keyword");
  }

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

  const queryTokens = tokenizeSignificant(queryText);
  const coverageTokens = new Set([...queryTokens, ...tokenizeSignificant(query.service)]);
  const symptomTokens = tokenize(query.symptoms.join(" "));
  const errorTokens = tokenize(query.errorMessage);

  const matches = [];
  for (const id of candidateIds) {
    const keywordEntry = keywordResults.get(id);
    const vectorEntry = vectorResults.get(id);
    const incident = (keywordEntry || vectorEntry).incident;

    const keywordScore = keywordCoverage(coverageTokens, incident);
    const semanticScore = Math.min(Math.max(vectorEntry ? vectorEntry.score : 0, 0), 1);

    let relevance = keywordWeight * keywordScore + vectorWeight * semanticScore;
    const sameService =
      query.service && incident.service && query.service.toLowerCase() === incident.service.toLowerCase();
    if (sameService) relevance = Math.min(1, relevance + SERVICE_BOOST);

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
      relevance: round(relevance),
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

  const sameServiceCount = topMatches.filter(
    (m) => query.service && m.service && m.service.toLowerCase() === query.service.toLowerCase()
  ).length;
  const sameEnvironmentCount = topMatches.filter(
    (m) => query.environment && m.environment && m.environment.toLowerCase() === query.environment.toLowerCase()
  ).length;

  return {
    query,
    search: {
      mode: hasVector && hasKeyword ? "hybrid" : hasVector ? "vector" : "keyword",
      semanticScore: avg("semanticScore"),
      keywordScore: avg("keywordScore"),
      serviceMatch: topMatches.length ? round(sameServiceCount / topMatches.length) : 0,
      environmentMatch: topMatches.length ? round(sameEnvironmentCount / topMatches.length) : 0,
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
