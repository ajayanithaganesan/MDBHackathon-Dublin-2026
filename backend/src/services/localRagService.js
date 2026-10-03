import { readFile } from "node:fs/promises";

const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const embeddingModel = process.env.EMBEDDING_MODEL || "nomic-embed-text";
const languageModel = process.env.LLM_MODEL || "nemotron-3-nano:4b";
const systemPrompt = readFile(new URL("../prompts/incident-brief-system.md", import.meta.url), "utf8");

async function ollamaRequest(endpoint, body) {
  const response = await fetch(`${ollamaBaseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000)
  });

  if (!response.ok) {
    throw new Error(`Ollama ${endpoint} returned ${response.status}.`);
  }
  return response.json();
}

export function incidentEmbeddingText(incident) {
  return [
    incident.title,
    incident.description,
    incident.service,
    incident.environment,
    incident.severity,
    ...(incident.symptoms || []),
    incident.errorMessage,
    incident.rootCause,
    incident.resolution
  ].filter(Boolean).join("\n");
}

export async function createEmbeddings(texts) {
  if (texts.length === 0) return [];
  const result = await ollamaRequest("/api/embed", { model: embeddingModel, input: texts });
  if (!Array.isArray(result.embeddings) || result.embeddings.length !== texts.length) {
    throw new Error("Ollama returned an incomplete embedding response.");
  }
  return result.embeddings;
}

export function cosineSimilarity(left, right) {
  if (!left?.length || left.length !== right?.length) return -1;
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (leftMagnitude === 0 || rightMagnitude === 0) return -1;
  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export async function indexMissingIncidentEmbeddings(db) {
  const incidents = await db.collection("incidents")
    .find({ status: "resolved", embedding: { $exists: false } })
    .toArray();
  if (incidents.length === 0) return 0;

  const embeddings = await createEmbeddings(incidents.map(incidentEmbeddingText));
  await db.collection("incidents").bulkWrite(incidents.map((incident, index) => ({
    updateOne: {
      filter: { _id: incident._id },
      update: { $set: { embedding: embeddings[index] } }
    }
  })));
  return incidents.length;
}

function fallbackRecommendation(currentIncident) {
  const incidentText = incidentEmbeddingText(currentIncident);
  if (/database|mongo|sql|connection pool|connection saturation|too many connections/i.test(incidentText)) {
    return "Investigate database connection saturation, active pool usage, and recent connection errors before treating any cause as confirmed.";
  }
  return "Investigate the reported symptoms and collect relevant service logs and metrics before changing configuration.";
}

function partialEvidenceDescription(count) {
  if (count === 0) return "No related incidents found.";
  if (count === 1) return "1 partially related incident.";
  return `${count} partially related incidents.`;
}

function evidenceFallback(currentIncident, evidence, strongMatch, error = "") {
  const closest = evidence[0];
  if (!strongMatch) {
    return {
      summary: "⚠ No strong historical match found.",
      confidence: "LOW",
      recommendedAction: fallbackRecommendation(currentIncident),
      evidence: evidence.map(({ incidentNumber }) => incidentNumber),
      evidenceCount: evidence.length,
      evidenceDescription: partialEvidenceDescription(evidence.length),
      humanVerification: true,
      mode: "evidence-only",
      ...(error ? { warning: error } : {})
    };
  }

  return {
    summary: closest
      ? `Historical evidence from ${closest.incidentNumber} describes a related ${closest.service} incident.`
      : "No close historical incident was retrieved. Verify the current environment and collect more symptoms before choosing a cause.",
    confidence: "HIGH",
    recommendedAction: closest
      ? `Compare the current incident with ${closest.incidentNumber} and verify whether its saved resolution applies.`
      : fallbackRecommendation(currentIncident),
    checks: closest
      ? [`Compare the current symptoms with ${closest.incidentNumber}.`, `Verify whether this resolution applies before making changes: ${closest.resolution}`]
      : ["Confirm the affected service and environment.", "Capture relevant logs and error messages."],
    evidence: evidence.map(({ incidentNumber }) => incidentNumber),
    evidenceCount: evidence.length,
    evidenceDescription: `${evidence.length} historical incident${evidence.length === 1 ? "" : "s"}.`,
    humanVerification: true,
    mode: "evidence-only",
    ...(error ? { warning: error } : {})
  };
}

export async function generateGroundedBrief(currentIncident, evidence, { strongMatch = false } = {}) {
  if (evidence.length === 0) return evidenceFallback(currentIncident, evidence, false);

  const allowedEvidence = new Set(evidence.map(({ incidentNumber }) => incidentNumber));
  try {
    const prompt = await systemPrompt;
    const result = await ollamaRequest("/api/chat", {
      model: languageModel,
      stream: false,
      format: "json",
      options: { temperature: 0.15 },
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: JSON.stringify({
            matchConfidence: strongMatch ? "HIGH" : "LOW",
            currentIncident,
            historicalEvidence: evidence.map(({ incidentNumber, title, service, rootCause, resolution }) => ({ incidentNumber, title, service, rootCause, resolution }))
          })
        }
      ]
    });

    const parsed = JSON.parse(result.message.content);
    const citedEvidence = Array.isArray(parsed.evidence)
      ? parsed.evidence.filter((incidentNumber) => allowedEvidence.has(incidentNumber))
      : [];
    if (!strongMatch) {
      const partialEvidence = evidence.map(({ incidentNumber }) => incidentNumber);
      return {
        summary: "⚠ No strong historical match found.",
        confidence: "LOW",
        recommendedAction: String(parsed.recommendedAction || fallbackRecommendation(currentIncident)),
        evidence: partialEvidence,
        evidenceCount: partialEvidence.length,
        evidenceDescription: partialEvidenceDescription(partialEvidence.length),
        humanVerification: true,
        mode: languageModel
      };
    }

    return {
      summary: String(parsed.summary || evidenceFallback(currentIncident, evidence, true).summary),
      confidence: "HIGH",
      recommendedAction: String(parsed.recommendedAction || fallbackRecommendation(currentIncident)),
      checks: Array.isArray(parsed.checks) ? parsed.checks.map(String).slice(0, 4) : [],
      evidence: citedEvidence,
      evidenceCount: citedEvidence.length,
      evidenceDescription: `${citedEvidence.length} historical incident${citedEvidence.length === 1 ? "" : "s"}.`,
      humanVerification: true,
      mode: languageModel
    };
  } catch (error) {
    return evidenceFallback(currentIncident, evidence, strongMatch, error.message);
  }
}

export default {
  createEmbeddings,
  cosineSimilarity,
  generateGroundedBrief,
  incidentEmbeddingText,
  indexMissingIncidentEmbeddings
};