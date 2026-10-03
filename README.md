# OpsMemory

OpsMemory is an incident-intelligence workspace that turns resolved IT incidents into searchable engineering memory. Engineers can search historical incidents, review a grounded troubleshooting brief, resolve the current incident, and save the new resolution for future searches.

## Application preview

![OpsMemory incident intelligence workspace](docs/main%20page.png)

The workspace brings incident intake, historical memory, grounded evidence, and **Resolve & remember** into one screen.

### Evidence brief

![Grounded incident evidence brief](docs/rag%20output%20page.png)

The evidence panel summarizes retrieved history, highlights the next action, and identifies the MongoDB-backed incident evidence used for the recommendation.

### Similar incidents and resolution

![Similar incidents and resolve workflow](docs/similar%20inciden%20vector%20search%20output%20page.png)

![Resolve and remember form](docs/resolve%20and%20remember%20page.png)

The workflow connects historical matches to the resolution form, then saves the new incident number and feedback for future searches.

## What is implemented

- React and Vite incident workspace with responsive investigation, resolution, and feedback flows.
- Express API backed by MongoDB collections for incidents, counters, and feedback.
- MongoDB schema validation, unique incident numbers, compound indexes, and weighted text search.
- Local semantic reranking with Ollama embeddings when available.
- Grounded local incident briefs using Ollama; citations are limited to retrieved incident records.
- Automatic fallback to MongoDB text search and evidence-only briefs when Ollama is unavailable.
- Embedded MongoDB demo database with 12 seeded synthetic incidents, so the default demo needs no Atlas account or API key.

## 🍃 MongoDB Features Implemented

OpsMemory leverages MongoDB not just as a database, but as the core **incident memory & intelligence engine**:

| MongoDB Feature | Implementation in OpsMemory | Purpose / Advantage |
|:---|:---|:---|
| **Document Data Modeling** | Rich JSON document schema storing symptoms, error codes, root causes, resolutions, dense embeddings, and feedback together. | Keeps complete operational context intact without complex multi-table SQL joins. |
| **Schema Validation (`$jsonSchema`)** | Strict JSON schema validators on `incidents`, `counters`, and `feedback` collections with enums and regex patterns. | Ensures data integrity for severity levels, environments, and formatted incident IDs. |
| **Unique Indexes** | Unique index `idx_unique_incident_number` on `incidents.incidentNumber`. | Guarantees zero duplicate incident numbers across concurrent resolutions. |
| **Weighted Text Search (`$text`)** | Compound `$text` index with custom weights (`title`: 10, `rootCause`: 8, `symptoms`: 6, `description`: 5, `resolution`: 4). | Prioritizes exact technical terms (e.g. *Horizon*, *FSLogix*, *GPO*, *DNS*) during historical queries. |
| **Atlas Vector & Hybrid Search** | Dense vector embeddings stored in `embedding` array + `$vectorSearch` pipeline stage combining cosine similarity with text scores. | Retrieves semantically similar historical incidents even when different engineers use completely different wording. |
| **Atomic Sequences (`$inc`)** | `counters` collection using `findOneAndUpdate` with `$inc` and `upsert: true`. | Generates formatted, sequential incident numbers (`INC-2026-0001`, `INC-2026-0002`) safely without race conditions. |
| **Aggregation Framework** | Real-time `countDocuments`, `distinct`, and query filtering on `incidents` and `feedback`. | Powers the live operational dashboard displaying remembered incidents, service coverage, and helpfulness metrics. |

## Application flow

1. Enter an incident title, description, service, environment, severity, symptoms, and optional error message.
2. Select **Find similar incidents** to retrieve related resolved incidents.
3. Review the evidence brief and historical root causes and resolutions.
4. Complete **Resolve & remember** with the current root cause and resolution.
5. Save the incident, receive a generated incident number, and make the resolution searchable.
6. Submit helpful or not-helpful feedback on the retrieved guidance.

## Run locally

Requirements: Node.js 20.19 or newer, npm, and Ollama.

```bash
npm install
ollama pull nomic-embed-text
ollama pull nemotron-3-nano:4b
npm run dev
```

Open <http://127.0.0.1:5173>. The Vite frontend proxies `/api` requests to the Express server on port `5000`. On first startup, `mongodb-memory-server` may download a MongoDB binary, and the API initializes its collections, indexes, seed data, and missing embeddings.

The default database is in memory and resets when the API stops. Seeded incidents are recreated on each start.

## MongoDB Atlas

For persistent storage, copy `.env.example` to `.env` and set:

```env
MONGODB_URI=<your MongoDB connection string>
MONGODB_DATABASE=opsmemory
```

Keep `.env` private. The API still uses the configured Ollama models for local embeddings and generation.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API and Vite frontend together |
| `npm run build` | Build the frontend bundle |
| `npm start` | Start the API; serves `frontend/dist` after a build |
| `npm run seed` | Seed a separately running MongoDB instance |
| `npm run indexes` | Create indexes for a separately running MongoDB instance |
| `npm run embeddings` | Generate embeddings using the configured provider |
| `npm run setup:vector-index` | Configure the optional vector index |
| `npm run test:search` | Run the search smoke-test script |

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and MongoDB availability |
| `GET` | `/api/stats` | Return incident and feedback summary counts |
| `GET` | `/api/incidents?q=...&limit=...` | Search resolved incidents or list recent records |
| `POST` | `/api/brief` | Generate a brief from the current incident and retrieved evidence |
| `POST` | `/api/incidents/resolve` | Save a resolved incident and allocate its incident number |
| `POST` | `/api/feedback` | Store helpful/not-helpful feedback |

## Project structure

```text
backend/src/server.js                 Express API and application startup
backend/src/db/                       MongoDB connection and setup
backend/src/services/                 Counters, retrieval, embeddings, and briefs
backend/src/prompts/                  Grounding prompt used by the local brief generator
frontend/src/                         React workspace and styling
scripts/                              Seed, index, embedding, and smoke-test utilities
.env.example                          Optional MongoDB, Ollama, and search configuration
```

## Scope and limitations

This is a local demonstration application. The default database is ephemeral, Ollama is optional, and native Atlas Vector Search pipelines are not required by the default search path. Historical evidence and generated recommendations should be reviewed by an engineer before action.
