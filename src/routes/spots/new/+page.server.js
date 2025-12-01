import { getDb } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();

        const spot = {
            name: String(form.get("name") || "").trim(),
            region: String(form.get("region") || "").trim(),
            imageUrl: String(form.get("imageUrl") || "").trim(),
            description: String(form.get("description") || "").trim(),
            lat: Number(form.get("lat")),
            lng: Number(form.get("lng")),
            createdAt: new Date()
        };

        if (!spot.name || Number.isNaN(spot.lat) || Number.isNaN(spot.lng)) {
            return { error: "Name, Lat und Lng sind Pflichtfelder." };
        }

        const db = await getDb();
        await db.collection("spots").insertOne(spot);

        throw redirect(303, "/spots");
    }
};