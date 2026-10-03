# OpsMemory

> **Turn every resolved IT incident into searchable engineering memory, so the next engineer can solve similar incidents faster.**

Built for the **MongoDB Student Builder Day**.

---

## Architecture & Data Models (Phase 1)

### Collections

- **`incidents`**: Historical operational incidents, symptom list, error messages, root causes, resolutions, timestamps, and dense vector embeddings.
  - Unique index: `incidentNumber` (`INC-YYYY-NNNN`)
  - Compound index: `(service, severity, createdAt)`
  - Full-text search index: `(title, description, symptoms, rootCause, resolution)`
- **`counters`**: Atomic sequential counter for generating unique collision-free incident numbers on incident resolution.
- **`feedback`**: Engineer feedback tracking whether retrieved incident memory was helpful or unhelpful for analytics and relevance ranking.

---

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env` and provide your MongoDB connection string:

```bash
cp .env.example .env
```

Set:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=opsmemory
```

### 2. Run Database Seeding & Index Setup

```bash
# Seed 12 synthetic IT incidents & configure atomic sequence counter
node scripts/seed.js

# Or using npm
npm run seed
```
