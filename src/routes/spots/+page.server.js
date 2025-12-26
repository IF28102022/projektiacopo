import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";

export async function load() {
    const db = await getDb();

    const spots = await db
        .collection("spots")
        .find(
            {},
            {
                // Nur die wirklich benötigten Felder laden, um Base64-Blob-Transfers klein zu halten
                projection: {
                    name: 1,
                    region: 1,
                    description: 1,
                    imageUrl: 1,
                    imageData: 1,
                    imageDataList: { $slice: 1 }, // nur erstes Bild als Preview
                    spotType: 1,
                    depthMin: 1,
                    depthMax: 1,
                    bottomType: 1,
                    holdingQuality: 1,
                    shelterWindDirections: 1,
                    swellInfo: 1,
                    facilities: 1,
                    season: 1,
                    rating: 1,
                    notesSkipper: 1,
                    lat: 1,
                    lng: 1
                }
            }
        )
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
    delete: async ({ request }) => {
        const form = await request.formData();
        const id = form.get("id");
        if (!id) return { error: "Keine ID übergeben" };

        const db = await getDb();
        await db.collection("spots").deleteOne({ _id: new ObjectId(id) });

        return { success: true };
    }
};
