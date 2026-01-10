import { getDb } from "$lib/server/db";

export async function load() {
    const db = await getDb();

    const spots = await db
        .collection("spots")
        .find(
            {},
            {
                projection: {
                    name: 1,
                    region: 1,
                    spotType: 1,
                    lat: 1,
                    lng: 1
                }
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    return {
        spots: spots.map((spot) => ({
            id: spot._id.toString(),
            name: spot.name,
            region: spot.region,
            spotType: spot.spotType,
            lat: spot.lat,
            lng: spot.lng
        }))
    };
}
