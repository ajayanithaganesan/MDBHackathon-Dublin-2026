/**
 * Atlas Vector Search index setup helper (Person 2).
 *
 * MongoDB `$vectorSearch` requires an Atlas Vector Search index that CANNOT be
 * created from the Node driver. This script prints the exact index definition
 * to paste into the Atlas UI (Atlas Search → Create Search Index → JSON Editor),
 * or create it via the Atlas Admin API.
 *
 * Index name must match VECTOR_INDEX_NAME (default: vector_index_incidents).
 */

const indexName = process.env.VECTOR_INDEX_NAME || "vector_index_incidents";
const database = process.env.MONGODB_DATABASE || "opsmemory";

const dimensions = Number(process.env.EMBEDDING_DIMENSIONS) || 768;

const definition = {
  name: indexName,
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: dimensions,
        similarity: "cosine"
      },
      {
        type: "filter",
        path: "status"
      }
    ]
  }
};

console.log("Atlas Vector Search index for OpsMemory");
console.log("=======================================");
console.log(`Database : ${database}`);
console.log(`Collection: incidents`);
console.log(`Index name: ${indexName}  (must match VECTOR_INDEX_NAME)`);
console.log(`Dimensions: ${dimensions}  (set EMBEDDING_DIMENSIONS to your model's size)`);
console.log("\nJSON definition to paste into the Atlas UI:\n");
console.log(JSON.stringify(definition.definition, null, 2));
console.log(
  "\nNotes:\n" +
    "- Gemini text-embedding-004 => 768 dimensions\n" +
    "- OpenAI text-embedding-3-small => 1536 dimensions\n" +
    "- The `filter` on `status` lets search restrict to resolved incidents.\n" +
    "- Backfill vectors with: npm run embeddings\n"
);
