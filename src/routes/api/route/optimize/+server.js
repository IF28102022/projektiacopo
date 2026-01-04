import { json } from "@sveltejs/kit";

const EARTH_RADIUS_KM = 6371;

function haversine(a, b) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function routeDistance(points) {
    let dist = 0;
    for (let i = 0; i < points.length - 1; i++) {
        dist += haversine(points[i], points[i + 1]);
    }
    return dist;
}

function nearestNeighbor(points) {
    if (!points.length) return [];
    const remaining = [...points];
    const start = remaining.shift();
    const route = [start];

    while (remaining.length) {
        const last = route[route.length - 1];
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < remaining.length; i++) {
            const d = haversine(last, remaining[i]);
            if (d < bestDist) {
                bestDist = d;
                bestIdx = i;
            }
        }
        route.push(remaining.splice(bestIdx, 1)[0]);
    }
    return route;
}

function twoOpt(route, maxIter = 30) {
    if (route.length < 4) return route;
    let best = [...route];
    let improved = true;
    let iter = 0;

    while (improved && iter < maxIter) {
        improved = false;
        iter += 1;
        for (let i = 1; i < best.length - 2; i++) {
            for (let k = i + 1; k < best.length - 1; k++) {
                const newRoute = [
                    ...best.slice(0, i),
                    ...best.slice(i, k + 1).reverse(),
                    ...best.slice(k + 1),
                ];
                if (routeDistance(newRoute) + 1e-9 < routeDistance(best)) {
                    best = newRoute;
                    improved = true;
                }
            }
        }
    }
    return best;
}

function optimizePoints(points) {
    const nn = nearestNeighbor(points);
    return twoOpt(nn);
}

async function maybeCallOpenAI(openAiKey, spotIds) {
    if (!openAiKey) return null;
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "Reordne die Spot-IDs für eine möglichst kurze Route. Antworte nur mit einer JSON-Liste der IDs.",
                    },
                    { role: "user", content: JSON.stringify({ ids: spotIds }) },
                ],
                max_tokens: 200,
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) return null;
        const cleaned = parsed.map(String);
        return cleaned;
    } catch (error) {
        console.warn("OpenAI Optimierung übersprungen", error);
        return null;
    }
}

export async function POST({ request }) {
    const body = await request.json().catch(() => null);
    const stages = body?.stages;
    const mode = body?.mode || "perStage";

    if (!Array.isArray(stages)) {
        return json({ error: "Stages fehlen" }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;

    const normalizeStage = (stage) => ({
        id: String(stage.id),
        title: stage.title || "Etappe",
        coordinates: (stage.coordinates || [])
            .filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))
            .map((c) => ({ lat: Number(c.lat), lng: Number(c.lng), spotId: String(c.spotId) })),
    });

    const normalizedStages = stages.map(normalizeStage);

    if (mode === "global") {
        const allPoints = normalizedStages.flatMap((s) => s.coordinates);
        const heuristicOrder = optimizePoints(allPoints);
        const heuristicIds = heuristicOrder.map((p) => p.spotId);
        let resultIds = heuristicIds;

        if (openAiKey) {
            const aiOrder = await maybeCallOpenAI(openAiKey, heuristicIds);
            if (aiOrder && aiOrder.length === heuristicIds.length) {
                const setAi = new Set(aiOrder);
                const setRef = new Set(heuristicIds);
                const valid =
                    aiOrder.length === heuristicIds.length &&
                    aiOrder.every((id) => setRef.has(String(id))) &&
                    heuristicIds.every((id) => setAi.has(String(id)));
                if (valid) resultIds = aiOrder;
            }
        }

        return json({
            stages: [
                {
                    id: normalizedStages[0]?.id || "global",
                    spotIds: resultIds,
                },
                ...normalizedStages.slice(1).map((s) => ({ id: s.id, spotIds: [] })),
            ],
        });
    }

    const optimizedStages = [];
    for (const stage of normalizedStages) {
        const heuristicOrder = optimizePoints(stage.coordinates);
        let resultIds = heuristicOrder.map((p) => p.spotId);

        if (openAiKey) {
            const aiOrder = await maybeCallOpenAI(openAiKey, resultIds);
            if (aiOrder && aiOrder.length === resultIds.length) {
                const setAi = new Set(aiOrder);
                const setRef = new Set(resultIds);
                const valid =
                    aiOrder.length === resultIds.length &&
                    aiOrder.every((id) => setRef.has(String(id))) &&
                    resultIds.every((id) => setAi.has(String(id)));
                if (valid) resultIds = aiOrder;
            }
        }

        optimizedStages.push({
            id: stage.id,
            spotIds: resultIds,
        });
    }

    return json({ stages: optimizedStages });
}
