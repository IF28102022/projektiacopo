import { getDb } from "$lib/server/db";
import { ObjectId } from "mongodb";

export async function GET({ url, locals }) {
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response("Missing id", { status: 400 });
    }

    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch {
        return new Response("Invalid id", { status: 400 });
    }

    const db = await getDb();
    const doc = await db.collection("spots").findOne(
        { _id: objectId },
        {
            projection: {
                imagePreview: 1,
                imageData: 1,
                imageDataList: 1,
                imageUrl: 1,
                visibility: 1,
                ownerId: 1
            }
        }
    );

    if (!doc) {
        return new Response("Not found", { status: 404 });
    }

    const visibility = doc.visibility || "public";
    if (visibility === "private") {
        const user = locals.user || null;
        const role = user?.role || "guest";
        const ownerId = doc.ownerId ? doc.ownerId.toString() : null;
        const isOwner = user && ownerId && ownerId === user.id;
        const isAdmin = role === "admin";
        if (!isAdmin && !isOwner) {
            return new Response("Not found", { status: 404 });
        }
    }

    const indexParam = Number(url.searchParams.get("index") ?? "0");
    const index = Number.isFinite(indexParam) && indexParam >= 0
        ? Math.floor(indexParam)
        : 0;
    const list = Array.isArray(doc.imageDataList) ? doc.imageDataList : [];
    const fullImage = list[index] || (index === 0 ? doc.imageData : null);
    const dataUrl = fullImage || doc.imagePreview || "";

    if (dataUrl) {
        const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
        if (!match) {
            return new Response("Invalid image data", { status: 400 });
        }
        const contentType = match[1];
        const buffer = Buffer.from(match[2], "base64");
        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600"
            }
        });
    }

    if (doc.imageUrl) {
        return new Response(null, {
            status: 302,
            headers: { Location: doc.imageUrl }
        });
    }

    return new Response("Not found", { status: 404 });
}
