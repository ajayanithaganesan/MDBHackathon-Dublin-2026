import {
  counterSchemaValidator,
  feedbackSchemaValidator,
  incidentSchemaValidator
} from "../models/schemas.js";

export async function setupDatabase(db) {
  const collections = await db.listCollections().toArray();
  const existingNames = new Set(collections.map(({ name }) => name));
  const validators = {
    incidents: incidentSchemaValidator,
    counters: counterSchemaValidator,
    feedback: feedbackSchemaValidator
  };

  for (const [name, validator] of Object.entries(validators)) {
    if (existingNames.has(name)) {
      await db.command({ collMod: name, validator, validationLevel: "moderate" });
    } else {
      await db.createCollection(name, { validator });
    }
  }

  await db.collection("incidents").createIndex(
    { incidentNumber: 1 },
    { unique: true, name: "idx_unique_incident_number" }
  );
  await db.collection("incidents").createIndex(
    { service: 1, severity: 1, createdAt: -1 },
    { name: "idx_service_severity_created" }
  );
  await db.collection("incidents").createIndex(
    { title: "text", description: "text", symptoms: "text", rootCause: "text", resolution: "text" },
    {
      weights: { title: 10, rootCause: 8, symptoms: 6, description: 5, resolution: 4 },
      name: "idx_text_search_incident_memory"
    }
  );
  await db.collection("feedback").createIndex(
    { incidentNumber: 1 },
    { name: "idx_feedback_incident_number" }
  );
}

export default setupDatabase;