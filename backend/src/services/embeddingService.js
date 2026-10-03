/**
 * Embedding Service
 *
 * Shared seam between the Search layer (Person 2) and the AI/RAG layer (Person 3).
 * Converts incident text into a dense vector used by MongoDB Atlas Vector Search.
 *
 * Design goals:
 * - Never block hybrid search: if no API key is configured, callers receive `null`
 *   and the search service gracefully falls back to keyword-only retrieval.
 * - Provider agnostic: Gemini (text-embedding-004) or OpenAI (text-embedding-3-small).
 * - Cheap in-memory cache so repeated searches don't re-embed the same text.
 *
 * Person 3 owns the final embedding pipeline; this module exposes a stable
 * `getEmbedding(text)` / `isEmbeddingEnabled()` contract so search can depend on it.
 */

const DEFAULT_MODELS = {
  gemini: "text-embedding-004",
  openai: "text-embedding-3-small"
};

const cache = new Map();
const CACHE_LIMIT = 500;

function resolveProvider() {
  const explicit = (process.env.EMBEDDING_PROVIDER || "").toLowerCase();
  if (explicit === "gemini" || explicit === "openai") return explicit;
  if (explicit === "none" || explicit === "disabled") return null;

  const model = (process.env.EMBEDDING_MODEL || "").toLowerCase();
  if (model.startsWith("text-embedding-3") || model.startsWith("text-embedding-ada")) return "openai";
  if (model.startsWith("text-embedding-004") || model.startsWith("embedding-001") || model.startsWith("models/")) return "gemini";
  if (model) return "gemini";

  // Fall back to whichever key is present.
  if (process.env.GEMINI_API_KEY || process.env.LLM_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

function resolveApiKey(provider) {
  if (provider === "openai") return process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || "";
  return process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || "";
}

function resolveModel(provider) {
  const configured = (process.env.EMBEDDING_MODEL || "").trim();
  if (configured && configured !== "models/") {
    return configured.replace(/^models\//, "");
  }
  return DEFAULT_MODELS[provider];
}

/**
 * Whether embeddings (and therefore vector search) can be generated.
 * @returns {boolean}
 */
export function isEmbeddingEnabled() {
  const provider = resolveProvider();
  return Boolean(provider && resolveApiKey(provider));
}

/**
 * Get the configured embedding dimension, if known.
 * @returns {number|null}
 */
export function getEmbeddingDimensions() {
  const value = Number(process.env.EMBEDDING_DIMENSIONS);
  return Number.isFinite(value) && value > 0 ? value : null;
}

async function embedGemini(text, model, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${model}`,
      content: { parts: [{ text }] }
    })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini embedding failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error("Gemini embedding response missing values");
  return values;
}

async function embedOpenAI(text, model, apiKey) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, input: text })
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI embedding failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const values = data?.data?.[0]?.embedding;
  if (!Array.isArray(values)) throw new Error("OpenAI embedding response missing embedding");
  return values;
}

/**
 * Generate a dense embedding for the given text.
 *
 * @param {string} text
 * @returns {Promise<number[]|null>} The embedding vector, or `null` when embeddings are disabled.
 */
export async function getEmbedding(text) {
  const clean = String(text || "").trim();
  if (!clean) return null;

  const provider = resolveProvider();
  if (!provider) return null;

  const apiKey = resolveApiKey(provider);
  if (!apiKey) return null;

  const cacheKey = `${provider}:${resolveModel(provider)}:${clean}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const model = resolveModel(provider);
  const values = provider === "openai"
    ? await embedOpenAI(clean, model, apiKey)
    : await embedGemini(clean, model, apiKey);

  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(cacheKey, values);
  return values;
}

export default {
  isEmbeddingEnabled,
  getEmbeddingDimensions,
  getEmbedding
};
