import { writable } from "svelte/store";
import { browser } from "$app/environment";

const STORAGE_KEY = "tourplan:v1";

const uuid = () =>
    (globalThis.crypto?.randomUUID?.() ||
        `stage-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

function defaultPlan() {
    return {
        poolSpotIds: [],
        stages: [{ id: uuid(), title: "Tour 1", spotIds: [] }],
        tourNotes: "",
        waypoints: []
    };
}

function sanitizePlan(plan, spotIds) {
    const allowed = new Set(spotIds);
    const uniquePool = [];
    for (const id of plan.poolSpotIds || []) {
        if (allowed.has(id) && !uniquePool.includes(id)) uniquePool.push(id);
    }

    const rawStages = Array.isArray(plan.stages) ? plan.stages : [];
    const cleanedStages = rawStages.map((stage, idx) => {
        const ids = [];
        for (const id of stage.spotIds || []) {
            if (allowed.has(id) && !ids.includes(id)) ids.push(id);
        }
        const rawTitle = typeof stage.title === "string" ? stage.title.trim() : "";
        const etappeMatch = rawTitle.match(/^Etappe\s*(\d+)$/i);
        const normalizedTitle = etappeMatch
            ? `Tour ${etappeMatch[1]}`
            : rawTitle === "Etappe"
              ? "Tour"
              : rawTitle;
        return {
            id: stage.id || uuid(),
            title: normalizedTitle || `Tour ${idx + 1}`,
            spotIds: ids,
        };
    });

    const waypointsRaw = Array.isArray(plan.waypoints) ? plan.waypoints : [];
    const cleanedWaypoints = waypointsRaw
        .filter((wp) => {
            if (!wp) return false;
            if (!wp.afterSpotId || !allowed.has(wp.afterSpotId)) return false;
            const lat = Number(wp.lat);
            const lng = Number(wp.lng);
            return Number.isFinite(lat) && Number.isFinite(lng);
        })
        .map((wp) => ({
            id: wp.id || `wp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            lat: Number(wp.lat),
            lng: Number(wp.lng),
            afterSpotId: wp.afterSpotId,
            order: Number(wp.order || 0)
        }));

    const tourNotes =
        typeof plan.tourNotes === "string" ? plan.tourNotes.slice(0, 1000) : "";

    const primaryStage =
        cleanedStages[0] || { id: uuid(), title: "Tour 1", spotIds: [] };
    const extraSpotIds = cleanedStages.slice(1).flatMap((stage) => stage.spotIds);
    const stageSpotIds = primaryStage.spotIds || [];
    const poolSpotIds = [...uniquePool, ...extraSpotIds].filter(
        (id, index, list) => !stageSpotIds.includes(id) && list.indexOf(id) === index,
    );

    const stages = [
        {
            id: primaryStage.id || uuid(),
            title: "Tour 1",
            spotIds: stageSpotIds,
        },
    ];

    return { poolSpotIds, stages, tourNotes, waypoints: cleanedWaypoints };
}

function loadPlan(spotIds) {
    if (!browser) return defaultPlan();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultPlan();
        const parsed = JSON.parse(raw);
        return sanitizePlan(parsed, spotIds);
    } catch (error) {
        console.warn("Konnte Tourplan nicht laden, fallback auf Default", error);
        return defaultPlan();
    }
}

function createTourPlan() {
    const store = writable(defaultPlan());

    if (browser) {
        store.subscribe((value) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
            } catch (error) {
                console.warn("Konnte Tourplan nicht speichern", error);
            }
        });
    }

    return {
        subscribe: store.subscribe,
        set: store.set,
        update: store.update,
        init(spots) {
            const ids = Array.isArray(spots) ? spots.map((s) => s.id) : [];
            store.set(loadPlan(ids));
        },
        reset(spots) {
            const ids = Array.isArray(spots) ? spots.map((s) => s.id) : [];
            store.set(
                sanitizePlan(
                    {
                        poolSpotIds: ids,
                        stages: [{ id: uuid(), title: "Tour 1", spotIds: [] }],
                        tourNotes: "",
                        waypoints: []
                    },
                    ids,
                ),
            );
        },
        syncWithSpots(spots) {
            const ids = Array.isArray(spots) ? spots.map((s) => s.id) : [];
            store.update((plan) => {
                const sanitized = sanitizePlan(plan, ids);
                const assigned = new Set(sanitized.stages.flatMap((s) => s.spotIds));
                const poolSet = new Set(sanitized.poolSpotIds);
                const missing = ids.filter((id) => !assigned.has(id) && !poolSet.has(id));
                if (missing.length) {
                    sanitized.poolSpotIds = [...sanitized.poolSpotIds, ...missing];
                }
                return sanitized;
            });
        },
    };
}

export const tourPlan = createTourPlan();
export { STORAGE_KEY };
