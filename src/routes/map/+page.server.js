import { getDb } from "$lib/server/db";

export async function load() {
    const db = await getDb();

    const spots = await db
        .collection("spots")
        .find(
            {},
            {
                // Nur die Felder laden, die die Karte wirklich benötigt
                projection: {
                    name: 1,
                    spotType: 1,
                    depthMin: 1,
                    depthMax: 1,
                    bottomType: 1,
                    holdingQuality: 1,
                    shelterWindDirections: 1,
                    swellInfo: 1,
                    facilities: 1,
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
