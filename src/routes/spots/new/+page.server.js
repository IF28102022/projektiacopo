import { getDb } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();

        const name = String(form.get("name") || "").trim();
        const region = String(form.get("region") || "").trim();
        const description = String(form.get("description") || "").trim();
        const imageData = String(form.get("imageData") || "").trim();
        const lat = Number(form.get("lat"));
        const lng = Number(form.get("lng"));

        if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
            return { error: "Name, Lat und Lng sind Pflichtfelder." };
        }

        const db = await getDb();
        await db.collection("spots").insertOne({
            name,
            region,
            description,
            imageData,   // hier das Base64-Bild
            lat,
            lng,
            createdAt: new Date()
        });

        throw redirect(303, "/spots");
    }
};