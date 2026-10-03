import { connectToDatabase, closeDatabase } from "../backend/src/db/connection.js";
import { incidentSchemaValidator, counterSchemaValidator, feedbackSchemaValidator } from "../backend/src/models/schemas.js";

/**
 * Creates MongoDB collections with JSON Schema validation and applies required unique & text indexes.
 */
export async function createIndexes() {
  const { client, db } = await connectToDatabase();

  try {
    console.log("Setting up MongoDB collections and schema validators...");

    // Helper to ensure collection with validator
    const collections = await db.listCollections().toArray();
    const existingNames = collections.map((c) => c.name);

    // 1. Incidents collection
    if (!existingNames.includes("incidents")) {
      await db.createCollection("incidents", { validator: incidentSchemaValidator });
      console.log(" Created 'incidents' collection with schema validation.");
    } else {
      await db.command({
        collMod: "incidents",
        validator: incidentSchemaValidator,
        validationLevel: "moderate"
      });
      console.log(" Updated 'incidents' collection validator.");
    }

    // 2. Counters collection
    if (!existingNames.includes("counters")) {
      await db.createCollection("counters", { validator: counterSchemaValidator });
      console.log(" Created 'counters' collection with schema validation.");
    } else {
      await db.command({
        collMod: "counters",
        validator: counterSchemaValidator,
        validationLevel: "moderate"
      });
      console.log(" Updated 'counters' collection validator.");
    }

    // 3. Feedback collection
    if (!existingNames.includes("feedback")) {
      await db.createCollection("feedback", { validator: feedbackSchemaValidator });
      console.log(" Created 'feedback' collection with schema validation.");
    } else {
      await db.command({
        collMod: "feedback",
        validator: feedbackSchemaValidator,
        validationLevel: "moderate"
      });
      console.log(" Updated 'feedback' collection validator.");
    }

    console.log("\nBuilding database indexes...");

    // Unique index on incidentNumber to guarantee zero collisions
    await db.collection("incidents").createIndex(
      { incidentNumber: 1 },
      { unique: true, name: "idx_unique_incident_number" }
    );
    console.log(" Created unique index: incidents.incidentNumber");

    // Compound index on service and severity for quick filtering
    await db.collection("incidents").createIndex(
      { service: 1, severity: 1, createdAt: -1 },
      { name: "idx_service_severity_created" }
    );
    console.log(" Created index: incidents (service, severity, createdAt)");

    // Text search index for traditional keyword & hybrid search fallback
    await db.collection("incidents").createIndex(
      {
        title: "text",
        description: "text",
        symptoms: "text",
        rootCause: "text",
        resolution: "text"
      },
      {
        weights: {
          title: 10,
          rootCause: 8,
          symptoms: 6,
          description: 5,
          resolution: 4
        },
        name: "idx_text_search_incident_memory"
      }
    );
    console.log(" Created weighted text index: incidents (title, rootCause, symptoms, description, resolution)");

    // Index on feedback incidentNumber
    await db.collection("feedback").createIndex(
      { incidentNumber: 1 },
      { name: "idx_feedback_incident_number" }
    );
    console.log(" Created index: feedback.incidentNumber");

    console.log("\nAll MongoDB collections and indexes are successfully configured!");
  } catch (error) {
    console.error("Error creating indexes:", error);
    throw error;
  } finally {
    await closeDatabase();
  }
}

// Auto-run when executed directly
if (process.argv[1]?.endsWith("create-indexes.js")) {
  createIndexes().catch(() => process.exit(1));
}

export default createIndexes;
