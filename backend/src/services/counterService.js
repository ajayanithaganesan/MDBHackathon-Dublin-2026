/**
 * Atomic Counter Logic for Generating Unique Incident Numbers
 * Example Output: INC-2026-0001, INC-2026-0002, etc.
 *
 * Uses MongoDB findOneAndUpdate with $inc and upsert: true
 * guarantees atomic uniqueness and zero concurrency race conditions.
 */

/**
 * Generates the next sequential unique incident number.
 * 
 * @param {import('mongodb').Db} db - The MongoDB database instance
 * @param {number} [targetYear] - The year for the incident sequence (defaults to current year, e.g. 2026)
 * @returns {Promise<string>} e.g. "INC-2026-0001"
 */
export async function getNextIncidentNumber(db, targetYear = new Date().getFullYear()) {
  const counterId = `incident_${targetYear}`;
  const countersCollection = db.collection("counters");

  const result = await countersCollection.findOneAndUpdate(
    { _id: counterId },
    {
      $inc: { sequence: 1 },
      $set: { year: targetYear, updatedAt: new Date() }
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  const seq = result.sequence || (result.value ? result.value.sequence : 1);
  const paddedSeq = String(seq).padStart(4, "0");
  return `INC-${targetYear}-${paddedSeq}`;
}

/**
 * Initializes or resets the counter to a specific starting sequence (e.g., after seeding).
 *
 * @param {import('mongodb').Db} db
 * @param {number} startingSequence
 * @param {number} [targetYear]
 */
export async function setIncidentCounter(db, startingSequence, targetYear = new Date().getFullYear()) {
  const counterId = `incident_${targetYear}`;
  const countersCollection = db.collection("counters");

  await countersCollection.updateOne(
    { _id: counterId },
    {
      $set: {
        sequence: startingSequence,
        year: targetYear,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
}

/**
 * Inspects current counter value without incrementing.
 *
 * @param {import('mongodb').Db} db
 * @param {number} [targetYear]
 */
export async function getCurrentSequence(db, targetYear = new Date().getFullYear()) {
  const counterId = `incident_${targetYear}`;
  const record = await db.collection("counters").findOne({ _id: counterId });
  return record ? record.sequence : 0;
}

export default {
  getNextIncidentNumber,
  setIncidentCounter,
  getCurrentSequence
};
