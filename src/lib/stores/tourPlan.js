import { writable } from "svelte/store";
import { browser } from "$app/environment";

const STORAGE_KEY = "tourplan:v1";

const uuid = () =>
    (crypto?.randomUUID?.() || `stage-${Math.random().toString(36).slice(2, 9)}`);

function defaultPlan() {
    return {
        poolSpotIds: [],
        stages: [{ id: uuid(), title: "Etappe 1", spotIds: [] }],
    };
}

function sanitizePlan(plan, spotIds) {
    const allowed = new Set(spotIds);
    const uniquePool = [];
    for (const id of plan.poolSpotIds || []) {
        if (allowed.has(id) && !uniquePool.includes(id)) uniquePool.push(id);
    }

    const stages = Array.isArray(plan.stages) ? plan.stages : [];
    const cleanedStages = stages.map((stage, idx) => {
        const ids = [];
        for (const id of stage.spotIds || []) {
            if (allowed.has(id) && !ids.includes(id)) ids.push(id);
        }
        return {
            id: stage.id || uuid(),
            title: stage.title || `Etappe ${idx + 1}`,
            spotIds: ids,
        };
    });

    const used = new Set(cleanedStages.flatMap((s) => s.spotIds));
    const poolSpotIds = uniquePool.filter((id) => !used.has(id));

    if (!cleanedStages.length) cleanedStages.push({ id: uuid(), title: "Etappe 1", spotIds: [] });

    return { poolSpotIds, stages: cleanedStages };
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
            const ids = spots.map((s) => s.id);
            store.set(loadPlan(ids));
        },
        reset(spots) {
            const ids = spots.map((s) => s.id);
            store.set(
                sanitizePlan(
                    {
                        poolSpotIds: ids,
                        stages: [{ id: uuid(), title: "Etappe 1", spotIds: [] }],
                    },
                    ids,
                ),
            );
        },
        syncWithSpots(spots) {
            const ids = spots.map((s) => s.id);
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
