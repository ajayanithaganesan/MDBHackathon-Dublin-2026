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
