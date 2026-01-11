import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "crypto";

function loadEnvFile() {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const idx = trimmed.indexOf("=");
        if (idx === -1) return;
        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) {
            process.env[key] = value;
        }
    });
}

function hashPassword(password) {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64);
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function buildSampleSpots(ownerId) {
    return [
        {
            name: "Cala Luna",
            region: "Sardinia",
            description: "Calm bay with clear water and limestone cliffs.",
            spotType: "Bucht",
            depthMin: 3,
            depthMax: 9,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in N-E, open SW",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Anchor before the rocky edge, good holding.",
            lat: 40.288,
            lng: 9.631,
            visibility: "public"
        },
        {
            name: "Porto Cervo Marina",
            region: "Sardinia",
            description: "Premium marina with services and calm berths.",
            spotType: "Marina",
            depthMin: 4,
            depthMax: 12,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in all winds",
            swellInfo: "calm",
            facilities: ["water", "power", "diesel", "mooring", "restaurant", "supermarket", "service", "waste", "wifi", "showers"],
            season: "Apr-Oct",
            rating: 5,
            notesSkipper: "Call ahead in summer.",
            lat: 41.135,
            lng: 9.536,
            visibility: "public"
        },
        {
            name: "Hvar Harbor",
            region: "Dalmatia",
            description: "Lively harbor with classic waterfront.",
            spotType: "Marina",
            depthMin: 3,
            depthMax: 10,
            bottomType: "Schlamm",
            holdingQuality: "mittel",
            shelterWindDirections: "open W",
            swellInfo: "medium",
            facilities: ["water", "power", "diesel", "mooring", "restaurant", "supermarket", "service", "waste"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Best to arrive early.",
            lat: 43.171,
            lng: 16.441,
            visibility: "public"
        },
        {
            name: "Vis Bay",
            region: "Dalmatia",
            description: "Protected anchorage with scenic backdrop.",
            spotType: "Ankerplatz",
            depthMin: 5,
            depthMax: 14,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in N-E",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected", "water", "waste"],
            season: "May-Oct",
            rating: 5,
            notesSkipper: "Quiet overnight spot.",
            lat: 43.06,
            lng: 16.187,
            visibility: "private"
        },
        {
            name: "Kotor Bay",
            region: "Montenegro",
            description: "Deep fjord-like bay with dramatic cliffs.",
            spotType: "Bucht",
            depthMin: 8,
            depthMax: 20,
            bottomType: "Schlamm",
            holdingQuality: "mittel",
            shelterWindDirections: "good in N-S",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected"],
            season: "May-Oct",
            rating: 4,
            notesSkipper: "Watch for ferry traffic.",
            lat: 42.424,
            lng: 18.771,
            visibility: "public"
        },
        {
            name: "Lefkada Anchorage",
            region: "Ionian Sea",
            description: "Wide anchorage with turquoise water.",
            spotType: "Ankerplatz",
            depthMin: 4,
            depthMax: 10,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in NW-E",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected", "water", "waste"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Great holding, anchor in sand.",
            lat: 38.83,
            lng: 20.708,
            visibility: "public"
        },
        {
            name: "Amalfi Marina",
            region: "Amalfi Coast",
            description: "Compact marina close to town center.",
            spotType: "Marina",
            depthMin: 3,
            depthMax: 8,
            bottomType: "Sand",
            holdingQuality: "mittel",
            shelterWindDirections: "open S",
            swellInfo: "medium",
            facilities: ["water", "power", "diesel", "mooring", "restaurant", "supermarket", "service", "waste", "wifi"],
            season: "Apr-Oct",
            rating: 3,
            notesSkipper: "Limited space in peak season.",
            lat: 40.634,
            lng: 14.602,
            visibility: "public"
        },
        {
            name: "Alghero Bay",
            region: "Sardinia",
            description: "Quiet bay with red cliffs and sand.",
            spotType: "Bucht",
            depthMin: 4,
            depthMax: 11,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in E-S",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Best at sunrise.",
            lat: 40.559,
            lng: 8.321,
            visibility: "private"
        },
        {
            name: "Cala d'Hort",
            region: "Ibiza",
            description: "Iconic bay with island views.",
            spotType: "Bucht",
            depthMin: 3,
            depthMax: 9,
            bottomType: "Sand",
            holdingQuality: "mittel",
            shelterWindDirections: "open W",
            swellInfo: "medium",
            facilities: ["restaurant", "mooring", "calm", "protected"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Popular at sunset.",
            lat: 38.965,
            lng: 1.302,
            visibility: "public"
        },
        {
            name: "Palma Port",
            region: "Mallorca",
            description: "Busy marina with full services.",
            spotType: "Marina",
            depthMin: 4,
            depthMax: 14,
            bottomType: "Sand",
            holdingQuality: "gut",
            shelterWindDirections: "good in all winds",
            swellInfo: "calm",
            facilities: ["water", "power", "diesel", "mooring", "restaurant", "supermarket", "service", "waste", "wifi", "showers"],
            season: "Mar-Oct",
            rating: 5,
            notesSkipper: "Call on VHF for berth.",
            lat: 39.566,
            lng: 2.63,
            visibility: "public"
        },
        {
            name: "Ajaccio Bay",
            region: "Corsica",
            description: "Anchorage with town access and calm nights.",
            spotType: "Ankerplatz",
            depthMin: 6,
            depthMax: 16,
            bottomType: "Seegras",
            holdingQuality: "mittel",
            shelterWindDirections: "good in N-E",
            swellInfo: "low",
            facilities: ["restaurant", "mooring", "calm", "protected", "water", "waste"],
            season: "May-Sep",
            rating: 4,
            notesSkipper: "Check holding on sea grass.",
            lat: 41.919,
            lng: 8.738,
            visibility: "private"
        },
        {
            name: "Lisbon Marina",
            region: "Portugal",
            description: "City marina with easy provisioning.",
            spotType: "Marina",
            depthMin: 4,
            depthMax: 10,
            bottomType: "Schlamm",
            holdingQuality: "gut",
            shelterWindDirections: "good in all winds",
            swellInfo: "calm",
            facilities: ["water", "power", "diesel", "mooring", "restaurant", "supermarket", "service", "waste", "wifi", "showers"],
            season: "All year",
            rating: 4,
            notesSkipper: "Great for restocking.",
            lat: 38.691,
            lng: -9.21,
            visibility: "public"
        }
    ].map((spot, index) => ({
        ...spot,
        imageData: "",
        imageDataList: [],
        imageUrl: "",
        createdAt: new Date(Date.now() - index * 86400000),
        ownerId,
        favorites: [],
        seedTag: "demo"
    }));
}

async function main() {
    loadEnvFile();

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME || "segelspots";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    if (!uri) {
        throw new Error("MONGODB_URI is missing. Set it in .env.");
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    const users = db.collection("users");
    let admin = await users.findOne({ email: adminEmail });
    if (!admin) {
        const passwordHash = hashPassword(adminPassword);
        const { insertedId } = await users.insertOne({
            email: adminEmail,
            passwordHash,
            role: "admin",
            createdAt: new Date()
        });
        admin = { _id: insertedId, email: adminEmail, role: "admin" };
        console.log(`Created admin user: ${adminEmail}`);
    }

    const ownerId = admin._id;
    const spots = buildSampleSpots(ownerId);

    const spotsCollection = db.collection("spots");
    const cleared = await spotsCollection.deleteMany({ seedTag: "demo" });
    const result = await spotsCollection.insertMany(spots);

    console.log(`Removed ${cleared.deletedCount} old demo spots.`);
    console.log(`Inserted ${result.insertedCount} demo spots.`);

    await client.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
