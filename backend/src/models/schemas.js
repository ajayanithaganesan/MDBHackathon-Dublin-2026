/**
 * MongoDB Schema Validation & Index Specifications for OpsMemory
 *
 * Collections:
 * - incidents: Stores resolved IT operational incidents, root causes, embeddings, and resolutions
 * - counters: Handles atomic sequence numbering for incident IDs (e.g. INC-2026-0001)
 * - feedback: Stores engineer utility feedback (helpful/unhelpful) on AI-retrieved incident recommendations
 */

export const incidentSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["incidentNumber", "title", "description", "service", "environment", "severity", "status", "rootCause", "resolution"],
    properties: {
      incidentNumber: {
        bsonType: "string",
        pattern: "^INC-[0-9]{4}-[0-9]{4,}$",
        description: "Unique formatted incident ID (e.g., INC-2026-0001) - required"
      },
      title: {
        bsonType: "string",
        description: "Summary title of the incident - required"
      },
      description: {
        bsonType: "string",
        description: "Detailed description of symptoms and problem - required"
      },
      service: {
        bsonType: "string",
        description: "Affected service/technology (e.g., VMware Horizon, Windows GPO, Azure, DNS/VPN) - required"
      },
      environment: {
        bsonType: "string",
        enum: ["Production", "Staging", "Development", "DR"],
        description: "Operational environment where incident occurred - required"
      },
      severity: {
        bsonType: "string",
        enum: ["Critical", "High", "Medium", "Low"],
        description: "Incident severity level - required"
      },
      symptoms: {
        bsonType: "array",
        items: {
          bsonType: "string"
        },
        description: "List of observable symptoms and error behaviors"
      },
      errorMessage: {
        bsonType: ["string", "null"],
        description: "Exact error message, code, or stack trace if present"
      },
      rootCause: {
        bsonType: "string",
        description: "Underlying diagnosed cause of the incident - required"
      },
      resolution: {
        bsonType: "string",
        description: "Actionable engineering resolution and rollback/fix details - required"
      },
      resolutionSummary: {
        bsonType: "string",
        description: "One-line brief summary of how the issue was fixed"
      },
      status: {
        bsonType: "string",
        enum: ["resolved", "investigating", "mitigated"],
        description: "Resolution status - required"
      },
      createdAt: {
        bsonType: "date",
        description: "Timestamp when incident was first logged"
      },
      resolvedAt: {
        bsonType: "date",
        description: "Timestamp when incident was resolved & remembered"
      },
      embedding: {
        bsonType: "array",
        items: {
          bsonType: "double"
        },
        description: "Dense vector embedding of incident details for vector search"
      }
    }
  }
};

export const counterSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["_id", "sequence"],
    properties: {
      _id: {
        bsonType: "string",
        description: "Counter identifier name (e.g., incident_counter_2026)"
      },
      sequence: {
        bsonType: ["int", "long"],
        description: "Current atomic sequence number value"
      },
      year: {
        bsonType: ["int", "long"],
        description: "Optional sequence year reference"
      },
      updatedAt: {
        bsonType: "date",
        description: "Last increment timestamp"
      }
    }
  }
};

export const feedbackSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: ["incidentNumber", "rating", "retrievedIncidents"],
    properties: {
      incidentNumber: {
        bsonType: "string",
        description: "Reference to the resolved incident"
      },
      rating: {
        bsonType: "string",
        enum: ["helpful", "not_helpful"],
        description: "Engineer feedback on AI-retrieved recommendations"
      },
      comment: {
        bsonType: "string",
        description: "Optional notes from engineer on recommendation accuracy"
      },
      retrievedIncidents: {
        bsonType: "array",
        items: {
          bsonType: "string"
        },
        description: "List of incidentNumbers that were provided as AI context"
      },
      createdAt: {
        bsonType: "date",
        description: "Feedback submission timestamp"
      }
    }
  }
};

export default {
  incidentSchemaValidator,
  counterSchemaValidator,
  feedbackSchemaValidator
};
