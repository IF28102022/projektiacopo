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
            imageUrl: doc.imageUrl,
            lat: doc.lat,
            lng: doc.lng,
            createdAt: doc.createdAt,
        },
    };
}
