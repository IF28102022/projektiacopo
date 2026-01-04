<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import SpotList from "$lib/components/SpotList.svelte";
    import { browser } from "$app/environment";
    import { tick, onDestroy } from "svelte";

    export let data;

    let started = false;
    let map;
    let currentMarker = null;
    let mapInitialized = false;

    const typeIcons = {
        Ankerplatz: "⚓",
        Marina: "🛥",
        Bucht: "🏝",
        Mooringfeld: "🟡",
        Hafen: "🚢",
    };

    function formatDepth(spot) {
        if (spot.depthMin || spot.depthMax) {
            return `Tiefe ${spot.depthMin ?? "?"}–${spot.depthMax ?? "?"} m`;
        }
        return "";
    }

    function buildPopup(spot) {
        const icon = typeIcons[spot.spotType] || "📍";
        const depth = formatDepth(spot);

        return `
            <div class="popup">
                <div class="popup-title">${icon} <strong>${spot.name || "Spot"}</strong> ${spot.spotType ? "· " + spot.spotType : ""}</div>
                ${depth ? `<div class="popup-meta">${depth}</div>` : ""}
                <div class="popup-coords">${Number(spot.lat).toFixed(4)}, ${Number(spot.lng).toFixed(4)}</div>
            </div>
        `;
    }

    async function initMap() {
        if (!browser || mapInitialized) return;

        const L = (await import("leaflet")).default;

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

            if (currentMarker) currentMarker.remove();

            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(
                    `Spot gesetzt<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                )
                .openPopup();
        });

        mapInitialized = true;
    }

    async function startPlanning() {
        started = true;
        await tick();
        await initMap();
        const anchor = document.getElementById("plan");
        anchor?.scrollIntoView({ behavior: "smooth" });
    }

    onDestroy(() => {
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
                <p class="start-eyebrow">Tourplanung</p>
                <h1>Starte deinen Törn-Plan.</h1>
                <p class="start-subtitle">
                    Button klicken – danach siehst du Karte und alle Spots zur
                    Routenplanung.
                </p>
                <button
                    class="start-btn"
                    type="button"
                    on:click={startPlanning}
                >
                    Tour planen
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
                            <p class="panel-title">Karte</p>
                        </div>
                        <p class="panel-meta">
                            Marker & Klick für neue Position
                        </p>
                    </div>
                    <div class="map-wrapper">
                        <div id="tour-map"></div>
                    </div>
                    <p class="panel-foot">
                        Spots aus der Datenbank sind als Marker gesetzt. Klick
                        in die Karte setzt einen Marker zum Planen.
                    </p>
                </div>

                <div class="panel list-panel">
                    <div class="panel-head">
                        <div>
                            <p class="panel-title">Spots</p>
                            <p class="panel-meta">
                                Alle Spots als Karten-Liste
                            </p>
                        </div>
                        <a class="ghost-link" href="/spots"
                            >Zur Spot-Übersicht</a
                        >
                    </div>

                    {#if !data?.spots?.length}
                        <div class="empty">
                            <div>
                                <p class="empty-title">Keine Spots vorhanden</p>
                                <p class="empty-text">
                                    Lege Spots an, um sie hier zu sehen.
                                </p>
                            </div>
                            <a href="/spots/new" class="btn-primary ghost-btn"
                                >Spot anlegen</a
                            >
                        </div>
                    {:else}
                        <SpotList
                            spots={data.spots}
                            action=""
                            favoriteAction=""
                            canFavorite={false}
                        />
                    {/if}
                </div>
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
        background: linear-gradient(180deg, #f8f7f3 0%, #f3f6ff 100%);
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
    }

    .start-screen {
        min-height: calc(100vh - 80px);
        display: grid;
        place-items: center;
        background: linear-gradient(
            135deg,
            #f7f4ec 0%,
            #ffffff 45%,
            #f0f5ff 100%
        );
        padding: 2rem 1.5rem;
    }

    .start-card {
        max-width: 620px;
        width: min(620px, 100%);
        background: #ffffff;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 24px 80px rgba(12, 50, 94, 0.12);
        border-radius: 1.4rem;
        padding: 2rem 2.4rem;
        text-align: center;
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
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
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
