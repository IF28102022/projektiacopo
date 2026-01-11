import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";

export async function load({ locals }) {
    const db = await getDb();
    const user = locals.user || null;
    const role = user?.role || "guest";
    const userId = user?.id || null;

    let filter = {};
    if (role !== "admin") {
        if (userId) {
            filter = {
                $or: [
                    { visibility: "public" },
                    { visibility: { $exists: false } },
                    { visibility: "private", ownerId: new ObjectId(userId) }
                ]
            };
        } else {
            filter = {
                $or: [
                    { visibility: "public" },
                    { visibility: { $exists: false } }
                ]
            };
        }
    }

    const spots = await db
        .collection("spots")
        .find(
            filter,
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
