<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let map;
    let currentMarker = null;

    onMount(async () => {
        if (!browser) return;

        const L = (await import("leaflet")).default;

        map = L.map("map", {
            center: [48, 8],
            zoom: 5,
        });

        // --- OpenStreetMap Basis-Karte ---
        const osmLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "© OpenStreetMap contributors",
            },
        ).addTo(map);

        // --- OpenSeaMap Overlay ---
        const seamapLayer = L.tileLayer(
            "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
            {
                attribution: "© OpenSeaMap contributors",
            },
        ).addTo(map);

        // Click → Marker
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
    });
</script>

<!-- Page Layout -->
<main class="page">
    <section class="section">
        <h1>Karte & Spots</h1>
        <p class="subtitle">
            Klicke auf die Karte, um einen eigenen Spot zu setzen.
        </p>

        <div class="map-wrapper">
            <div id="map"></div>
        </div>
    </section>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: system-ui, sans-serif;
        background: #020617;
        color: #e5e7eb;
    }

    /* PAGE */
    .page {
        min-height: 100vh;
    }

    /* HEADER */
    .topbar {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(15, 23, 42, 0.96);
        border-bottom: 1px solid rgba(55, 65, 81, 0.7);
        backdrop-filter: blur(10px);
    }

    .topbar-inner {
        max-width: 1040px;
        margin: 0 auto;
        padding: 0.75rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size: 0.95rem;
    }

    .nav {
        display: flex;
        gap: 0.75rem;
    }

    .nav-link {
        font-size: 0.9rem;
        color: #9ca3af;
        text-decoration: none;
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        border: 1px solid transparent;
    }

    .nav-link:hover {
        color: #e5e7eb;
        border-color: rgba(148, 163, 184, 0.4);
        background: rgba(15, 23, 42, 0.7);
    }

    .nav-link-active {
        color: #e5e7eb;
        border-color: #0ea5e9;
        background: rgba(15, 23, 42, 0.9);
    }

    /* SECTION */
    .section {
        max-width: 1040px;
        margin: 2rem auto;
        padding: 1rem 1.5rem 2rem;
        background: rgba(15, 23, 42, 0.85);
        border-radius: 1rem;
        border: 1px solid rgba(55, 65, 81, 0.8);
    }

    .section h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 1.6rem;
    }

    .subtitle {
        margin-bottom: 1.25rem;
        color: #9ca3af;
        font-size: 0.9rem;
    }

    /* MAP */
    .map-wrapper {
        border-radius: 1rem;
        overflow: hidden;
        height: 70vh;
        border: 1px solid rgba(55, 65, 81, 0.5);
    }

    #map {
        width: 100%;
        height: 100%;
    }
    :global(.leaflet-control-attribution) {
        font-size: 10px !important;
    }
</style>
