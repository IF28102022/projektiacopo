import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";

export async function load({ locals }) {
    const user = locals.user || null;
    const userId = user?.id || null;
    const role = user?.role || "guest";

    const db = await getDb();

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
                    favorites: 1,
                    createdAt: 1
                }
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    const mapped = spots.map((spot) => {
        const favs = Array.isArray(spot.favorites) ? spot.favorites : [];
        const isFavorite =
            !!userId &&
            favs.some((fav) =>
                (fav && typeof fav.toString === "function" ? fav.toString() : String(fav)) ===
                userId
            );

        return {
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
            facilities: spot.facilities || [],
            isFavorite
        };
    });

    const favorites = mapped.filter((s) => s.isFavorite);
    const spotsForPlanning = favorites.length ? favorites : mapped;

    return {
        role,
        userId,
        spots: spotsForPlanning
    };
}
