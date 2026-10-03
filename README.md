# OpsMemory

OpsMemory turns resolved IT incidents into searchable engineering memory. This repository includes a local incident workspace with semantic retrieval, an on-device evidence brief, and a resolve-and-remember loop.

## Run Locally

Requirements: Node.js 20.19 or newer, npm, and Ollama. Docker, a MongoDB account, and API keys are not required for the default demo. Pull the models once if they are not already installed:

```bash
ollama pull nomic-embed-text
ollama pull nemotron-3-nano:4b
npm install
npm run dev
```

Open <http://127.0.0.1:5173>. The API runs on port `5000`; Vite forwards `/api` requests to it. On first startup, `mongodb-memory-server` downloads a MongoDB server binary, then the app creates its collections and indexes, loads the 12 sample incidents, and generates their local embeddings. An internet connection is needed for the initial model and MongoDB binary downloads.

The default database is held in memory and resets when the API process stops. The seeded incidents return on every start. Newly resolved demo incidents and submitted feedback are temporary.

## Demo Flow

1. The workspace opens with blank incident title, symptom, and error fields. Enter an incident and choose **Find similar incidents**.
2. Review the Nemotron brief and select a historical result to inspect its saved root cause and resolution.
3. After searching, enter the current root cause and resolution in the separate **Resolve & remember** panel.
4. The app saves those fields with the exact incident snapshot that was searched, assigns an incident number, creates an embedding, and searches again. The new record should appear in the results.
5. Editing the incident after searching clears the old search snapshot; search again before saving its resolution.
6. Record whether the recommendation was helpful.

The local model receives only the current report and retrieved incident records. Its citations are restricted to those records. If Ollama is unavailable, search falls back to MongoDB text search and the brief falls back to evidence-only mode.

## Use MongoDB Atlas

To use a persistent Atlas database instead of the embedded local database:

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your Atlas connection string and `MONGODB_DATABASE` to `opsmemory`.
3. Run `npm run dev` as usual.

Keep `.env` private. `npm run indexes` and `npm run seed` are standalone scripts for a separately running MongoDB instance; the demo server initializes indexes and seeds the sample data automatically.

## Current Scope

- MongoDB collections with schema validation, weighted text index, service/severity index, unique incident-number index, counters, incident embeddings, and feedback.
- API endpoints for health, summary statistics, text search with local vector reranking, grounded local generation, resolving incidents, and feedback.
- Responsive React incident workspace and local MongoDB/Ollama demo loop.
- Local semantic reranking currently runs in the Node API using embeddings stored in MongoDB. Native Atlas Vector Search pipelines and a production deployment are not configured.

To build the frontend bundle and run the API serving that bundle:

```bash
npm run build
npm start
```