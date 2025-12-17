import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";
import { requireOwner } from "$lib/server/auth";

export async function load() {
    const db = await getDb();

    const spots = await db
        .collection("spots")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return {
        spots: spots.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            region: s.region,
            description: s.description,
            imageData: s.imageData,   // neu
            imageUrl: s.imageUrl,     // falls du noch alte Einträge hast
            imageDataList: s.imageDataList || [],
            spotType: s.spotType,
            depthMin: s.depthMin,
            depthMax: s.depthMax,
            bottomType: s.bottomType,
            holdingQuality: s.holdingQuality,
            shelterWindDirections: s.shelterWindDirections,
            swellInfo: s.swellInfo,
            facilities: s.facilities || [],
            season: s.season,
            rating: s.rating,
            notesSkipper: s.notesSkipper,
            lat: s.lat,
            lng: s.lng
        }))
    };
}

export const actions = {
    delete: async ({ request, locals }) => {
        requireOwner(locals);

        const form = await request.formData();
        const id = form.get("id");
        if (!id) return { error: "Keine ID übergeben" };

        const db = await getDb();
        await db.collection("spots").deleteOne({ _id: new ObjectId(id) });

        return { success: true };
    }
};
