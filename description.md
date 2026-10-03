# OpsMemory Project Description

## What It Does

OpsMemory is an incident-memory workspace. An engineer enters a current IT incident, retrieves related resolved incidents, reviews their saved causes and fixes, records the new resolution, and rates whether the retrieved guidance was useful.

The local demo includes a seeded set of 12 synthetic incidents across VMware Horizon, Windows GPO, Azure, and DNS/VPN. The incident form starts blank; users enter their own report before searching.

## Current Demo Workflow

1. The engineer enters a title, symptoms, and optional error message, then searches. The incident form does not contain a prefilled scenario.
2. The API retrieves incidents using MongoDB's weighted text index and, when Ollama is available, reranks them with local embeddings.
3. The UI displays matching incidents with their stored root causes and resolutions.
4. The API creates an evidence brief with the local Nemotron model. It receives the current report and up to three retrieved records; returned citations are restricted to those records.
5. After a successful search, the engineer enters a root cause and resolution in the separate **Resolve & remember** form.
6. The API saves those fields with the exact incident snapshot that was searched, allocates the next incident number, creates an embedding when Ollama is available, and stores the resolved incident in MongoDB. Editing the report invalidates that search snapshot, so the report must be searched again before resolving.
7. The UI searches again so the new incident can appear in memory, then accepts helpful or not-helpful feedback.

If local Ollama embedding or generation is unavailable, keyword search or an evidence-only brief is used instead. This is a local demo workflow, not a production incident-management system.

## Architecture

```text
React + Vite workspace (127.0.0.1:5173)
                 |
                 | /api proxy
                 v
Express API (127.0.0.1:5000)
       |                         |
       | MongoDB driver           | Ollama HTTP API
       v                         v
MongoDB demo database       Nomic embeddings
                            Nemotron generation
```

The default server starts `mongodb-memory-server`, so Docker and an Atlas account are not required. If `MONGODB_URI` is set, the API connects to that configured MongoDB deployment instead. Ollama runs separately on `127.0.0.1:11434` by default.

## Data Model

### `incidents`

Resolved incidents contain an incident number, title, description, service, environment, severity, symptoms, optional error message, root cause, resolution, status, timestamps, and optionally an embedding array. Required fields and allowed values are defined by the JSON Schema validator in `backend/src/models/schemas.js`.

Indexes created at startup:

- Unique index on `incidentNumber`.
- Compound index on `service`, `severity`, and `createdAt`.
- Weighted text index over `title`, `description`, `symptoms`, `rootCause`, and `resolution`.

### `counters`

Stores an atomic sequence per year. `getNextIncidentNumber` increments the counter using MongoDB `findOneAndUpdate` and formats IDs such as `INC-2026-0013`. The seed routine only raises the sequence to at least the largest seeded ID, so reseeding does not lower a counter.

### `feedback`

Stores the resolved incident number, rating (`helpful` or `not_helpful`), optional comment, retrieved incident numbers, and creation time. Summary counts are returned by the stats endpoint.

## Retrieval and Local RAG

The local embedding model is `nomic-embed-text`; the local generation model is `nemotron-3-nano:4b`. The app does not require API keys for these local model calls.

At startup, the API generates and stores embeddings for seeded incidents that do not already have one. For a query, it embeds the query, retrieves text matches with MongoDB `$text`, reads incidents with embeddings, and computes cosine similarity in the Node API. The current combined score is:

```text
0.72 * max(0, cosine similarity) + 0.28 * (text score / (text score + 12))
```

A local-hybrid result is considered strong when cosine similarity is at least `0.70` and the combined score is at least `0.60`. In text-only fallback mode, a MongoDB text score of at least `8` is considered strong. If no result passes these thresholds, search returns at most two partial records and marks the search confidence LOW. These are initial demo thresholds and should be calibrated with labeled examples before production use.

The editable generation system prompt is `backend/src/prompts/incident-brief-system.md`. It tells the model to preserve the application's confidence classification, cite only supplied incident IDs, and recommend human verification when no strong historical match exists.

This reranking is performed in application code. The stored embedding arrays are not queried with MongoDB's native `$vectorSearch` operator, and no Atlas Vector Search index is configured. The brief is grounded in retrieved incident records; it is still model-generated text and should be checked by the engineer before acting.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Ping MongoDB and report the database name. |
| `GET` | `/api/stats` | Return resolved incident count, service count, and feedback counts. |
| `GET` | `/api/incidents?q=...&limit=...` | Search resolved incidents; defaults to the latest records when `q` is empty. Returns `mode: "local-hybrid"` when local reranking succeeds, otherwise `mode: "text"`. |
| `POST` | `/api/brief` | Generate a brief from the current incident and up to three resolved incident IDs retrieved from MongoDB. |
| `POST` | `/api/incidents/resolve` | Validate required fields, allocate an incident number, and insert the resolved incident. |
| `POST` | `/api/feedback` | Store a helpful/not-helpful rating and its retrieved incident references. |

## Important Files

- `package.json`: dependencies and `dev`, `build`, `start`, `seed`, and `indexes` commands.
- `backend/src/server.js`: API routes and application startup sequence.
- `backend/src/db/connection.js`: MongoDB connection and embedded demo database lifecycle.
- `backend/src/db/setup.js`: collection validators and indexes applied at startup.
- `backend/src/models/schemas.js`: incident, counter, and feedback validators.
- `backend/src/services/counterService.js`: atomic incident-number generation.
- `backend/src/services/localRagService.js`: Ollama embeddings, cosine similarity, embedding backfill, grounded generation, and low-confidence fallback.
- `backend/src/prompts/incident-brief-system.md`: editable system prompt for high- and low-confidence RAG briefs.
- `scripts/seed.js`: the 12 synthetic incidents and sample feedback.
- `scripts/create-indexes.js`: standalone index setup for a separately running MongoDB instance.
- `frontend/src/App.jsx`: investigation, results, resolution, feedback, and evidence-brief UI.
- `frontend/src/styles.css`: responsive workspace styling.
- `.env.example`: optional MongoDB and Ollama configuration.

## Run Locally

Requirements: Node.js 20.19 or newer, npm, and Ollama. Install the models once if they are not already present:

```bash
ollama pull nomic-embed-text
ollama pull nemotron-3-nano:4b
npm install
npm run dev
```

Open <http://127.0.0.1:5173>. The first run may download the MongoDB server binary used by `mongodb-memory-server`; model and server downloads require internet access. The dev command starts the API and Vite UI together. The API initializes collections, validators, indexes, seed data, and missing embeddings before it begins listening.

For a built frontend served by the API:

```bash
npm run build
npm start
```

To use Atlas or another MongoDB deployment, copy `.env.example` to `.env` and set `MONGODB_URI` and `MONGODB_DATABASE`. The API still uses the configured local Ollama models for embeddings and generation unless those model settings are changed.

## Persistence and Boundaries

- The default embedded database is in-memory. Stopping the API resets demo-created incidents and feedback; the 12 seeds are loaded again at startup.
- The standalone `npm run seed` and `npm run indexes` commands connect to a separately running MongoDB instance; the app server performs setup and seeding automatically.
- Search uses MongoDB text search plus Node-side cosine reranking. Native Atlas Vector Search, vector-index management, and a production deployment are not implemented.
- The Python seed/schema files are alternate scaffolding; the runnable app path is Node.js, React, Vite, MongoDB, and Ollama.
- There is no automated test suite yet. The project has been validated by building the frontend and exercising the local search, resolve, feedback, and repeat-search flow in the browser.
