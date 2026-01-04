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
                    spotType: 1,
                    region: 1,
                    description: 1,
                    imageUrl: 1,
                    imageData: 1,
                    imageDataList: { $slice: 1 }, // nur erstes Bild als Preview
                    lat: 1,
                    lng: 1,
                    depthMin: 1,
                    depthMax: 1,
                    facilities: 1,
                    createdAt: 1
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
            region: spot.region,
            description: spot.description,
            imageData: spot.imageData,
            imageUrl: spot.imageUrl,
            imageDataList: spot.imageDataList || [],
            lat: spot.lat,
            lng: spot.lng,
            depthMin: spot.depthMin,
            depthMax: spot.depthMax,
            facilities: spot.facilities || []
        }))
    };
}
