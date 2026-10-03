/**
 * OpsMemory Backend API
 *
 * Express server exposing the search/retrieval layer (Person 2).
 * Person 3 (AI/RAG) and Person 1's resolve workflow mount their routes here.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectToDatabase, closeDatabase } from "./db/connection.js";
import { isEmbeddingEnabled } from "./services/embeddingService.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", async (req, res) => {
    const health = {
      status: "ok",
      mongo: "unknown",
      embeddings: isEmbeddingEnabled() ? "enabled" : "disabled"
    };

    try {
      const { db } = await connectToDatabase();
      await db.command({ ping: 1 });
      health.mongo = "connected";
    } catch (error) {
      health.status = "degraded";
      health.mongo = "unreachable";
      health.detail = error.message;
    }

    res.status(health.mongo === "connected" ? 200 : 503).json(health);
  });

  app.use("/api", searchRoutes);

  // Central error handler keeps API responses JSON-shaped.
  app.use((error, req, res, next) => {
    console.error("[api] Unhandled error:", error);
    if (res.headersSent) return next(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  });

  return app;
}

async function start() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.warn(`[startup] MongoDB not reachable yet: ${error.message}`);
    console.warn("[startup] Server will start; /api/health will report degraded until it connects.");
  }

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`OpsMemory API listening on http://localhost:${PORT}`);
    console.log(`  POST http://localhost:${PORT}/api/incidents/search`);
    console.log(`  GET  http://localhost:${PORT}/api/health`);
  });

  const shutdown = async () => {
    server.close();
    await closeDatabase();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (process.argv[1]?.endsWith("server.js")) {
  start();
}

export default createApp;
