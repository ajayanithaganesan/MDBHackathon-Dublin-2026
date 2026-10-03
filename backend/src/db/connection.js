import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DATABASE || "opsmemory";

let client = null;
let db = null;

/**
 * Connect to MongoDB and return the database instance.
 * @returns {Promise<{client: MongoClient, db: import('mongodb').Db}>}
 */
export async function connectToDatabase() {
  if (db && client) {
    return { client, db };
  }

  client = new MongoClient(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true
  });

  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: [${dbName}]`);
  return { client, db };
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed.");
  }
}

export default {
  connectToDatabase,
  closeDatabase
};
