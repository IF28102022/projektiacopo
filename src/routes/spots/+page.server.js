import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    const user = locals.user || null;
    const role = user?.role || "guest";
    const userId = user?.id || null;
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
                    lng: 1,
                    ownerId: 1
                }
            }
        )
        .sort({ createdAt: -1 })
        .toArray();

    return {
        userRole: role,
        userId,
        canCreate: role === "admin" || role === "user",
        spots: spots.map((s) => {
            const ownerId = s.ownerId ? s.ownerId.toString() : null;
            const canDelete =
                role === "admin" ||
                (role === "user" && ownerId && userId && ownerId === userId);
            return {
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
                lng: s.lng,
                canDelete
            };
        })
    };
}

export const actions = {
    delete: async ({ request, locals }) => {
        const user = locals.user;
        if (!user) return fail(403, { error: "Nicht eingeloggt" });

        const form = await request.formData();
        const id = form.get("id");
        if (!id) return { error: "Keine ID übergeben" };

        const db = await getDb();
        const spot = await db
            .collection("spots")
            .findOne({ _id: new ObjectId(id) }, { projection: { ownerId: 1 } });

        if (!spot) return { error: "Spot nicht gefunden" };

        const ownerId = spot.ownerId ? spot.ownerId.toString() : null;
        const isAdmin = user.role === "admin";
        const isOwner = user.role === "user" && ownerId && ownerId === user.id;
        if (!isAdmin && !isOwner) return fail(403, { error: "Keine Berechtigung" });

        await db.collection("spots").deleteOne({ _id: new ObjectId(id) });

        return { success: true };
    }
};
