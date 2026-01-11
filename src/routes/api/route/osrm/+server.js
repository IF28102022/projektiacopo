import { json } from "@sveltejs/kit";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";
const EARTH_RADIUS = 6371000;

function toRad(value) {
    return (value * Math.PI) / 180;
}

function haversineMeters(a, b) {
    const lat1 = Number(a.lat);
    const lng1 = Number(a.lng);
    const lat2 = Number(b.lat);
    const lng2 = Number(b.lng);
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h =
        sinLat * sinLat +
        Math.cos(radLat1) * Math.cos(radLat2) * sinLng * sinLng;
    return 2 * EARTH_RADIUS * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function buildDirectRoute(coords, speedKnots = 6) {
    const line = coords.map((c) => [Number(c.lng), Number(c.lat)]);
    let distance = 0;
    for (let i = 1; i < coords.length; i += 1) {
        distance += haversineMeters(coords[i - 1], coords[i]);
    }
    const speedMps = (Number(speedKnots) || 0) * 1.852 / 3.6;
    const duration = speedMps > 0 ? distance / speedMps : 0;
    return {
        geometry: { type: "LineString", coordinates: line },
        distance,
        duration
    };
}

export async function POST({ request, fetch }) {
    const body = await request.json().catch(() => null);
    const coords = body?.coordinates;
    const mode = String(body?.mode || "osrm").toLowerCase();
    const speedKnots = Number(body?.speedKnots || 6);

    if (!Array.isArray(coords) || coords.length < 2) {
        return new Response(
            JSON.stringify({ error: "At least two coordinates are required." }),
            { status: 400 },
        );
    }

    if (mode === "direct" || mode === "sea") {
        return json(buildDirectRoute(coords, speedKnots));
    }

    const coordinateString = coords
        .map((c) => `${Number(c.lng)},${Number(c.lat)}`)
        .join(";");

    const url = `${OSRM_BASE}/${coordinateString}?overview=full&geometries=geojson&steps=false`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error("OSRM status", res.status);
            return json({ error: "OSRM request failed" }, { status: 502 });
        }
        const data = await res.json();
        const route = data?.routes?.[0];
        if (!route) {
            return json({ error: "No route found" }, { status: 404 });
        }
        return json({
            geometry: route.geometry,
            distance: route.distance,
            duration: route.duration,
        });
    } catch (error) {
        console.error("OSRM error", error);
        return json({ error: "OSRM not reachable" }, { status: 502 });
    }
}
