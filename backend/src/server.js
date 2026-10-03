import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabase, connectToDatabase, startDemoDatabase } from "./db/connection.js";
import { setupDatabase } from "./db/setup.js";
import { getNextIncidentNumber } from "./services/counterService.js";
import {
  cosineSimilarity,
  createEmbeddings,
  generateGroundedBrief,
  incidentEmbeddingText,
  indexMissingIncidentEmbeddings
} from "./services/localRagService.js";
import { seedDatabase } from "../../scripts/seed.js";

const strongSemanticThreshold = 0.70;
const strongCombinedThreshold = 0.60;
const strongTextThreshold = 8;

const app = express();
const port = Number(process.env.PORT || 5000);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(currentDirectory, "../../../frontend/dist");

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_request, response) => {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    response.json({ status: "ok", database: db.databaseName });
  } catch (error) {
    response.status(503).json({ error: error.message });
  }
});

app.get("/api/stats", async (_request, response, next) => {
  try {
    const { db } = await connectToDatabase();
    const [total, services, helpful, notHelpful] = await Promise.all([
      db.collection("incidents").countDocuments({ status: "resolved" }),
      db.collection("incidents").distinct("service", { status: "resolved" }),
      db.collection("feedback").countDocuments({ rating: "helpful" }),
      db.collection("feedback").countDocuments({ rating: "not_helpful" })
    ]);
    response.json({ total, serviceCount: services.length, helpful, notHelpful });
  } catch (error) {
    next(error);
  }
});

app.get("/api/incidents", async (request, response, next) => {
  try {
    const { db } = await connectToDatabase();
    const query = String(request.query.q || "").trim();
    const limit = Math.min(Math.max(Number(request.query.limit) || 8, 1), 25);
    const collection = db.collection("incidents");
    let textMatches;

    if (query) {
      textMatches = await collection.find(
        { $text: { $search: query }, status: "resolved" },
        { projection: { score: { $meta: "textScore" } } }
      ).sort({ score: { $meta: "textScore" }, resolvedAt: -1 }).limit(25).toArray();
    } else {
      textMatches = await collection.find({ status: "resolved" })
        .sort({ resolvedAt: -1 }).limit(limit).toArray();
    }

    if (!query) {
      return response.json({ incidents: textMatches, query, mode: "text" });
    }

    try {
      const [queryEmbedding] = await createEmbeddings([query]);
      const vectorMatches = await collection.find({ status: "resolved", embedding: { $exists: true } }).toArray();
      if (vectorMatches.length > 0) {
        const textScores = new Map(textMatches.map((item) => [String(item._id), item.score || 0]));
        const incidents = vectorMatches.map(({ embedding, ...item }) => {
          const textScore = textScores.get(String(item._id)) || 0;
          const semanticScore = Math.max(0, cosineSimilarity(queryEmbedding, embedding));
          const textRelevance = textScore / (textScore + 12);
          return {
            ...item,
            score: semanticScore * 0.72 + textRelevance * 0.28,
            semanticScore,
            textScore,
            textRelevance
          };
        }).sort((left, right) => right.score - left.score).slice(0, limit);
        const strongMatches = incidents.filter((item) => item.semanticScore >= strongSemanticThreshold && item.score >= strongCombinedThreshold);
        const hasStrongMatch = strongMatches.length > 0;
        return response.json({
          incidents: hasStrongMatch ? strongMatches : incidents.slice(0, 2),
          query,
          mode: "local-hybrid",
          confidence: hasStrongMatch ? "high" : "low",
          strongMatch: hasStrongMatch
        });
      }
    } catch (error) {
      console.warn(`Local semantic retrieval unavailable: ${error.message}`);
    }

    const strongTextMatches = textMatches.filter((item) => (item.score || 0) >= strongTextThreshold);
    const hasStrongTextMatch = strongTextMatches.length > 0;
    response.json({
      incidents: (hasStrongTextMatch ? strongTextMatches : textMatches.slice(0, 2))
        .slice(0, limit)
        .map((item) => ({ ...item, textScore: item.score || 0 })),
      query,
      mode: "text",
      confidence: hasStrongTextMatch ? "high" : "low",
      strongMatch: hasStrongTextMatch
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/brief", async (request, response, next) => {
  try {
    const ids = Array.isArray(request.body.retrievedIncidents)
      ? request.body.retrievedIncidents.map(String).slice(0, 3)
      : [];
    const { db } = await connectToDatabase();
    const evidence = await db.collection("incidents")
      .find({ incidentNumber: { $in: ids }, status: "resolved" })
      .toArray();
    const brief = await generateGroundedBrief(request.body.incident || {}, evidence, {
      strongMatch: request.body.strongMatch === true
    });
    response.json({ brief });
  } catch (error) {
    next(error);
  }
});

app.post("/api/incidents/resolve", async (request, response, next) => {
  try {
    const fields = ["title", "description", "service", "environment", "severity", "rootCause", "resolution"];
    const incident = Object.fromEntries(fields.map((field) => [field, String(request.body[field] || "").trim()]));
    const missing = fields.filter((field) => !incident[field]);
    if (missing.length) {
      return response.status(400).json({ error: `Required fields: ${missing.join(", ")}` });
    }

    const { db } = await connectToDatabase();
    const now = new Date();
    const incidentNumber = await getNextIncidentNumber(db);
    const document = {
      ...incident,
      incidentNumber,
      symptoms: Array.isArray(request.body.symptoms) ? request.body.symptoms.map(String).slice(0, 12) : [],
      errorMessage: String(request.body.errorMessage || "").trim() || null,
      resolutionSummary: String(request.body.resolutionSummary || incident.resolution).trim(),
      status: "resolved",
      createdAt: now,
      resolvedAt: now
    };

    try {
      [document.embedding] = await createEmbeddings([incidentEmbeddingText(document)]);
    } catch (error) {
      console.warn(`Incident saved without a local embedding: ${error.message}`);
    }
    await db.collection("incidents").insertOne(document);
    response.status(201).json({ incident: document });
  } catch (error) {
    next(error);
  }
});

app.post("/api/feedback", async (request, response, next) => {
  try {
    const { incidentNumber, rating } = request.body;
    if (!incidentNumber || !["helpful", "not_helpful"].includes(rating)) {
      return response.status(400).json({ error: "A resolved incident and a valid rating are required." });
    }

    const { db } = await connectToDatabase();
    await db.collection("feedback").insertOne({
      incidentNumber: String(incidentNumber),
      rating,
      comment: String(request.body.comment || "").trim(),
      retrievedIncidents: Array.isArray(request.body.retrievedIncidents)
        ? request.body.retrievedIncidents.map(String).slice(0, 10)
        : [],
      createdAt: new Date()
    });
    response.status(201).json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(frontendDist));
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "The request could not be completed." });
});

async function start() {
  await startDemoDatabase();
  const { db } = await connectToDatabase();
  await setupDatabase(db);
  await seedDatabase({ closeConnection: false });
  console.log("Generating local embeddings for incidents if needed...");
  try {
    const indexed = await indexMissingIncidentEmbeddings(db);
    if (indexed) console.log(`Created local embeddings for ${indexed} incidents.`);
  } catch (error) {
    console.warn(`Local semantic search unavailable: ${error.message}`);
  }

  app.listen(port, "127.0.0.1", () => {
    console.log(`OpsMemory API listening at http://127.0.0.1:${port}`);
  });
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await closeDatabase();
    process.exit(0);
  });
}

try {
  await start();
} catch (error) {
  console.error("OpsMemory failed to start:", error);
  await closeDatabase();
  process.exit(1);
}