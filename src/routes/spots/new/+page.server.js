import { getDb } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();

        const name = String(form.get("name") || "").trim();
        const region = String(form.get("region") || "").trim();
        const description = String(form.get("description") || "").trim();
        const spotType = String(form.get("spotType") || "").trim();
        const bottomType = String(form.get("bottomType") || "").trim();
        const holdingQuality = String(form.get("holdingQuality") || "").trim();
        const shelterWindDirections = String(form.get("shelterWindDirections") || "").trim();
        const swellInfo = String(form.get("swellInfo") || "").trim();
        const season = String(form.get("season") || "").trim();
        const ratingRaw = form.get("rating");
        const rating = ratingRaw === null || ratingRaw === "" ? null : Number(ratingRaw);
        const notesSkipper = String(form.get("notesSkipper") || "").trim();
        const depthMinRaw = form.get("depthMin");
        const depthMaxRaw = form.get("depthMax");
        const depthMin = depthMinRaw === null || depthMinRaw === "" ? null : Number(depthMinRaw);
        const depthMax = depthMaxRaw === null || depthMaxRaw === "" ? null : Number(depthMaxRaw);
        const facilities = form.getAll("facilities").map((f) => String(f));
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
            spotType,
            depthMin: Number.isNaN(depthMin) ? null : depthMin,
            depthMax: Number.isNaN(depthMax) ? null : depthMax,
            bottomType,
            holdingQuality,
            shelterWindDirections,
            swellInfo,
            facilities,
            season,
            rating: Number.isNaN(rating) ? null : rating,
            notesSkipper,
            imageData,   // hier das Base64-Bild
            lat,
            lng,
            createdAt: new Date()
        });

        throw redirect(303, "/spots");
    }
};
