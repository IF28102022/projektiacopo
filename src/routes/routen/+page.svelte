<script>
    import { onMount, tick } from "svelte";
    import { browser } from "$app/environment";
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import { tourPlan } from "$lib/stores/tourPlan";

    export let data;

    let map;
    let leaflet;
    let mapInitialized = false;
    let routeLayer = null;
    let routeMarkers = [];
    let waypointMarkers = [];
    let routeInfo = null;
    let routeError = "";
    let routeLoading = false;
    let lastRouteKey = "";

    const speedKnots = 6;
    const spotTypeLabels = {
        Bucht: "Cove",
        Ankerplatz: "Anchorage",
        Marina: "Marina",
        Mooringfeld: "Mooring field",
        Hafen: "Harbor",
    };

    onMount(() => {
        tourPlan.init(data.spots);
        tourPlan.syncWithSpots(data.spots);
    });

    $: plan = $tourPlan;
    $: spotMap = new Map((data.spots || []).map((spot) => [spot.id, spot]));
    $: tourStages = (plan?.stages || []).map((stage, index) => ({
        id: stage.id,
        title: stage.title || `Tour ${index + 1}`,
        spots: (stage.spotIds || [])
            .map((id) => spotMap.get(id))
            .filter(Boolean),
    }));
    $: orderedSpots = (plan?.stages || []).flatMap((stage) =>
        stage.spotIds.map((id) => spotMap.get(id)).filter(Boolean),
    );
    $: waypoints = plan?.waypoints || [];
    $: routePoints = buildRoutePoints(orderedSpots, waypoints);
    $: hasRoute = orderedSpots.length > 0;

    $: if (browser && hasRoute) {
        initMap();
    }

    $: if (mapInitialized) {
        drawRoute();
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
        return 2 * 6371000 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }

    function buildDirectRoute(points, knots = speedKnots) {
        let distance = 0;
        for (let i = 1; i < points.length; i += 1) {
            distance += haversineMeters(points[i - 1], points[i]);
        }
        const speedMps = (Number(knots) || 0) * 1.852 / 3.6;
        const duration = speedMps > 0 ? distance / speedMps : 0;
        return {
            geometry: {
                type: "LineString",
                coordinates: points.map((p) => [Number(p.lng), Number(p.lat)])
            },
            distance,
            duration
        };
    }

    async function initMap() {
        if (!browser || mapInitialized) return;
        await tick();
        const target = document.getElementById("routes-map");
        if (!target) return;

        const L = (await import("leaflet")).default;
        leaflet = L;
        map = L.map("routes-map", {
            center: [46.5, 10],
            zoom: 4,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
            attribution: "© OpenSeaMap contributors",
        }).addTo(map);

        mapInitialized = true;
        drawRoute();
    }

    function clearRoute() {
        if (routeLayer) {
            routeLayer.remove();
            routeLayer = null;
        }
        routeMarkers.forEach((m) => m.remove?.());
        waypointMarkers.forEach((m) => m.remove?.());
        routeMarkers = [];
        waypointMarkers = [];
        routeInfo = null;
    }

    function drawRoute() {
        if (!mapInitialized) return;
        if (!routePoints.length || routePoints.length < 2) {
            clearRoute();
            return;
        }

        const key = routePoints.map((p) => `${p.lat},${p.lng}`).join("|");
        if (key === lastRouteKey) return;
        lastRouteKey = key;

        routeLoading = true;
        routeError = "";

        try {
            const route = buildDirectRoute(routePoints);
            clearRoute();
            routeLayer = leaflet.polyline(
                route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
                {
                    color: "#0f6fb8",
                    weight: 4,
                    opacity: 0.85,
                },
            ).addTo(map);

            routeMarkers = orderedSpots
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

            const bounds = leaflet.latLngBounds(
                route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
            );
            map.fitBounds(bounds, { padding: [40, 40] });

            routeInfo = {
                distance: route.distance,
                duration: route.duration,
                count: orderedSpots.length,
                waypoints: waypoints.length,
            };
        } catch (err) {
            routeError = "Route could not be drawn.";
            console.error(err);
        } finally {
            routeLoading = false;
        }
    }
</script>

<Header />

<main class="page">
    <section class="section map-section">
        <div class="container">
            <div class="map-panel">
                <div class="map-head">
                    <div>
                        <p class="eyebrow">Route map</p>
                        <h1>Your route at sea</h1>
                        <p class="subtitle">
                            The route connects your tour including waypoints.
                        </p>
                    </div>
                    <div class="map-summary">
                        <span>{orderedSpots.length} Spots</span>
                        <span>{waypoints.length} Waypoints</span>
                        {#if routeInfo}
                            <span>{(routeInfo.distance / 1000).toFixed(1)} km</span>
                            <span>{(routeInfo.duration / 60).toFixed(0)} min</span>
                        {/if}
                    </div>
                </div>

                {#if !hasRoute}
                    <div class="empty">
                        <div>
                            <p class="empty-title">No routes saved yet</p>
                            <p class="empty-text">
                                Create a route in tour planning to see it here.
                            </p>
                        </div>
                        <a class="ghost-link" href="/tour-planning">Go to tour planning</a>
                    </div>
                {:else}
                    <div class="map-wrap">
                        <div id="routes-map"></div>
                    </div>
                    {#if routeLoading}
                        <p class="muted map-note">Loading route …</p>
                    {/if}
                    {#if routeError}
                        <p class="error">{routeError}</p>
                    {/if}
                {/if}
            </div>
        </div>
    </section>

    <section class="section list-section">
        <div class="container">
            {#if hasRoute}
                <div class="stage-grid">
                    {#each tourStages as stage}
                        {#if stage.spots.length}
                            <article class="stage-card">
                                <div class="stage-head">
                                    <p class="stage-title">{stage.title}</p>
                                    <span class="stage-count">
                                        {stage.spots.length} Spots
                                    </span>
                                </div>
                                <div class="stage-list">
                                    {#each stage.spots as spot, index}
                                        <div class="spot-row">
                                            <span class="spot-index"
                                                >{index + 1}</span
                                            >
                                            <div>
                                                <p class="spot-name">
                                                    {spot.name}
                                                </p>
                                                <p class="spot-meta">
                                                    {spot.region || "—"} · {spotTypeLabels[spot.spotType] ||
                                                        spot.spotType ||
                                                        "Spot"}
                                                </p>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </article>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</main>

<Footer />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap");

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: #0f1f1f;
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    .page {
        min-height: 100vh;
        background: url("/routes.jpeg") center/cover no-repeat fixed;
        color: #f7f6f4;
    }

    .section {
        padding: 2.8rem 0 3.5rem;
        background: transparent;
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .map-panel {
        background: rgba(255, 255, 255, 0.92);
        border-radius: 1.25rem;
        border: 1px solid rgba(255, 255, 255, 0.55);
        box-shadow: 0 20px 50px rgba(12, 40, 70, 0.2);
        padding: 1.6rem;
        color: #0f172a;
    }

    .map-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.2rem;
        flex-wrap: wrap;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: #eef4ff;
        color: #0f6fb8;
        padding: 0.35rem 0.85rem;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 0.7rem;
    }

    h1 {
        margin: 0;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(2rem, 3.4vw, 3rem);
        color: #0f172a;
    }

    .subtitle {
        margin: 0.45rem 0 0;
        color: #4b5563;
        max-width: 560px;
        line-height: 1.6;
    }

    .map-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        justify-content: flex-end;
    }

    .map-summary span {
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        background: #eef4ff;
        color: #0f6fb8;
        font-weight: 700;
        font-size: 0.85rem;
    }

    .map-wrap {
        margin-top: 1.1rem;
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid #e5e7eb;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
        background: #e6eef7;
    }

    #routes-map {
        width: 100%;
        height: clamp(320px, 46vh, 520px);
    }

    .map-note {
        margin: 0.85rem 0 0;
        color: #6b7280;
        font-size: 0.95rem;
    }

    .error {
        margin: 0.85rem 0 0;
        color: #b91c1c;
        font-weight: 600;
    }

    .list-section {
        padding-top: 0;
    }

    .stage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
    }

    .stage-card {
        background: rgba(255, 255, 255, 0.92);
        border-radius: 1.1rem;
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 18px 45px rgba(12, 40, 70, 0.18);
        padding: 1.2rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        color: #111820;
    }

    .stage-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.6rem;
    }

    .stage-title {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.01em;
        color: #0f172a;
    }

    .stage-count {
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #eef4ff;
        color: #0f6fb8;
        font-weight: 700;
        font-size: 0.85rem;
    }

    .stage-list {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }

    .spot-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        padding: 0.6rem 0.7rem;
        border-radius: 0.85rem;
        background: #f8fbff;
        border: 1px solid #e5eaf5;
    }

    .spot-index {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: #0f6fb8;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .spot-name {
        margin: 0;
        font-weight: 700;
    }

    .spot-meta {
        margin: 0.1rem 0 0;
        color: #5f6b7a;
        font-size: 0.9rem;
    }

    .empty {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1.2rem 1.4rem;
        background: rgba(255, 255, 255, 0.92);
        border-radius: 1rem;
        border: 1px dashed #e2e8f0;
        box-shadow: 0 12px 30px rgba(12, 40, 70, 0.14);
        color: #111820;
    }

    .empty-title {
        margin: 0;
        font-weight: 700;
    }

    .empty-text {
        margin: 0.2rem 0 0;
        color: #5f6b7a;
    }

    .ghost-link {
        color: #1f2937;
        text-decoration: none;
        font-weight: 600;
        padding: 0.55rem 1rem;
        border-radius: 0.65rem;
        border: 1px solid #e5e7eb;
        background: #ffffff;
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .ghost-link:hover {
        color: #0f1f35;
        border-color: #d5cfc3;
        background: #f9f7f2;
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

    @media (max-width: 720px) {
        .map-head {
            flex-direction: column;
            align-items: flex-start;
        }

        .map-summary {
            justify-content: flex-start;
        }
    }
</style>
