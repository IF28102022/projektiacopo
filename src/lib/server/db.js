// src/lib/server/db.js
import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DBNAME || "segelspots";

if (!uri) {
    throw new Error("MONGODB_URI ist nicht gesetzt (.env)");
}

const client = new MongoClient(uri);

let clientPromise;

if (!globalThis.__mongoClientPromise) {
    globalThis.__mongoClientPromise = client.connect();
}

clientPromise = globalThis.__mongoClientPromise;

export async function getDb() {
    const client = await clientPromise;
    return client.db(dbName);
}
