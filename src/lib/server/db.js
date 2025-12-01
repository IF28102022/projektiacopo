// src/lib/server/db.js
import { MongoClient } from "mongodb";
import { MONGODB_URI, MONGODB_DBNAME } from "$env/static/private";

const uri = MONGODB_URI;
const dbName = MONGODB_DBNAME || "segelspots";

if (!uri) {
    throw new Error("MONGODB_URI ist nicht gesetzt (.env)");
}

const client = new MongoClient(uri);

// Verbindung zwischenspeichern, damit bei Hot-Reload nicht ständig neu verbunden wird
let clientPromise;

if (!globalThis.__mongoClientPromise) {
    globalThis.__mongoClientPromise = client.connect();
}

clientPromise = globalThis.__mongoClientPromise;

export async function getDb() {
    const client = await clientPromise;
    return client.db(dbName);
}