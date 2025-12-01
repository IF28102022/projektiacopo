import { getDb } from "$lib/server/db";

export async function load() {
    const db = await getDb();
    const spots = await db.collection("spots")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    const mapped = spots.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        region: s.region,
        imageUrl: s.imageUrl,
        description: s.description,
        lat: s.lat,
        lng: s.lng
    }));

    return { spots: mapped };
}