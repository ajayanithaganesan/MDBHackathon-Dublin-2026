/**
 * Search smoke test (Person 2).
 *
 * Exercises the hybrid retrieval pipeline directly against MongoDB.
 * Usage: npm run test:search
 */

import { connectToDatabase, closeDatabase } from "../backend/src/db/connection.js";
import { hybridSearch } from "../backend/src/services/searchService.js";

const scenarios = [
  {
    name: "Normal case — Horizon black screen (should match INC-2026-0001/0002)",
    incident: {
      title: "Horizon VDI login failure with black screen",
      description: "Users authenticate to Horizon but get a black screen and session disconnect.",
      service: "VMware Horizon",
      environment: "Production",
      severity: "High",
      symptoms: ["black screen after login", "session disconnect timeout"],
      errorMessage: "The connection to the remote computer ended. (Error code: 0x8007000e)"
    }
  },
  {
    name: "Difficult case — novel database timeout (expect LOW/NONE confidence)",
    incident: {
      title: "Novel distributed database lock contention",
      description: "A brand new storage engine surfaces phantom deadlocks across shards.",
      service: "Unknown Service",
      environment: "DR",
      severity: "Critical",
      symptoms: ["phantom deadlock", "shard quorum loss"],
      errorMessage: "ERR_UNKNOWN_STORAGE_ENGINE"
    }
  }
];

function printResult(result) {
  const { search, matches } = result;
  console.log(
    `  mode=${search.mode} confidence=${search.overallConfidence} ` +
      `semantic=${search.semanticScore} keyword=${search.keywordScore} candidates=${search.totalCandidates}`
  );
  matches.forEach((m, i) => {
    console.log(
      `   ${i + 1}. ${m.incidentNumber}  relevance=${m.relevance}  [${m.matchReasons.join(", ")}]  ` +
        `${m.title.slice(0, 60)}`
    );
  });
  if (matches.length === 0) console.log("   (no matches)");
}

async function main() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error(`Cannot reach MongoDB: ${error.message}`);
    console.error("Start MongoDB / set MONGODB_URI, seed with `npm run seed`, then retry.");
    process.exitCode = 1;
    return;
  }

  console.log("Hybrid search smoke test\n");
  for (const scenario of scenarios) {
    console.log(`- ${scenario.name}`);
    const result = await hybridSearch(scenario.incident);
    printResult(result);
    console.log("");
  }
}

main().finally(() => closeDatabase());
