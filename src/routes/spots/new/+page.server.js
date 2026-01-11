import { getDb } from "$lib/server/db";
import { redirect, fail } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export async function load({ locals }) {
    if (!locals.user) throw redirect(303, "/login");
    return {};
}

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) return fail(403, { error: "Nicht eingeloggt" });
        const role = locals.user.role || "guest";
        if (role !== "user" && role !== "admin") {
            return fail(403, { error: "Keine Berechtigung" });
        }
        const form = await request.formData();

        const name = String(form.get("name") || "").trim();
        const region = String(form.get("region") || "").trim();
        const description = String(form.get("description") || "").trim();
        const spotTypeRaw = String(form.get("spotType") || "Bucht").trim();
        const spotType = ["Bucht", "Ankerplatz", "Marina"].includes(spotTypeRaw)
            ? spotTypeRaw
            : "Bucht";
        const bottomType = String(form.get("bottomType") || "").trim();
        const holdingQuality = String(form.get("holdingQuality") || "").trim();
        const shelterWindDirections = String(form.get("shelterWindDirections") || "").trim();
        const swellInfo = String(form.get("swellInfo") || "").trim();
        const season = String(form.get("season") || "").trim();
        const visibilityRaw = String(form.get("visibility") || "public").trim().toLowerCase();
        const visibility = visibilityRaw === "private" ? "private" : "public";
        const ratingRaw = form.get("rating");
        const rating = ratingRaw === null || ratingRaw === "" ? null : Number(ratingRaw);
        const notesSkipper = String(form.get("notesSkipper") || "").trim();
        const depthMinRaw = form.get("depthMin");
        const depthMaxRaw = form.get("depthMax");
        const depthMin = depthMinRaw === null || depthMinRaw === "" ? null : Number(depthMinRaw);
        const depthMax = depthMaxRaw === null || depthMaxRaw === "" ? null : Number(depthMaxRaw);
        const facilitiesRaw = form.getAll("facilities").map((f) => String(f));
        const imageDataSingle = String(form.get("imageData") || "").trim();
        const imageDataListRaw = form.get("imageDataList");
        let imageDataList = [];
        if (imageDataListRaw) {
            try {
                const parsed = JSON.parse(imageDataListRaw);
                if (Array.isArray(parsed)) {
                    imageDataList = parsed.filter(Boolean).map((item) => String(item));
                }
            } catch (error) {
                console.error("Konnte imageDataList nicht parsen", error);
            }
        }
        if (!imageDataList.length && imageDataSingle) {
            imageDataList = [imageDataSingle];
        }
        const imageData = imageDataList[0] || "";
        const lat = Number(form.get("lat"));
        const lng = Number(form.get("lng"));

        if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
            return { error: "Name, Lat und Lng sind Pflichtfelder." };
        }

        const facilitySets = {
            Bucht: ["restaurant", "mooring", "calm", "protected"],
            Ankerplatz: ["restaurant", "mooring", "calm", "protected", "water", "waste"],
            Marina: [
                "water",
                "power",
                "diesel",
                "mooring",
                "restaurant",
                "supermarket",
                "service",
                "waste",
                "wifi",
                "showers",
            ],
        };

        const allowedFacilities = facilitySets[spotType] || facilitySets.Bucht;
        const facilities = facilitiesRaw.filter((f) => allowedFacilities.includes(f));

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
            visibility,
            rating: Number.isNaN(rating) ? null : rating,
            notesSkipper,
            imageData,   // erstes Bild (Fallback)
            imageDataList, // alle Bilder als Base64
            lat,
            lng,
            createdAt: new Date(),
            ownerId: new ObjectId(locals.user.id),
            favorites: []
        });

        throw redirect(303, "/spots");
    }
};
