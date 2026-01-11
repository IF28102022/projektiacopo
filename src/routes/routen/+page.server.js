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
