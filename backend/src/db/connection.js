import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";

dotenv.config();

let uri = process.env.MONGODB_URI || null;
const dbName = process.env.MONGODB_DATABASE || "opsmemory";

let client = null;
let db = null;
let localMongoServer = null;

export async function startDemoDatabase() {
  if (process.env.MONGODB_URI) {
    uri = process.env.MONGODB_URI;
    return;
  }

  if (!localMongoServer) {
    localMongoServer = await MongoMemoryServer.create({ instance: { dbName } });
    uri = localMongoServer.getUri(dbName);
    console.log("Started local in-memory MongoDB for the demo.");
  }
}

/**
 * Connect to MongoDB and return the database instance.
 * @returns {Promise<{client: MongoClient, db: import('mongodb').Db}>}
 */
export async function connectToDatabase() {
  if (db && client) {
    return { client, db };
  }

  uri ||= "mongodb://127.0.0.1:27017";
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

  if (localMongoServer) {
    await localMongoServer.stop();
    localMongoServer = null;
    uri = process.env.MONGODB_URI || null;
  }
}

export default {
  connectToDatabase,
  closeDatabase,
  startDemoDatabase
};
