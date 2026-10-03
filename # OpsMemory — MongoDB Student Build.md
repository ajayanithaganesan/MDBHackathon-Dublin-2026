# OpsMemory — MongoDB Student Builder Day Implementation Plan

## 1. Project Overview

### Project Name

**OpsMemory**

### One-Line Pitch

> **OpsMemory turns every resolved IT incident into searchable engineering memory, so the next engineer can solve similar incidents faster.**

### Core Problem

IT/support engineers repeatedly solve incidents that look different on the surface but have the same underlying cause.

Useful knowledge often gets trapped in:

* Previous tickets
* Engineer memory
* Troubleshooting notes
* Chat conversations
* Previous fixes
* Internal documentation

OpsMemory creates a lightweight **incident memory layer**.

The system:

1. Accepts a new incident.
2. Searches previously resolved incidents using **MongoDB Hybrid Search**.
3. Retrieves relevant historical fixes.
4. Uses an LLM to generate a grounded troubleshooting recommendation.
5. Lets the engineer resolve the incident.
6. The **Resolve & Remember** button generates a unique incident number.
7. The complete resolution is stored in MongoDB.
8. The engineer provides feedback on whether the recommendation was useful.
9. The newly resolved incident becomes searchable memory for future incidents.

The core product loop is:

```text
NEW INCIDENT
     ↓
SEARCH MEMORY
     ↓
MONGODB HYBRID SEARCH
     ↓
RETRIEVE SIMILAR INCIDENTS
     ↓
AI TROUBLESHOOTING BRIEF
     ↓
ENGINEER RESOLVES INCIDENT
     ↓
"RESOLVE & REMEMBER"
     ↓
GENERATE INCIDENT NUMBER
     ↓
STORE RESOLUTION + FEEDBACK
     ↓
BECOMES FUTURE MEMORY
```

---

# 2. Why This Fits the Hackathon

The event asks teams to:

* Start the project during the event.
* Create a Git repository.
* Scope one user workflow that works end-to-end.
* Give MongoDB a meaningful role.
* Keep the input set small and repeatable.
* Test the normal workflow and a difficult case.
* Be able to explain the architecture and code.

OpsMemory directly fits the event's suggested **"application that remembers"** direction.

The event specifically gives examples such as an incident-response assistant that learns from previous fixes and an assistant that remembers project decisions.

MongoDB is not merely being used as a generic database.

It is responsible for:

* Incident document storage
* Resolution history
* Keyword search
* Vector Search
* Hybrid Search
* Unique incident numbers
* Feedback storage
* Aggregation
* Optional Change Streams

The event explicitly lists documents/data modelling, indexes and aggregation, Search/Vector Search, schema validation, unique indexes, Change Streams and TTL indexes as available MongoDB capabilities. It also states that there is **no checklist requiring every feature**.

---

# 3. Hackathon Priority

The project should be built according to three priority levels.

## P0 — Must Work

These features are mandatory.

### P0.1 New Incident

User enters:

* Incident title
* Description
* Service
* Environment
* Severity
* Optional error message

Example:

```text
Title:
Horizon VDI login failures after profile update

Description:
Users receive a black screen after authentication.
The issue started after the latest golden image update.
Around 15 users are affected.

Service:
VMware Horizon

Environment:
Production

Severity:
High
```

---

## P0.2 Search Historical Memory

After entering the incident:

```text
[ Find Similar Incidents ]
```

The application queries MongoDB using **Hybrid Search**.

Return the top 3–5 historical incidents.

Each result should display:

* Incident number
* Title
* Service
* Root cause
* Resolution
* Relevance/match indicator
* Feedback status

---

## P0.3 AI Troubleshooting Brief

Use the retrieved incidents as context for an LLM.

Example:

```text
LIKELY PATTERN

This incident resembles 3 previously resolved
Horizon incidents.

Most common historical root cause:
FSLogix profile/container issue.

RECOMMENDED INVESTIGATION

1. Check FSLogix profile attachment logs.
2. Compare the affected image with the previous image.
3. Verify profile/container accessibility.
4. Test with a known-good user profile.

HISTORICAL EVIDENCE

INC-2026-0007
INC-2026-0012
INC-2026-0018
```

The AI must distinguish:

```text
Historical Evidence
```

from:

```text
AI Inference
```

and:

```text
Recommended Investigation
```

It must never invent historical incidents.

---

# 4. P0.4 Resolve & Remember

This is the **hero feature**.

The primary button is:

```text
Resolve & Remember
```

When clicked:

```text
Engineer enters root cause
        ↓
Engineer enters resolution
        ↓
Resolve & Remember
        ↓
Generate unique incident number
        ↓
Save complete incident
        ↓
Generate/store embedding
        ↓
Mark incident as resolved
        ↓
Display incident number
```

Example:

```text
✓ Incident resolved and remembered

INC-2026-0024
```

This is the moment that differentiates OpsMemory from a normal incident chatbot.

The system isn't just saying:

> "Here is an answer."

It is saying:

> **"We solved this. Now I'll remember it."**

---

# 5. P0.5 Feedback

After resolution:

```text
Was this recommendation useful?

👍 Helpful

👎 Not Helpful

Optional comment:
[____________________________]
```

Store the feedback in MongoDB.

Feedback should contain:

* Incident number
* Rating
* Optional comment
* Retrieved historical incidents
* Timestamp

This creates a feedback loop.

```text
Search
 ↓
Recommendation
 ↓
Resolution
 ↓
Feedback
 ↓
Better historical memory
```

---

# 6. P0.6 Prove That Memory Works

This is extremely important for the demo.

After resolving an incident:

```text
INC-2026-0024
```

create a new similar incident.

Search again.

The newly resolved incident should appear.

This proves:

```text
I solved it once.
       ↓
OpsMemory remembered it.
       ↓
The next incident can use it.
```

---

# 7. P1 — Strong Enhancements

Only implement these after the complete P0 workflow is working.

## P1.1 Incident Detail View

Clicking an incident should display:

```text
INC-2026-0024

Title

Description

Service

Environment

Severity

Root Cause

Resolution

Feedback

Created

Resolved
```

---

## P1.2 Feedback-Aware Ranking

If two incidents have similar relevance:

```text
Incident A
Hybrid relevance: High
Feedback: Helpful

Incident B
Hybrid relevance: High
Feedback: Not Helpful
```

the application can optionally use feedback as a ranking signal.

Keep this simple.

Do not build a complicated ML ranking system.

---

## P1.3 Operational Dashboard

Use MongoDB aggregation to show:

```text
Total incidents remembered

Helpful recommendations

Not helpful recommendations

Most affected services

Most common root causes
```

Example:

```text
OPS MEMORY

24
Incidents Remembered

78%
Recommendations Helpful

Top Service
VMware Horizon

Top Issue
Profile / Login Failure
```

This gives MongoDB aggregation a visible role.

---

# 8. P2 — Stretch Features

Only attempt these if the core workflow is stable.

## P2.1 Change Streams

Possible architecture:

```text
Resolve & Remember
        ↓
MongoDB Insert
        ↓
Change Stream
        ↓
Detect New Resolution
        ↓
Generate/Update Embedding
        ↓
Memory Becomes Searchable
```

This creates a strong technical story.

However:

**Do not let Change Streams jeopardize the core demo.**

If it becomes unstable, use synchronous processing.

---

## P2.2 TTL Index

TTL could be used for temporary records such as:

* Temporary search sessions
* Temporary AI context
* Short-lived demo data

Do **not** use TTL for permanent incident memory.

Resolved incidents should remain searchable.

---

## P2.3 Retrieval Explanation

Optional UI:

```text
Why was this incident retrieved?
```

Show:

```text
Semantic similarity
+
Keyword match
+
Service match
+
Historical feedback
```

This makes the Hybrid Search story easier to explain.

---

# 9. Architecture

Keep the architecture simple.

```text
┌───────────────────────────────────┐
│             WEB UI                │
│                                   │
│  New Incident                     │
│  Similar Incidents                │
│  AI Troubleshooting Brief         │
│  Resolve & Remember               │
│  Feedback                         │
└────────────────┬──────────────────┘
                 │
                 ▼
┌───────────────────────────────────┐
│           BACKEND API             │
│                                   │
│ Incident API                      │
│ Search API                        │
│ AI/RAG Service                    │
│ Resolution API                    │
│ Feedback API                      │
└────────────────┬──────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│                MONGODB                 │
│                                        │
│ incidents                              │
│ feedback                               │
│ counters                               │
│                                        │
│ Keyword Search                         │
│ Vector Search                          │
│ Hybrid Search                          │
│ Aggregation                            │
│ Unique Index                           │
│ Optional Change Streams                │
└────────────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────┐
│               LLM                 │
│                                   │
│ Grounded troubleshooting brief    │
└───────────────────────────────────┘
```

---

# 10. Recommended Technology Stack

Choose technologies that allow you to move fastest with Antigravity.

## Frontend

Recommended:

* React
* Vite
* Tailwind CSS

## Backend

Choose whichever Antigravity handles fastest:

* Node.js + Express

or:

* Python + FastAPI

Do not spend hackathon time debating frameworks.

## Database

```text
MongoDB Atlas
```

## AI

Use an LLM API you already have access to.

The LLM should handle:

* Summarizing retrieved incidents
* Generating troubleshooting recommendations
* Explaining historical evidence

MongoDB remains the **memory and retrieval layer**.

---

# 11. MongoDB Data Model

## Collection: `incidents`

Example:

```json
{
  "_id": "...",
  "incidentNumber": "INC-2026-0024",

  "title": "Horizon VDI login failure",

  "description": "Users receive a black screen after authentication.",

  "service": "VMware Horizon",

  "environment": "Production",

  "severity": "High",

  "symptoms": [
    "black screen",
    "login failure",
    "started after image update"
  ],

  "errorMessage": "Optional error",

  "rootCause": "FSLogix profile/container issue",

  "resolution": "Reverted image and repaired affected profile containers.",

  "resolutionSummary": "Rollback resolved the issue.",

  "status": "resolved",

  "createdAt": "...",

  "resolvedAt": "...",

  "embedding": []
}
```

---

# 12. Incident Number Generation

The incident number is generated **only when Resolve & Remember is clicked**.

Recommended format:

```text
INC-2026-0001
INC-2026-0002
INC-2026-0003
```

Use a `counters` collection.

Example:

```json
{
  "_id": "incident",
  "sequence": 24
}
```

When resolving:

```text
sequence = sequence + 1
```

Then generate:

```text
INC-2026-0024
```

Create a unique index on:

```text
incidents.incidentNumber
```

This prevents duplicates.

---

# 13. Feedback Model

For the hackathon, a separate collection gives you a better analytics story.

## Collection: `feedback`

```json
{
  "_id": "...",

  "incidentNumber": "INC-2026-0024",

  "rating": "helpful",

  "comment": "Historical recommendation was accurate.",

  "retrievedIncidents": [
    "INC-2026-0007",
    "INC-2026-0012"
  ],

  "createdAt": "..."
}
```

This allows MongoDB aggregation to answer questions such as:

```text
How many recommendations were helpful?

Which historical incidents are repeatedly retrieved?

Which services generate the most incidents?

Which resolutions receive negative feedback?
```

---

# 14. Search Strategy

## Why Hybrid Search?

Consider:

Current incident:

```text
Users get a black screen after Horizon authentication.
```

Historical incident:

```text
VDI users experience a blank desktop after login.
```

Keyword search may struggle because the wording is different.

Vector Search can recognize semantic similarity.

However, exact technical terms matter too:

```text
Horizon
FSLogix
Event ID
error code
image version
```

Therefore:

```text
Keyword Search
       +
Vector Search
       ↓
Hybrid Search
```

This is one of the strongest MongoDB technical aspects of the project.

The event itself identifies Search and Vector Search as appropriate mechanisms for retrieving relevant information.

---

# 15. Hybrid Search Flow

```text
New Incident
      │
      ├─────────────────┐
      ▼                 ▼
Keyword Search      Vector Search
      │                 │
      └────────┬────────┘
               ▼
       Combined Ranking
               │
               ▼
        Top 3–5 Incidents
               │
               ▼
          LLM Context
```

Search fields can include:

* Title
* Description
* Symptoms
* Service
* Error message
* Root cause
* Resolution

---

# 16. AI/RAG Design

The LLM should **not** receive the entire incident database.

Only provide:

```text
Current Incident
        +
Top Relevant Historical Incidents
```

Recommended system prompt:

```text
You are an IT incident troubleshooting assistant.

Use the historical incidents provided as evidence.

Do not invent previous incidents, resolutions,
error messages or evidence.

Clearly distinguish:

1. Historical Evidence
2. Likely Inference
3. Recommended Investigation Steps

If the historical incidents are not sufficiently relevant,
say that there is insufficient historical evidence.
```

Then provide:

```text
CURRENT INCIDENT

...

HISTORICAL INCIDENT 1

...

HISTORICAL INCIDENT 2

...

HISTORICAL INCIDENT 3

...
```

---

# 17. Main UI

Keep the UI focused on the workflow.

```text
┌─────────────────────────────────────────────────────┐
│ OPSMEMORY                              24 Memories │
├─────────────────────────────────────────────────────┤
│                                                     │
│ NEW INCIDENT                                        │
│                                                     │
│ Title                                               │
│ [_____________________________________________]     │
│                                                     │
│ Description                                         │
│ [_____________________________________________]     │
│ [_____________________________________________]     │
│                                                     │
│ Service          Environment        Severity        │
│ [Horizon ▼]      [Production ▼]     [High ▼]       │
│                                                     │
│             [ FIND SIMILAR INCIDENTS ]              │
│                                                     │
├─────────────────────────────────────────────────────┤
│ HISTORICAL MEMORY                                   │
│                                                     │
│ INC-2026-0018                    91% Match          │
│ VDI blank screen after login                       │
│ Root cause: FSLogix profile issue                  │
│                                                     │
│ INC-2026-0012                    86% Match          │
│ Horizon authentication failure                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ AI TROUBLESHOOTING BRIEF                            │
│                                                     │
│ Likely Pattern: ...                                 │
│                                                     │
│ Recommended Investigation:                         │
│ 1. ...                                              │
│ 2. ...                                              │
│ 3. ...                                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│ RESOLUTION                                          │
│                                                     │
│ Root Cause                                          │
│ [_____________________________________________]     │
│                                                     │
│ Resolution                                          │
│ [_____________________________________________]     │
│                                                     │
│             [ RESOLVE & REMEMBER ]                  │
└─────────────────────────────────────────────────────┘
```

After resolving:

```text
┌────────────────────────────────────────────┐
│ ✓ RESOLUTION REMEMBERED                    │
│                                            │
│ INC-2026-0024                              │
│                                            │
│ This incident is now part of OpsMemory.    │
│                                            │
│ Was the recommendation useful?             │
│                                            │
│      👍 Helpful       👎 Not Helpful       │
└────────────────────────────────────────────┘
```

---

# 18. Seed Data

Do not use a huge dataset.

Create approximately:

```text
10–15 historical incidents
```

Use synthetic IT incidents.

Suggested categories:

### VMware Horizon

* Black screen after login
* Stuck authentication
* Desktop pool provisioning failure
* Agent unavailable
* FSLogix profile issue

### Windows

* GPO not applying
* DNS resolution failure
* Windows Update failure
* Service not starting

### Azure

* VM extension failure
* Authentication failure
* Storage access issue

### Networking

* DNS issue
* DHCP issue
* VPN connectivity

The dataset should be small enough that you understand every record used in the demo.

This follows the event's recommendation to keep the input set small and repeatable.

---

# 19. Demo Scenario 1 — Normal Case

Use:

```text
Horizon users receive a black screen after login
following a golden image update.
```

Expected workflow:

```text
New Incident
     ↓
Find Similar Incidents
     ↓
Hybrid Search
     ↓
Historical Horizon/FSLogix incidents
     ↓
AI Troubleshooting Brief
     ↓
Enter Root Cause
     ↓
Enter Resolution
     ↓
Resolve & Remember
     ↓
INC-2026-0024
     ↓
Helpful
```

---

# 20. Demo Scenario 2 — Difficult Case

The difficult case should use different wording.

Current incident:

```text
Users authenticate successfully but never receive
their virtual desktop after the latest image deployment.
```

Historical incident:

```text
VDI users experience blank desktop after login caused
by profile container attachment failure.
```

Keyword search alone may be weaker.

Vector Search should identify the semantic relationship.

Hybrid Search should produce the relevant historical incident.

This gives you a very clear explanation for why you implemented Hybrid Search.

---

# 21. Demo Scenario 3 — Memory Loop

This is optional but highly recommended.

After resolving:

```text
INC-2026-0024
```

create:

```text
Users are seeing a blank desktop immediately after
successful Horizon authentication.
```

Search again.

Show:

```text
INC-2026-0024
```

appearing in historical memory.

Then say:

> "The incident we just solved less than a minute ago is already part of the system's memory."

This should be your strongest demo moment.

---

# 22. Repository Structure

Recommended:

```text
opsmemory/
│
├── README.md
├── implementation.md
├── .env.example
├── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.*
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── db/
│   │   └── utils/
│   └── package.json
│
├── scripts/
│   ├── seed-data.*
│   └── create-indexes.*
│
└── docs/
    └── architecture.md
```

Do not over-engineer this.

---

# 23. Environment Variables

Use:

```text
MONGODB_URI=
MONGODB_DATABASE=
LLM_API_KEY=
LLM_MODEL=
EMBEDDING_MODEL=
```

Commit:

```text
.env.example
```

Never commit:

```text
.env
```

Never put API keys in Git.

---

# 24. Git Commit Strategy

Create the Git repository **as soon as you start**.

The event specifically asks participants to create a Git repository when beginning so progress can be shown.

Use meaningful commits.

---

## Commit 01 — Bootstrap

```bash
git init
git add .
git commit -m "chore: bootstrap OpsMemory project"
```

Include:

* README
* implementation.md
* frontend/backend scaffold
* `.gitignore`
* `.env.example`

---

## Commit 02 — UI Shell

```bash
git add .
git commit -m "feat: add incident workspace UI"
```

Implement:

* Header
* Incident form
* Search button
* Results area
* AI panel
* Resolution panel

---

## Commit 03 — MongoDB Connection

```bash
git add .
git commit -m "feat: connect application to MongoDB"
```

Implement:

* MongoDB client
* Database configuration
* Connection health check
* Collection access

---

## Commit 04 — Incident Model

```bash
git add .
git commit -m "feat: add incident document model and indexes"
```

Implement:

* `incidents`
* Schema validation if practical
* Search indexes
* Unique incident number index

---

## Commit 05 — Seed Data

```bash
git add .
git commit -m "feat: add synthetic incident memory dataset"
```

Add:

```text
10–15 historical incidents
```

Make sure some incidents describe the same underlying problem differently.

---

## Commit 06 — Keyword Search

```bash
git add .
git commit -m "feat: add historical incident keyword search"
```

Implement:

* Search endpoint
* MongoDB search
* Result formatting
* UI result cards

---

## Commit 07 — Vector Search

```bash
git add .
git commit -m "feat: add semantic incident retrieval"
```

Implement:

* Embeddings
* Vector Search index
* Semantic retrieval

Test semantically similar but differently worded incidents.

---

## Commit 08 — Hybrid Search

```bash
git add .
git commit -m "feat: combine keyword and semantic incident search"
```

Implement:

```text
Keyword Search
       +
Vector Search
       ↓
Hybrid Retrieval
```

This is a major milestone.

---

## Commit 09 — AI Troubleshooting

```bash
git add .
git commit -m "feat: generate grounded troubleshooting briefs"
```

Implement:

* LLM service
* Prompt
* Retrieved context
* Structured response

---

## Commit 10 — Resolution Workflow

```bash
git add .
git commit -m "feat: add incident resolution workflow"
```

Implement:

* Root cause
* Resolution
* Status update
* Resolve action

---

## Commit 11 — Resolve & Remember

```bash
git add .
git commit -m "feat: generate incident number and remember resolution"
```

Implement:

```text
Resolve & Remember
        ↓
Generate Incident Number
        ↓
Persist Incident
        ↓
Generate/Store Embedding
        ↓
Searchable Memory
```

This is the core product milestone.

---

## Commit 12 — Feedback

```bash
git add .
git commit -m "feat: capture recommendation feedback"
```

Implement:

* Helpful
* Not Helpful
* Comment
* Retrieved incidents
* Timestamp

---

## Commit 13 — Feedback-Aware Memory

```bash
git add .
git commit -m "feat: surface feedback with historical recommendations"
```

Display historical feedback.

If time permits, use it as a lightweight ranking signal.

---

## Commit 14 — Analytics

```bash
git add .
git commit -m "feat: add MongoDB memory analytics"
```

Implement aggregation for:

* Total incidents
* Helpful recommendations
* Not helpful recommendations
* Top services
* Recurring root causes

---

## Commit 15 — Change Streams

Only attempt after everything else works.

```bash
git add .
git commit -m "feat: react to remembered incidents with change streams"
```

If it becomes unstable:

**Do not use it in the final demo.**

---

## Commit 16 — UI Polish

```bash
git add .
git commit -m "feat: polish hackathon demo experience"
```

Improve:

* Loading states
* Error states
* Empty states
* Success message
* Incident number display
* Feedback UI
* Visual hierarchy

---

## Commit 17 — Demo Reset

```bash
git add .
git commit -m "chore: add repeatable demo data reset"
```

Add:

```bash
npm run seed
```

or:

```bash
npm run demo:reset
```

---

## Commit 18 — Difficult Case Test

```bash
git add .
git commit -m "test: validate semantic difficult-case retrieval"
```

Verify:

```text
Different wording
        ↓
Hybrid Search
        ↓
Correct historical incident
```

---

## Commit 19 — Documentation

```bash
git add .
git commit -m "docs: document architecture and MongoDB design"
```

README should contain:

* Problem
* Solution
* Architecture
* MongoDB features
* Setup
* Demo workflow
* Future improvements

---

## Commit 20 — Final Submission

```bash
git add .
git commit -m "chore: prepare final hackathon submission"
```

Before this commit:

* Remove secrets
* Test clean startup
* Test normal case
* Test difficult case
* Test memory loop
* Test feedback
* Test incident number
* Verify MongoDB indexes
* Verify Hybrid Search
* Verify README

Then stop building.

---

# 25. Antigravity Strategy

Do **not** tell Antigravity:

> "Build the entire project."

Instead, work incrementally.

For every phase:

```text
1. Inspect repository.
2. Explain current architecture.
3. Implement only the requested phase.
4. Run the application.
5. Run tests/build.
6. Fix errors.
7. Review the changes.
8. Commit.
9. Move to next phase.
```

This gives you much better control.

---

# 26. Initial Antigravity Project Context

Give Antigravity this context first:

```text
We are building OpsMemory for the MongoDB Student Builder Day.

OpsMemory is an AI-powered IT incident memory system.

CORE WORKFLOW:

1. Engineer enters a new incident.
2. MongoDB Hybrid Search retrieves similar historical incidents.
3. An LLM generates a grounded troubleshooting brief using those incidents.
4. Engineer resolves the incident.
5. Clicking "Resolve & Remember" generates a unique incident number.
6. The complete resolved incident is saved to MongoDB.
7. Feedback is collected on the recommendation.
8. The resolved incident becomes future searchable memory.

MongoDB must have a meaningful role.

MongoDB capabilities planned:

- Document modelling
- Indexes
- Unique indexes
- Keyword Search
- Vector Search
- Hybrid Search
- Aggregation
- Optional Change Streams

The project must prioritize one complete end-to-end workflow.

Do not introduce:

- Microservices
- Authentication
- Complex infrastructure
- Kubernetes
- Unnecessary external integrations
- Multiple autonomous agents

Build incrementally.

Preserve all working functionality after every change.

Never expose secrets.

Before changing the architecture, explain why the change is necessary.
```

---

# 27. Antigravity Phase Prompt

For each phase, use:

```text
Inspect the current repository first.

Implement ONLY this phase:

[INSERT PHASE]

Requirements:

- Preserve existing functionality.
- Keep the implementation simple.
- Use MongoDB where specified.
- Add appropriate error handling.
- Do not introduce unnecessary dependencies.
- Do not implement future phases yet.

After implementation:

1. Run the relevant tests/build.
2. Start the application if appropriate.
3. Fix any errors.
4. Summarize changed files.
5. Explain how the implementation works.
6. Identify risks or assumptions.

Do not implement future phases.
```

---

# 28. Event-Day Timeline

The event schedule gives you roughly **11:30 to 16:00** for the build, with submissions at 16:00 and demos afterward.

## 11:30–11:45

### Setup

* Create repository
* Create MongoDB Atlas database
* Configure environment variables
* Scaffold application
* Commit #1

---

## 11:45–12:15

### Foundation

Build:

* UI
* MongoDB connection
* Incident model
* Seed data

Target:

```text
Application loads
+
MongoDB connected
+
Historical incidents exist
```

---

## 12:15–13:00

### Search

Build:

* Keyword Search
* Vector Search
* Hybrid Search
* Result cards

Target:

```text
Incident
   ↓
Hybrid Search
   ↓
Relevant historical incidents
```

---

## 13:00–13:30

### Lunch

Use the break to evaluate:

```text
What works?

What is broken?

What can be cut?

What is absolutely necessary?
```

Do not add unnecessary scope.

---

## 13:30–14:15

### AI

Build:

* Retrieved context
* LLM prompt
* Troubleshooting brief
* Evidence display

Target:

```text
Incident
   ↓
Hybrid Search
   ↓
Historical Evidence
   ↓
AI Recommendation
```

---

## 14:15–14:45

### Resolve & Remember

Build:

* Root cause
* Resolution
* Incident number
* MongoDB persistence
* Embedding
* Feedback

Target:

```text
Resolve & Remember
        ↓
INC-2026-XXXX
        ↓
MongoDB
        ↓
Searchable Memory
```

---

## 14:45–15:15

### Prove Memory

Create another similar incident.

Search again.

Show the incident you just resolved.

This is the most important product proof.

---

## 15:15–15:35

### Polish

Fix:

* UI
* Loading states
* Errors
* Demo data
* Wording
* Visual hierarchy

Do **not** start a major new feature.

---

## 15:35–15:50

### Final Testing

### Test 1

```text
Normal incident
→ Relevant historical result
→ Useful recommendation
```

### Test 2

```text
Different wording
→ Semantic retrieval
→ Relevant historical result
```

### Test 3

```text
Resolve
→ Incident number
→ Search again
→ Newly remembered incident appears
```

### Test 4

```text
Helpful / Not Helpful
→ Feedback stored
```

---

## 15:50–16:00

### Submission

* Final Git commit
* Check README
* Check repository
* Check secrets
* Verify demo
* Submit

At this point:

**STOP ADDING FEATURES.**

---

# 29. MongoDB Features to Explain During Demo

Don't simply say:

> "We used MongoDB Vector Search."

Explain the reason.

### Document Model

> "An incident contains operational context, symptoms, root cause, resolution and feedback. MongoDB's document model lets us keep this memory together."

### Keyword Search

> "Exact technical terms such as Horizon, FSLogix, error codes and service names are important."

### Vector Search

> "Two engineers can describe the same problem differently. Vector Search lets us retrieve based on meaning."

### Hybrid Search

> "We combine semantic similarity with exact terminology rather than depending on only one retrieval method."

### Unique Index

> "Every remembered incident receives a unique incident number."

### Aggregation

> "We can analyze the accumulated incident and feedback history directly in MongoDB."

### Change Streams

If implemented:

> "When a resolution is remembered, MongoDB can react to that new record and trigger downstream memory processing."

The event encourages teams to explain where MongoDB fits and why the selected features support the workflow.

---

# 30. Things NOT to Build

Do not waste the limited build window on:

* Authentication
* Registration
* RBAC
* Mobile app
* Kubernetes
* Terraform
* CI/CD
* Complex AWS infrastructure
* Multiple AI agents
* Autonomous remediation
* ServiceNow integration
* Slack integration
* Teams integration
* Huge datasets
* Enterprise-grade RBAC
* Complex observability

Those are future roadmap items.

The hackathon project needs a **working product**, not a production enterprise platform.

---

# 31. Definition of Done

OpsMemory is complete when this workflow works:

```text
1. Open OpsMemory
        ↓
2. Enter new incident
        ↓
3. Search historical memory
        ↓
4. MongoDB Hybrid Search returns relevant incidents
        ↓
5. AI generates grounded troubleshooting brief
        ↓
6. Engineer enters root cause
        ↓
7. Engineer enters resolution
        ↓
8. Click Resolve & Remember
        ↓
9. MongoDB generates unique incident number
        ↓
10. Feedback is recorded
        ↓
11. Create another similar incident
        ↓
12. Search again
        ↓
13. Previously resolved incident is retrieved
```

If this works reliably:

**The MVP is done.**

Everything else is optional.

---

# 32. Three-Minute Demo Script

The event recommends focusing on the product and working workflow rather than a slide deck. Selected teams have approximately three minutes.

## 0:00–0:25 — Problem

Say:

> "IT teams solve the same problems repeatedly, but the useful knowledge from previous fixes often disappears into old tickets and engineer memory."

---

## 0:25–0:45 — New Incident

Enter:

```text
Horizon users are getting a black screen after login
following a recent image update.
```

Click:

```text
Find Similar Incidents
```

---

## 0:45–1:15 — MongoDB Memory

Show the historical incidents.

Say:

> "OpsMemory searches MongoDB using both exact technical terms and semantic similarity. So even when the old incident uses different wording, we can retrieve the relevant historical fix."

---

## 1:15–1:40 — AI

Show the troubleshooting brief.

Say:

> "The AI isn't answering from a blank prompt. It receives the relevant incidents retrieved from MongoDB and uses them as historical evidence."

---

## 1:40–2:00 — Resolve & Remember

Enter the resolution.

Click:

```text
Resolve & Remember
```

Show:

```text
INC-2026-0024
```

Say:

> "This is the important part. We don't just solve the incident. We remember the solution."

---

## 2:00–2:25 — Feedback

Click:

```text
Helpful
```

Say:

> "The engineer can tell the system whether the recommendation was useful, and that feedback becomes part of the incident memory."

---

## 2:25–2:50 — Memory Loop

Create another similar incident with different wording.

Search again.

Show:

```text
INC-2026-0024
```

Say:

> "And now the incident we just solved is already part of the searchable memory."

---

## 2:50–3:00 — Closing

Say:

> **"Solve it once. Remember the resolution. Make the next incident easier."**

---

# 33. Future Roadmap

These should be presented as future possibilities, not hackathon MVP requirements.

## Team Memory

Scope memory by:

* Team
* Service
* Environment

## Memory Quality

Detect:

* Stale resolutions
* Conflicting resolutions
* Low-confidence memories

## Incident Clustering

Automatically group:

```text
Horizon Login Problems

FSLogix Problems

DNS Problems

Azure VM Problems
```

## Feedback Learning

Use accumulated feedback to improve retrieval ranking.

## Change Detection

Detect when:

```text
A historical resolution may no longer apply.
```

## Enterprise Integrations

Future integrations:

* ServiceNow
* Jira
* Slack
* Microsoft Teams

---

# 34. Final Product Principle

OpsMemory should feel like a **product**, not a collection of MongoDB features.

The story is:

```text
        INCIDENT
            ↓
         MEMORY
            ↓
          SEARCH
            ↓
          INSIGHT
            ↓
        RESOLUTION
            ↓
         REMEMBER
            ↓
         FEEDBACK
            ↓
       BETTER MEMORY
```

Every technical feature should support this loop.

If time becomes limited, cut features from the bottom of the priority list.

**Never sacrifice this workflow:**

```text
New Incident
     ↓
Hybrid Search
     ↓
AI Brief
     ↓
Resolve & Remember
     ↓
Incident Number
     ↓
Feedback
     ↓
Search Again
```

That is the complete **OpsMemory** story.
