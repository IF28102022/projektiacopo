<script>
    import { dndzone } from "svelte-dnd-action";
    import { tourPlan } from "$lib/stores/tourPlan";
    import { createEventDispatcher, onMount } from "svelte";

    export let spots = [];

    const dispatch = createEventDispatcher();

    let spotMap = new Map();

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
        (crypto?.randomUUID?.() || `stage-${Math.random().toString(36).slice(2, 9)}`);

    $: spotMap = new Map(spots.map((s) => [s.id, s]));
    $: plan = $tourPlan;
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
    $: canCompute = orderedSpots.length >= 2 && !loading;

    function handlePoolFinalize(event) {
        const draggedId = event.detail?.info?.dragged?.id;
        const ids = event.detail.items.map((item) => item.id);

        tourPlan.update((current) => {
            const stages = draggedId
                ? current.stages.map((stage) => ({
                      ...stage,
                      spotIds: stage.spotIds.filter((id) => id !== draggedId),
                  }))
                : current.stages;
            return { ...current, poolSpotIds: ids, stages };
        });
    }

    function handleStageFinalize(stageId, event) {
        const draggedId = event.detail?.info?.dragged?.id;
        const ids = event.detail.items.map((item) => item.id);

        tourPlan.update((current) => {
            const stages = current.stages.map((stage) => {
                if (stage.id === stageId) return { ...stage, spotIds: ids };
                return draggedId
                    ? { ...stage, spotIds: stage.spotIds.filter((id) => id !== draggedId) }
                    : stage;
            });
            const pool = draggedId
                ? current.poolSpotIds.filter((id) => id !== draggedId)
                : current.poolSpotIds;
            return { ...current, stages, poolSpotIds: pool };
        });
    }

    function addStage() {
        tourPlan.update((current) => ({
            ...current,
            stages: [
                ...current.stages,
                { id: uuid(), title: `Etappe ${current.stages.length + 1}`, spotIds: [] },
            ],
        }));
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
        tourPlan.reset(spots);
        routeSummary = null;
        dispatch("routeCleared");
    }

    async function computeRoute() {
        if (!canCompute) return;
        loading = true;
        error = "";
        routeSummary = null;

        try {
            const coordinates = orderedSpots.map((spot) => ({
                lat: Number(spot.lat),
                lng: Number(spot.lng),
            }));
            const res = await fetch("/api/route/osrm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coordinates }),
            });
            if (!res.ok) throw new Error("OSRM nicht erreichbar");
            const data = await res.json();
            routeSummary = {
                distance: data.distance,
                duration: data.duration,
                spots: orderedSpots,
            };
            dispatch("routeComputed", {
                geometry: data.geometry,
                spots: orderedSpots,
                distance: data.distance,
                duration: data.duration,
            });
        } catch (err) {
            error = err?.message || "Route konnte nicht berechnet werden.";
        } finally {
            loading = false;
        }
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
                        .map((id) => get(spotMap).get(id))
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
            if (!res.ok) throw new Error("Optimierung fehlgeschlagen");
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
        } catch (err) {
            error = err?.message || "Optimierung konnte nicht ausgeführt werden.";
        } finally {
            loading = false;
        }
    }
</script>

<section class="builder">
    <div class="builder-head">
        <div>
            <p class="eyebrow">Route Builder</p>
            <h2>Favoriten zu Etappen ziehen</h2>
            <p class="muted">Spots per Drag & Drop in Etappen sortieren, dann Route berechnen.</p>
        </div>
        <div class="actions">
            <button class="ghost" type="button" on:click={addStage}>Etappe hinzufügen</button>
            <button class="ghost danger" type="button" on:click={resetPlan}>Plan zurücksetzen</button>
        </div>
    </div>

    <div class="grid">
        <div class="panel">
            <div class="panel-head">
                <p class="panel-title">Favoriten-Pool</p>
                <p class="panel-meta">{poolItems.length} Spots</p>
            </div>
            <div
                class="zone"
                use:dndzone={{
                    items: poolItems,
                    flipDurationMs: 150,
                    type: "spot",
                }}
                on:finalize={handlePoolFinalize}
            >
                {#if poolItems.length === 0}
                    <p class="muted empty">Keine Spots im Pool.</p>
                {:else}
                    {#each poolItems as item}
                        <div class="card">
                            <p class="title">{item.title}</p>
                            <p class="sub">
                                {item.spot.region || "—"} · {item.spot.spotType || "Spot"}
                            </p>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <div class="panel stages">
            <div class="panel-head">
                <p class="panel-title">Etappen</p>
                <p class="panel-meta">{stageItems.length} Spalten</p>
            </div>
            <div class="stages-grid">
                {#each stageItems as stage, idx (stage.id)}
                    <div class="stage">
                        <div class="stage-head">
                            <p class="stage-title">{stage.title}</p>
                            <div class="stage-meta">
                                <span>{stage.items.length} Spots</span>
                                {#if stage.items.length === 0 && stageItems.length > 1}
                                    <button
                                        class="tiny danger"
                                        type="button"
                                        on:click={() => removeStage(stage.id)}
                                        aria-label="Etappe entfernen"
                                    >
                                        Entfernen
                                    </button>
                                {/if}
                            </div>
                        </div>

                        <div
                            class="zone"
                            use:dndzone={{
                                items: stage.items,
                                flipDurationMs: 150,
                                type: "spot",
                            }}
                            on:finalize={(event) => handleStageFinalize(stage.id, event)}
                        >
                            {#if stage.items.length === 0}
                                <p class="muted empty">Hierhin ziehen …</p>
                            {:else}
                                {#each stage.items as item}
                                    <div class="card">
                                        <p class="title">{item.title}</p>
                                        <p class="sub">
                                            {item.spot.region || "—"} · {item.spot.spotType || "Spot"}
                                        </p>
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
                    Keine Spots gewählt.
                {:else}
                    {orderedSpots.length} Spots in Route.
                {/if}
            </p>
            {#if routeSummary}
                <p class="muted">
                    Distanz: {(routeSummary.distance / 1000).toFixed(1)} km · Dauer:
                    {(routeSummary.duration / 60).toFixed(0)} min
                </p>
            {/if}
            {#if error}
                <p class="error">{error}</p>
            {/if}
        </div>
        <div class="right">
            <button class="ghost" type="button" on:click={() => optimize("global")} disabled={loading}>
                AI optimieren
            </button>
            <button class="primary" type="button" on:click={computeRoute} disabled={!canCompute}>
                {#if loading}
                    Berechne …
                {:else}
                    Route berechnen
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
