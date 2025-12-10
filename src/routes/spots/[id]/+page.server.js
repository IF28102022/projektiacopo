import { error } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { getDb } from "$lib/server/db";

export async function load({ params }) {
    const { id } = params;
    if (!id) throw error(404, "Spot nicht gefunden");

    const db = await getDb();
    const doc = await db
        .collection("spots")
        .findOne({ _id: new ObjectId(id) });

    if (!doc) throw error(404, "Spot nicht gefunden");

    return {
        spot: {
            id: doc._id.toString(),
            name: doc.name,
            region: doc.region,
            description: doc.description,
            imageData: doc.imageData,
            imageDataList: doc.imageDataList || [],
            imageUrl: doc.imageUrl,
            spotType: doc.spotType,
            depthMin: doc.depthMin,
            depthMax: doc.depthMax,
            bottomType: doc.bottomType,
            holdingQuality: doc.holdingQuality,
            shelterWindDirections: doc.shelterWindDirections,
            swellInfo: doc.swellInfo,
            facilities: doc.facilities || [],
            season: doc.season,
            rating: doc.rating,
            notesSkipper: doc.notesSkipper,
            lat: doc.lat,
            lng: doc.lng,
            createdAt: doc.createdAt,
        },
    };
}
