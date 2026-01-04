import { json } from "@sveltejs/kit";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export async function POST({ request, fetch }) {
    const body = await request.json().catch(() => null);
    const coords = body?.coordinates;

    if (!Array.isArray(coords) || coords.length < 2) {
        return new Response(
            JSON.stringify({ error: "Mindestens zwei Koordinaten benötigt." }),
            { status: 400 },
        );
    }

    const coordinateString = coords
        .map((c) => `${Number(c.lng)},${Number(c.lat)}`)
        .join(";");

    const url = `${OSRM_BASE}/${coordinateString}?overview=full&geometries=geojson&steps=false`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error("OSRM Fehlerstatus", res.status);
            return json({ error: "OSRM Anfrage fehlgeschlagen" }, { status: 502 });
        }
        const data = await res.json();
        const route = data?.routes?.[0];
        if (!route) {
            return json({ error: "Keine Route gefunden" }, { status: 404 });
        }
        return json({
            geometry: route.geometry,
            distance: route.distance,
            duration: route.duration,
        });
    } catch (error) {
        console.error("OSRM Fehler", error);
        return json({ error: "OSRM nicht erreichbar" }, { status: 502 });
    }
}
