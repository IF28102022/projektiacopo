import { getDb } from "$lib/server/db";

export async function load() {
    const db = await getDb();

    const spots = await db
        .collection("spots")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return {
        spots: spots.map((spot) => ({
            id: spot._id.toString(),
            name: spot.name,
            spotType: spot.spotType,
            depthMin: spot.depthMin,
            depthMax: spot.depthMax,
            bottomType: spot.bottomType,
            holdingQuality: spot.holdingQuality,
            shelterWindDirections: spot.shelterWindDirections,
            swellInfo: spot.swellInfo,
            facilities: spot.facilities || [],
            lat: spot.lat,
            lng: spot.lng,
        })),
    };
}
