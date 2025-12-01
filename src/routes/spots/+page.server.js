import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";

export async function load() {
    const db = await getDb();
    const spots = await db.collection("spots").find({}).sort({ createdAt: -1 }).toArray();

    return {
        spots: spots.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            region: s.region,
            imageUrl: s.imageUrl,
            description: s.description,
            lat: s.lat,
            lng: s.lng
        }))
    };
}

export const actions = {
    delete: async ({ request }) => {
        const form = await request.formData();
        const id = form.get("id");

        if (!id) return { error: "Keine ID übergeben" };

        const db = await getDb();
        await db.collection("spots").deleteOne({ _id: new ObjectId(id) });

        return { success: true };
    }
};