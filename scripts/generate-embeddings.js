/**
 * Embedding backfill (optional, supports Person 3's vector pipeline).
 *
 * Generates/refreshes the `embedding` vector for every incident so that
 * Atlas Vector Search has data to retrieve. Safe to rerun; use --force to
 * recompute vectors that already exist.
 */

import { connectToDatabase, closeDatabase } from "../backend/src/db/connection.js";
import { getEmbedding, isEmbeddingEnabled } from "../backend/src/services/embeddingService.js";

function buildEmbeddingText(incident) {
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

export async function generateEmbeddings({ force = false } = {}) {
  if (!isEmbeddingEnabled()) {
    console.warn(
      "Embeddings disabled: set EMBEDDING_PROVIDER + (GEMINI_API_KEY | OPENAI_API_KEY | LLM_API_KEY) " +
        "in .env, then rerun `npm run embeddings`."
    );
    return { updated: 0, skipped: 0 };
  }

  const { db } = await connectToDatabase();
  const collection = db.collection("incidents");

  const filter = force ? {} : { embedding: { $exists: false } };
  const incidents = await collection.find(filter).toArray();

  let updated = 0;
  let skipped = 0;

  for (const incident of incidents) {
    const vector = await getEmbedding(buildEmbeddingText(incident));
    if (!vector) {
      skipped++;
      continue;
    }
    await collection.updateOne({ _id: incident._id }, { $set: { embedding: vector } });
    updated++;
    console.log(` [EMBEDDED] ${incident.incidentNumber} (${vector.length} dims)`);
  }

  console.log(`\nEmbedding backfill complete. Updated: ${updated}, skipped: ${skipped}.`);
  return { updated, skipped };
}

if (process.argv[1]?.endsWith("generate-embeddings.js")) {
  generateEmbeddings({ force: process.argv.includes("--force") })
    .catch((error) => {
      console.error("Embedding backfill failed:", error.message);
      process.exit(1);
    })
    .finally(() => closeDatabase());
}

export default generateEmbeddings;
