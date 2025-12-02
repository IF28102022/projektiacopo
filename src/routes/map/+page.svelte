<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

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
<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <header class="header">
                <div>
                    <p class="eyebrow">Spot setzen</p>
                    <h1>Karte & Spots</h1>
                    <p class="subtitle">
                        Klicke auf die Karte, um einen eigenen Spot zu setzen.
                        Dezente Farben, klare Typografie, optimale Sicht auf die
                        Küstenlinie.
                    </p>
                </div>
                <div class="cta">
                    <a class="ghost-link" href="/spots">Zur Liste</a>
                    <a class="btn-primary" href="/spots/new">Neuer Spot</a>
                </div>
            </header>

            <div class="panel">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot accent"></span>
                        <p class="panel-title">Aktive Karte</p>
                    </div>
                    <p class="panel-meta">OpenStreetMap + OpenSeaMap Layer</p>
                </div>

                <div class="map-wrapper">
                    <div id="map"></div>
                </div>
            </div>
        </div>
    </section>
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

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: radial-gradient(circle at 20% 20%, #f2f2ff 0%, #f7f4ec 50%)
                no-repeat,
            var(--bg);
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    /* PAGE */
    .page {
        min-height: 100vh;
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    /* SECTION */
    .section {
        padding: 2.8rem 0 3.2rem;
    }

    .section h1 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        font-size: 2rem;
        letter-spacing: -0.01em;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
    }

    .subtitle {
        margin-bottom: 0;
        color: var(--muted);
        font-size: 1rem;
        max-width: 720px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        gap: 1.5rem;
        flex-wrap: wrap;
        align-items: flex-end;
        margin-bottom: 1.5rem;
    }

    .cta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .ghost-link {
        color: var(--muted);
        text-decoration: none;
        font-weight: 600;
        padding: 0.55rem 0.9rem;
        border-radius: 999px;
        border: 1px solid var(--border);
    }

    .ghost-link:hover {
        color: var(--accent);
        border-color: var(--accent);
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        text-decoration: none;
        padding: 0.6rem 1.2rem;
        border-radius: 999px;
        font-weight: 700;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.24);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .panel {
        background: var(--card);
        border-radius: 1.2rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        overflow: hidden;
    }

    .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.1rem 1.25rem;
        border-bottom: 1px solid var(--border);
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

    .panel-title {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.01em;
    }

    .panel-meta {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .map-wrapper {
        border-radius: 1rem;
        overflow: hidden;
        height: 70vh;
    }

    #map {
        width: 100%;
        height: 100%;
    }

    :global(.leaflet-control-attribution) {
        font-size: 10px !important;
    }
</style>
