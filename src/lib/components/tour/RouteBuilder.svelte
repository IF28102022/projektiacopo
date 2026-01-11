<script>
    import { tourPlan } from "$lib/stores/tourPlan";
    import { createEventDispatcher, onMount } from "svelte";

    export let spots = [];
    export let waypoints = [];

    const dispatch = createEventDispatcher();

    let spotMap = new Map();
    let plan = { poolSpotIds: [], stages: [] };
    let poolItems = [];
    let stageItems = [];
    let orderedSpots = [];
    let activeStageId = null;
    let canCompute = false;
    let loading = false;
    let error = "";
    let routeSummary = null;

    onMount(() => {
        tourPlan.init(spots);
        tourPlan.syncWithSpots(spots);
        tourPlan.update((current) => {
            const hasAssignments = current.stages.some((s) => s.spotIds.length);
            if (!hasAssignments && current.poolSpotIds.length === 0) {
                return { ...current, poolSpotIds: spots.map((s) => s.id) };
            }
            return current;
        });
    });

    $: if (spots) {
        tourPlan.syncWithSpots(spots);
    }

    const uuid = () =>
        (globalThis.crypto?.randomUUID?.() ||
            `stage-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

    $: spotMap = new Map(spots.map((s) => [s.id, s]));
    const spotTypeLabels = {
        Bucht: "Cove",
        Ankerplatz: "Anchorage",
        Marina: "Marina",
        Mooringfeld: "Mooring field",
        Hafen: "Harbor",
    };
    $: plan = $tourPlan || { poolSpotIds: [], stages: [] };
    $: poolItems = plan.poolSpotIds
        .map((id) => spotMap.get(id))
        .filter(Boolean)
        .map((spot) => ({ id: spot.id, title: spot.name, spot }));
    $: stageItems = plan.stages.map((stage) => ({
        id: stage.id,
        title: stage.title,
        items: stage.spotIds
            .map((id) => spotMap.get(id))
            .filter(Boolean)
            .map((spot) => ({ id: spot.id, title: spot.name, spot })),
    }));
    $: orderedSpots = plan.stages.flatMap((stage) =>
        stage.spotIds.map((id) => spotMap.get(id)).filter(Boolean),
    );
    $: if (!activeStageId || !plan.stages.some((stage) => stage.id === activeStageId)) {
        activeStageId = plan.stages[0]?.id || null;
    }
    $: routePoints = buildRoutePoints(orderedSpots, waypoints);
    $: canCompute = orderedSpots.length >= 2 && !loading;

    function addToStage(spotId, stageId = activeStageId) {
        if (!stageId) return;
        tourPlan.update((current) => {
            const stages = current.stages.map((stage) => {
                const cleaned = stage.spotIds.filter((id) => id !== spotId);
                if (stage.id === stageId && !cleaned.includes(spotId)) {
                    return { ...stage, spotIds: [...cleaned, spotId] };
                }
                return { ...stage, spotIds: cleaned };
            });
            const poolSpotIds = current.poolSpotIds.filter((id) => id !== spotId);
            return { ...current, stages, poolSpotIds };
        });
    }

    function removeFromStage(stageId, spotId) {
        tourPlan.update((current) => {
            const stages = current.stages.map((stage) => {
                if (stage.id !== stageId) return stage;
                return { ...stage, spotIds: stage.spotIds.filter((id) => id !== spotId) };
            });
            const poolSpotIds = current.poolSpotIds.includes(spotId)
                ? current.poolSpotIds
                : [...current.poolSpotIds, spotId];
            return { ...current, stages, poolSpotIds };
        });
    }

    function moveWithinStage(stageId, spotId, direction) {
        tourPlan.update((current) => {
            const stages = current.stages.map((stage) => {
                if (stage.id !== stageId) return stage;
                const index = stage.spotIds.indexOf(spotId);
                if (index === -1) return stage;
                const nextIndex = direction === "up" ? index - 1 : index + 1;
                if (nextIndex < 0 || nextIndex >= stage.spotIds.length) return stage;
                const nextIds = [...stage.spotIds];
                [nextIds[index], nextIds[nextIndex]] = [nextIds[nextIndex], nextIds[index]];
                return { ...stage, spotIds: nextIds };
            });
            return { ...current, stages };
        });
    }

    function addStage() {
        if (plan.stages.length >= 1) return;
        const newStageId = uuid();
        const nextStages = [
            ...plan.stages,
            { id: newStageId, title: `Tour ${plan.stages.length + 1}`, spotIds: [] },
        ];
        tourPlan.set({ ...plan, stages: nextStages });
        activeStageId = newStageId;
    }

    function removeStage(id) {
        tourPlan.update((current) => {
            const stage = current.stages.find((s) => s.id === id);
            if (!stage || stage.spotIds.length) return current;
            const stages = current.stages.filter((s) => s.id !== id);
            return { ...current, stages: stages.length ? stages : current.stages };
        });
    }

    function resetPlan() {
        const ids = Array.isArray(spots) ? spots.map((s) => s.id) : [];
        const newStageId = uuid();
        tourPlan.set({
            poolSpotIds: ids,
            stages: [{ id: newStageId, title: "Tour 1", spotIds: [] }],
            waypoints: []
        });
        activeStageId = newStageId;
        routeSummary = null;
        dispatch("routeCleared");
    }

    async function computeRouteFromSpots(spotsToRoute, { keepLoading = false } = {}) {
        if (!spotsToRoute || spotsToRoute.length < 2) {
            routeSummary = null;
            dispatch("routeCleared");
            return;
        }
        if (!keepLoading) loading = true;
        error = "";
        routeSummary = null;

        try {
            const points = Array.isArray(routePoints) && routePoints.length
                ? routePoints
                : spotsToRoute;
            const coordinates = points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            }));
            const res = await fetch("/api/route/osrm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coordinates, mode: "direct", speedKnots: 6 }),
            });
            if (!res.ok) throw new Error("OSRM not reachable");
            const data = await res.json();
            routeSummary = {
                distance: data.distance,
                duration: data.duration,
                spots: spotsToRoute,
                waypoints: Array.isArray(waypoints) ? waypoints.length : 0,
            };
            dispatch("routeComputed", {
                geometry: data.geometry,
                spots: spotsToRoute,
                waypoints: Array.isArray(waypoints) ? waypoints : [],
                distance: data.distance,
                duration: data.duration,
            });
        } catch (err) {
            error = err?.message || "Route could not be calculated.";
        } finally {
            if (!keepLoading) loading = false;
        }
    }

    function buildRoutePoints(spotsToRoute, waypointList = []) {
        if (!Array.isArray(spotsToRoute) || spotsToRoute.length === 0) return [];
        const grouped = new Map();
        waypointList.forEach((wp) => {
            if (!wp?.afterSpotId) return;
            if (!grouped.has(wp.afterSpotId)) grouped.set(wp.afterSpotId, []);
            grouped.get(wp.afterSpotId).push(wp);
        });
        return spotsToRoute.flatMap((spot) => {
            const waypointsForSpot = grouped.get(spot.id) || [];
            const sorted = [...waypointsForSpot].sort(
                (a, b) => Number(a.order || 0) - Number(b.order || 0),
            );
            const waypointPoints = sorted.map((wp) => ({
                id: wp.id,
                lat: wp.lat,
                lng: wp.lng,
                kind: "waypoint",
            }));
            return [
                {
                    id: spot.id,
                    lat: spot.lat,
                    lng: spot.lng,
                    kind: "spot",
                },
                ...waypointPoints,
            ];
        });
    }

    async function computeRoute() {
        if (!canCompute) return;
        await computeRouteFromSpots(orderedSpots);
    }

    async function optimize(mode = "global") {
        loading = true;
        error = "";
        try {
            const payload = {
                mode,
                stages: plan.stages.map((stage) => ({
                    id: stage.id,
                    title: stage.title,
                    coordinates: stage.spotIds
                        .map((id) => spotMap.get(id))
                        .filter(Boolean)
                        .map((spot) => ({
                            lat: Number(spot.lat),
                            lng: Number(spot.lng),
                            spotId: spot.id,
                        })),
                })),
            };

            const res = await fetch("/api/route/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Optimization failed");
            const data = await res.json();
            const nextStages = plan.stages.map((stage) => {
                const updated = data.stages.find((s) => s.id === stage.id);
                return updated ? { ...stage, spotIds: updated.spotIds } : stage;
            });
            tourPlan.update((current) => ({
                ...current,
                stages: nextStages,
                poolSpotIds: current.poolSpotIds.filter((id) =>
                    spots.some((s) => s.id === id),
                ),
            }));
            const nextOrderedSpots = nextStages.flatMap((stage) =>
                stage.spotIds.map((id) => spotMap.get(id)).filter(Boolean),
            );
            await computeRouteFromSpots(nextOrderedSpots, { keepLoading: true });
        } catch (err) {
            error = err?.message || "Optimization could not be run.";
        } finally {
            loading = false;
        }
    }
</script>

<section class="builder">
    <div class="builder-head">
        <div>
            <p class="eyebrow">Tour Builder</p>
            <h2>Add favorites to your tour</h2>
            <p class="muted">Select spots, fill the tour, then calculate the route.</p>
        </div>
        <div class="actions">
            <button class="ghost danger" type="button" on:click={resetPlan}>Reset plan</button>
        </div>
    </div>

    <div class="grid">
        <div class="panel">
            <div class="panel-head">
                <div>
                    <p class="panel-title">Favorites pool</p>
                    <p class="panel-meta">{poolItems.length} spots</p>
                </div>
            </div>
            <div class="zone">
                {#if poolItems.length === 0}
                    <p class="muted empty">No spots in the pool.</p>
                {:else}
                    {#each poolItems as item (item.id)}
                        <div class="card pool-card">
                            <div>
                                <p class="title">{item.title}</p>
                                <p class="sub">
                                    {item.spot.region || "—"} · {spotTypeLabels[item.spot.spotType] ||
                                        item.spot.spotType ||
                                        "Spot"}
                                </p>
                            </div>
                            <button
                                class="tiny primary"
                                type="button"
                                on:click={() => addToStage(item.id)}
                                disabled={!activeStageId}
                            >
                                Add
                            </button>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <div class="panel stages">
            <div class="panel-head">
                <p class="panel-title">Tour</p>
                <p class="panel-meta">1 tour</p>
            </div>
            <div class="stages-grid">
                {#each stageItems as stage (stage.id)}
                    <div class="stage" class:active={stage.id === activeStageId}>
                        <div class="stage-head">
                            <p class="stage-title">{stage.title}</p>
                            <div class="stage-meta">
                                <span>{stage.items.length} spots</span>
                            </div>
                        </div>

                        <div class="zone">
                            {#if stage.items.length === 0}
                                <p class="muted empty">No spots in this tour.</p>
                            {:else}
                                {#each stage.items as item, index (item.id)}
                                    <div class="card stage-card">
                                        <div>
                                            <p class="title">{item.title}</p>
                                            <p class="sub">
                                                {item.spot.region || "—"} · {spotTypeLabels[item.spot.spotType] ||
                                                    item.spot.spotType ||
                                                    "Spot"}
                                            </p>
                                        </div>
                                        <div class="card-actions">
                                            <button
                                                class="icon-btn"
                                                type="button"
                                                aria-label="Move up"
                                                on:click={() => moveWithinStage(stage.id, item.id, "up")}
                                                disabled={index === 0}
                                            >
                                                ↑
                                            </button>
                                            <button
                                                class="icon-btn"
                                                type="button"
                                                aria-label="Move down"
                                                on:click={() => moveWithinStage(stage.id, item.id, "down")}
                                                disabled={index === stage.items.length - 1}
                                            >
                                                ↓
                                            </button>
                                            <button
                                                class="icon-btn danger"
                                                type="button"
                                                aria-label="Remove"
                                                on:click={() => removeFromStage(stage.id, item.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="footer-bar">
        <div class="left">
            <p class="muted">
                {#if orderedSpots.length === 0}
                    No spots selected.
                {:else}
                    {orderedSpots.length} spots in route.
                {/if}
            </p>
            {#if routeSummary}
                <p class="muted">
                    Distance: {(routeSummary.distance / 1000).toFixed(1)} km · Duration:
                    {(routeSummary.duration / 60).toFixed(0)} min
                </p>
                <p class="muted">
                    {routeSummary.spots.length} spots · {routeSummary.waypoints} waypoints
                </p>
            {/if}
            {#if error}
                <p class="error">{error}</p>
            {/if}
        </div>
        <div class="right">
            <button class="ghost" type="button" on:click={() => optimize("global")} disabled={loading}>
                Optimize with AI
            </button>
            <button class="primary" type="button" on:click={computeRoute} disabled={!canCompute}>
                {#if loading}
                    Calculating…
                {:else}
                    Calculate route
                {/if}
            </button>
        </div>
    </div>
</section>

<style>
    .builder {
        margin-top: 1.5rem;
        background: #ffffff;
        border: 1px solid rgba(15, 111, 184, 0.08);
        border-radius: 1.2rem;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        padding: 1.2rem 1.3rem 1rem;
    }

    .builder-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        flex-wrap: wrap;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 0.8rem;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.85rem;
    }

    h2 {
        margin: 0.2rem 0 0.15rem;
        letter-spacing: -0.01em;
    }

    .muted {
        margin: 0;
        color: var(--muted);
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .panel {
        background: #f9fbff;
        border: 1px solid rgba(15, 111, 184, 0.08);
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 1rem;
        border-bottom: 1px solid #e5e7eb;
        gap: 0.5rem;
    }

    .panel-title {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.01em;
    }

    .panel-meta {
        margin: 0;
        color: var(--muted);
    }

    .stage-select {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--muted);
        font-size: 0.85rem;
        font-weight: 700;
    }

    .stage-select select {
        border-radius: 999px;
        border: 1px solid #dbe4f5;
        padding: 0.35rem 0.75rem;
        font-weight: 600;
        background: #ffffff;
        color: #0f172a;
    }

    .zone {
        padding: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        min-height: 200px;
    }

    .card {
        background: #ffffff;
        border: 1px solid #dbe4f5;
        border-radius: 0.75rem;
        padding: 0.65rem 0.8rem;
        box-shadow: 0 8px 24px rgba(15, 111, 184, 0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .card .title {
        margin: 0;
        font-weight: 800;
    }

    .card .sub {
        margin: 0.1rem 0 0;
        color: var(--muted);
        font-size: 0.93rem;
    }

    .pool-card button {
        white-space: nowrap;
    }

    .stage-card {
        align-items: flex-start;
    }

    .card-actions {
        display: flex;
        gap: 0.35rem;
        align-items: center;
    }

    .icon-btn {
        border: 1px solid #dbe4f5;
        background: #ffffff;
        color: #1d2b38;
        border-radius: 999px;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        font-weight: 700;
        padding: 0;
    }

    .icon-btn:disabled {
        opacity: 0.45;
    }

    .icon-btn.danger {
        color: #c53030;
        border-color: #f5d0d0;
    }

    .empty {
        border: 1px dashed #dbe4f5;
        border-radius: 0.8rem;
        padding: 0.7rem;
        text-align: center;
    }

    .stages {
        background: #ffffff;
    }

    .stages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
    }

    .stage {
        border: 1px solid #e5e7eb;
        border-radius: 0.85rem;
        background: #f9fbff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .stage.active {
        border-color: rgba(15, 111, 184, 0.4);
        box-shadow: 0 12px 30px rgba(15, 111, 184, 0.08);
    }

    .stage-head {
        padding: 0.75rem 0.85rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.6rem;
    }

    .stage-title {
        margin: 0;
        font-weight: 800;
    }

    .stage-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--muted);
    }

    .footer-bar {
        margin-top: 1rem;
        border-top: 1px solid #e5e7eb;
        padding-top: 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .actions,
    .right {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    button {
        cursor: pointer;
        border: none;
        border-radius: 999px;
        font-weight: 700;
        padding: 0.55rem 0.95rem;
        transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    .ghost {
        background: #ffffff;
        border: 1px solid #dbe4f5;
    }

    .ghost:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(15, 111, 184, 0.1);
    }

    .primary {
        background: var(--accent);
        color: #f8fbff;
        border: 1px solid transparent;
        box-shadow: 0 12px 36px rgba(15, 111, 184, 0.22);
    }

    .primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 14px 40px rgba(15, 111, 184, 0.25);
    }

    .danger {
        border-color: #f5d0d0;
        color: #c53030;
    }

    .tiny {
        font-size: 0.8rem;
        padding: 0.35rem 0.6rem;
    }

    .select {
        background: #ffffff;
        border: 1px solid #dbe4f5;
        color: #1d2b38;
    }

    .error {
        color: #c53030;
        margin: 0;
        font-weight: 700;
    }

    @media (max-width: 720px) {
        .stages-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
