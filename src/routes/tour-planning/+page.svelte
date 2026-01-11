<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import RouteBuilder from "$lib/components/tour/RouteBuilder.svelte";
    import { tourPlan } from "$lib/stores/tourPlan";
    import { browser } from "$app/environment";
    import { tick, onDestroy } from "svelte";

    export let data;

    let started = false;
    let autoStarted = false;
    let map;
    let leaflet;
    let currentMarker = null;
    let mapInitialized = false;
    let routeLayer = null;
    let routeMarkers = [];
    let waypointMarkers = [];
    let routeInfo = null;
    let waypointMode = false;
    let waypointAfterId = null;

    const typeIcons = {
        Ankerplatz: "⚓",
        Marina: "🛥",
        Bucht: "🏝",
        Mooringfeld: "🟡",
        Hafen: "🚢",
    };
    const spotTypeLabels = {
        Bucht: "Cove",
        Ankerplatz: "Anchorage",
        Marina: "Marina",
        Mooringfeld: "Mooring field",
        Hafen: "Harbor",
    };

    $: plan = $tourPlan;
    $: spotMap = new Map((data?.spots ?? []).map((spot) => [spot.id, spot]));
    $: orderedSpots = (plan?.stages || []).flatMap((stage) =>
        stage.spotIds.map((id) => spotMap.get(id)).filter(Boolean),
    );
    $: waypoints = plan?.waypoints || [];
    $: hasSavedRoute =
        orderedSpots.length > 0 ||
        waypoints.length > 0 ||
        (plan?.tourNotes || "").trim().length > 0;
    $: if (!waypointAfterId || !orderedSpots.some((spot) => spot.id === waypointAfterId)) {
        waypointAfterId = orderedSpots[orderedSpots.length - 1]?.id || null;
    }
    $: if (mapInitialized) {
        updateWaypointMarkers();
    }
    $: if (browser && !started && hasSavedRoute && !autoStarted) {
        autoStarted = true;
        startPlanning({ scroll: false });
    }

    function formatDepth(spot) {
        if (spot.depthMin || spot.depthMax) {
            return `Depth ${spot.depthMin ?? "?"}–${spot.depthMax ?? "?"} m`;
        }
        return "";
    }

    function buildPopup(spot) {
        const icon = typeIcons[spot.spotType] || "📍";
        const depth = formatDepth(spot);

        return `
            <div class="popup">
                <div class="popup-title">${icon} <strong>${spot.name || "Spot"}</strong> ${spot.spotType ? "· " + (spotTypeLabels[spot.spotType] || spot.spotType) : ""}</div>
                ${depth ? `<div class="popup-meta">${depth}</div>` : ""}
                <div class="popup-coords">${Number(spot.lat).toFixed(4)}, ${Number(spot.lng).toFixed(4)}</div>
            </div>
        `;
    }

    async function initMap() {
        if (!browser || mapInitialized) return;

        const L = (await import("leaflet")).default;
        leaflet = L;

        map = L.map("tour-map", {
            center: [46.5, 10],
            zoom: 4,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
            attribution: "© OpenSeaMap contributors",
        }).addTo(map);

        const markersInView = [];

        for (const spot of data?.spots ?? []) {
            const lat = Number(spot.lat);
            const lng = Number(spot.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

            L.marker([lat, lng]).addTo(map).bindPopup(buildPopup(spot));
            markersInView.push([lat, lng]);
        }

        if (markersInView.length > 1) {
            map.fitBounds(markersInView, { padding: [40, 40] });
        } else if (markersInView.length === 1) {
            map.setView(markersInView[0], 5);
        }

        map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            if (waypointMode) {
                addWaypoint(lat, lng);
                return;
            }

            if (currentMarker) currentMarker.remove();

            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(
                    `Spot placed<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                )
                .openPopup();
        });

        mapInitialized = true;
        updateWaypointMarkers();
    }

    async function startPlanning({ scroll = true } = {}) {
        started = true;
        await tick();
        await initMap();
        if (scroll) {
            const anchor = document.getElementById("plan");
            anchor?.scrollIntoView({ behavior: "smooth" });
        }
    }

    function clearRoute() {
        if (routeLayer) {
            routeLayer.remove();
            routeLayer = null;
        }
        routeMarkers.forEach((m) => m.remove?.());
        routeMarkers = [];
        routeInfo = null;
    }

    function addWaypoint(lat, lng) {
        if (!waypointAfterId) return;
        const id = `wp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        tourPlan.update((current) => {
            const list = Array.isArray(current.waypoints) ? current.waypoints : [];
            return {
                ...current,
                waypoints: [
                    ...list,
                    {
                        id,
                        lat: Number(lat),
                        lng: Number(lng),
                        afterSpotId: waypointAfterId,
                        order: Date.now()
                    }
                ]
            };
        });
    }

    function removeWaypoint(id) {
        tourPlan.update((current) => ({
            ...current,
            waypoints: (current.waypoints || []).filter((wp) => wp.id !== id)
        }));
    }

    function clearWaypoints() {
        tourPlan.update((current) => ({
            ...current,
            waypoints: []
        }));
    }

    function updateWaypointMarkers() {
        if (!mapInitialized || !leaflet) return;
        waypointMarkers.forEach((m) => m.remove?.());
        waypointMarkers = waypoints.map((wp, idx) => {
            const icon = leaflet.divIcon({
                className: "route-waypoint",
                html: `<span>•</span>`,
                iconSize: [18, 18]
            });
            const marker = leaflet.marker([wp.lat, wp.lng], { icon }).addTo(map);
            marker.bindPopup(`Waypoint ${idx + 1}`);
            return marker;
        });
    }

    async function handleRouteComputed(event) {
        const { geometry, spots, distance, duration, waypoints: routeWaypoints } = event.detail;
        if (!mapInitialized) await initMap();
        if (!leaflet) leaflet = (await import("leaflet")).default;

        clearRoute();
        routeInfo = {
            distance,
            duration,
            count: spots?.length || 0,
            waypoints: Array.isArray(routeWaypoints) ? routeWaypoints.length : 0
        };

        const latLngs =
            geometry?.coordinates?.map(([lng, lat]) => [Number(lat), Number(lng)]) || [];

        if (latLngs.length) {
            routeLayer = leaflet.polyline(latLngs, {
                color: "#0f6fb8",
                weight: 4,
                opacity: 0.85,
            }).addTo(map);
            map.fitBounds(leaflet.latLngBounds(latLngs), { padding: [40, 40] });
        }

        if (Array.isArray(spots)) {
            routeMarkers = spots
                .map((spot, idx) => {
                    if (!Number.isFinite(spot.lat) || !Number.isFinite(spot.lng)) return null;
                    const icon = leaflet.divIcon({
                        className: "route-marker",
                        html: `<span>${idx + 1}</span>`,
                        iconSize: [28, 28],
                    });
                    const marker = leaflet.marker([spot.lat, spot.lng], { icon }).addTo(map);
                    marker.bindPopup(`${idx + 1}. ${spot.name || "Spot"}`);
                    return marker;
                })
                .filter(Boolean);
        }
    }

    onDestroy(() => {
        clearRoute();
        if (map) {
            map.remove();
            map = null;
        }
    });
</script>

<Header />

<main class="page">
    {#if !started}
        <section class="start-screen">
            <div class="start-card">
                <p class="start-eyebrow">Tour planning</p>
                <h1>Start your tour plan.</h1>
                <p class="start-subtitle">
                    Click the button — then you will see the map and all spots for
                    route planning.
                </p>
                <button
                    class="start-btn"
                    type="button"
                    on:click={startPlanning}
                >
                    Plan tour
                </button>
            </div>
        </section>
    {:else}
        <section class="planner" id="plan">
            <div class="container planner-grid">
                <div class="panel map-panel">
                    <div class="panel-head">
                        <div class="row">
                            <span class="dot accent"></span>
                            <p class="panel-title">Map</p>
                        </div>
                        <p class="panel-meta">
                            Markers & click for new position
                        </p>
                    </div>
                    <div class="map-tools">
                        <div class="map-tools-row">
                            <button
                                class:active={waypointMode}
                                class="ghost"
                                type="button"
                                disabled={orderedSpots.length === 0}
                                on:click={() => (waypointMode = !waypointMode)}
                            >
                                {waypointMode ? "Waypoints: On" : "Add waypoints"}
                            </button>
                            <label class="map-select">
                                <span>After spot</span>
                                <select bind:value={waypointAfterId} disabled={orderedSpots.length === 0}>
                                    {#each orderedSpots as spot}
                                        <option value={spot.id}>{spot.name}</option>
                                    {/each}
                                </select>
                            </label>
                            <button
                                class="ghost danger"
                                type="button"
                                disabled={waypoints.length === 0}
                                on:click={clearWaypoints}
                            >
                                Clear waypoints
                            </button>
                        </div>
                        {#if waypoints.length}
                            <div class="waypoint-list">
                                {#each waypoints as wp, idx (wp.id)}
                                    <div class="waypoint-item">
                                        <span>
                                            WP {idx + 1} · after {spotMap.get(wp.afterSpotId)?.name ||
                                            "Spot"}
                                        </span>
                                        <button
                                            class="tiny danger"
                                            type="button"
                                            on:click={() => removeWaypoint(wp.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="muted waypoint-empty">No waypoints set.</p>
                        {/if}
                    </div>
                    <div class="map-wrapper">
                        <div id="tour-map"></div>
                    </div>
                    <p class="panel-foot">
                        Spots from the database are set as markers. Clicking the map
                        places a marker for planning.
                    </p>
                    {#if routeInfo}
                        <p class="panel-foot stats">
                            Route: {(routeInfo.distance / 1000).toFixed(1)} km
                            · {(routeInfo.duration / 60).toFixed(0)} min
                            · {routeInfo.count} spots
                            · {routeInfo.waypoints} waypoints
                        </p>
                    {/if}
                </div>

            </div>

            <div class="container builder-container">
                <RouteBuilder
                    spots={data.spots}
                    waypoints={waypoints}
                    on:routeComputed={handleRouteComputed}
                    on:routeCleared={clearRoute}
                />
            </div>
        </section>
    {/if}
</main>

<Footer />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap");

    :global(:root) {
        --bg: #f7f4ec;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #5f6b7a;
        --border: #e5e7eb;
        --accent: #0f6fb8;
        --accent-soft: #e6f0fa;
        --shadow: 0 18px 60px rgba(15, 81, 146, 0.08);
    }

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: url("/Tourplanung.jpeg") center/cover no-repeat fixed;
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: url("/Tourplanung.jpeg") center/cover no-repeat fixed;
    }

    .start-screen {
        position: relative;
        min-height: calc(100vh - 80px);
        display: grid;
        place-items: center;
        padding: 2rem 1.5rem;
        overflow: hidden;
    }

    .start-card {
        max-width: 620px;
        width: min(620px, 100%);
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(15, 111, 184, 0.12);
        box-shadow: 0 24px 80px rgba(12, 50, 94, 0.16);
        border-radius: 1.4rem;
        padding: 2rem 2.4rem;
        text-align: center;
        position: relative;
        z-index: 2;
    }

    .start-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.4rem 0.85rem;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .start-card h1 {
        margin: 0.75rem 0 0.35rem;
        font-family: "Playfair Display", "Manrope", serif;
        font-size: clamp(2rem, 4.2vw, 2.8rem);
        letter-spacing: -0.01em;
    }

    .start-subtitle {
        margin: 0 0 1.3rem;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.6;
    }

    .start-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1.8rem;
        border-radius: 999px;
        background: var(--accent);
        color: #f8fbff;
        border: 1px solid transparent;
        font-weight: 800;
        letter-spacing: 0.01em;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 18px 50px rgba(15, 111, 184, 0.26);
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            background 0.15s ease;
    }

    .start-btn:hover {
        background: #0c5c99;
        transform: translateY(-1px);
        box-shadow: 0 20px 60px rgba(12, 92, 153, 0.28);
    }

    .start-btn:active {
        transform: translateY(0);
    }

    .planner {
        padding: 2.5rem 0 2.8rem;
        background: rgba(255, 255, 255, 0.8);
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .planner-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
    }

    .panel {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border-radius: 1.2rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        overflow: hidden;
    }

    .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #e5e7eb;
        gap: 0.75rem;
    }

    .panel-title {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.01em;
        color: #0f172a;
    }

    .panel-meta {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--muted);
    }

    .dot.accent {
        background: var(--accent);
        box-shadow: 0 0 0 8px var(--accent-soft);
    }

    .map-wrapper {
        height: clamp(320px, 40vh, 520px);
        border-radius: 0.9rem;
        overflow: hidden;
        margin: 0 1.1rem 1rem;
        border: 1px solid #e5e7eb;
    }

    #tour-map {
        width: 100%;
        height: 100%;
    }

    .panel-foot {
        margin: 0 1.1rem 1.1rem;
        color: var(--muted);
        font-size: 0.95rem;
    }

    .panel-foot.stats {
        font-weight: 700;
        color: #0f172a;
    }

    .map-tools {
        padding: 0.9rem 1.1rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .map-tools-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
    }

    .map-select {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--muted);
        font-weight: 700;
        font-size: 0.85rem;
    }

    .map-select select {
        border-radius: 999px;
        border: 1px solid var(--border);
        padding: 0.35rem 0.75rem;
        font-weight: 600;
        background: #ffffff;
    }

    .map-tools .ghost.active {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--accent-soft);
    }

    .waypoint-list {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .waypoint-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.6rem;
        padding: 0.45rem 0.7rem;
        border-radius: 0.65rem;
        background: #f8fbff;
        border: 1px solid #e5e7eb;
        font-size: 0.9rem;
        color: var(--muted);
    }

    .waypoint-empty {
        font-size: 0.9rem;
    }

    .list-panel .ghost-link {
        color: var(--muted);
        text-decoration: none;
        font-weight: 700;
        padding: 0.45rem 0.9rem;
        border-radius: 0.65rem;
        border: 1px solid var(--border);
        background: #f8fafd;
    }

    .list-panel .ghost-link:hover {
        color: var(--accent);
        border-color: var(--accent);
        background: var(--accent-soft);
    }

    .empty {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1rem 1.25rem;
        background: #f9fbff;
        border: 1px dashed var(--border);
        border-radius: 0.9rem;
        margin: 1rem;
    }

    .empty-title {
        margin: 0;
        font-weight: 700;
    }

    .empty-text {
        margin: 0.15rem 0 0;
        color: var(--muted);
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        text-decoration: none;
        padding: 0.6rem 1.3rem;
        border-radius: 999px;
        font-weight: 700;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.24);
        border: 1px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        white-space: nowrap;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .ghost-btn {
        background: #ffffff;
        color: var(--accent);
        border: 1px solid var(--accent);
        box-shadow: none;
    }

    .builder-container {
        margin-top: 1rem;
    }

    :global(.route-marker) {
        background: #0f6fb8;
        color: #fff;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border: 2px solid #fff;
        font-weight: 800;
        box-shadow: 0 8px 22px rgba(15, 111, 184, 0.28);
    }

    :global(.route-waypoint) {
        background: #ffffff;
        color: #0f6fb8;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: grid;
        place-items: center;
        border: 2px solid #0f6fb8;
        font-weight: 800;
        box-shadow: 0 6px 16px rgba(15, 111, 184, 0.2);
    }

    :global(.leaflet-control-attribution) {
        font-size: 10px !important;
    }

    :global(.leaflet-popup-content) {
        margin: 0.3rem;
        font-family: "Manrope", system-ui, sans-serif;
        color: var(--text);
    }

    :global(.popup-title) {
        font-weight: 800;
        margin-bottom: 0.35rem;
        display: flex;
        gap: 0.3rem;
        align-items: center;
    }

    :global(.popup-meta) {
        font-size: 0.9rem;
        color: var(--muted);
        margin-bottom: 0.2rem;
    }

    :global(.popup-coords) {
        margin-top: 0.2rem;
        font-size: 0.85rem;
        color: var(--muted);
    }

    @media (max-width: 800px) {
        .panel-head {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
