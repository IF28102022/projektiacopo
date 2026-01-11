<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    export let data;

    const spot = data.spot;
    const facilityLabels = {
        water: "Water",
        diesel: "Diesel",
        mooring: "Mooring buoys",
        power: "Power",
        restaurant: "Restaurant",
        supermarket: "Supermarket",
        service: "Yard/Service",
        waste: "Waste disposal",
        wifi: "Wi‑Fi",
        showers: "Showers",
        calm: "Calm",
        protected: "Sheltered",
    };
    const spotTypeLabels = {
        Bucht: "Cove",
        Ankerplatz: "Anchorage",
        Marina: "Marina",
        Mooringfeld: "Mooring field",
        Hafen: "Harbor",
    };
    const bottomTypeLabels = {
        Sand: "Sand",
        Seegras: "Seagrass",
        Fels: "Rock",
        Schlamm: "Mud",
        Gemischt: "Mixed",
    };
    const holdingLabels = {
        gut: "good",
        mittel: "fair",
        schlecht: "poor",
    };
    const images = (spot.imageDataList && spot.imageDataList.length
        ? spot.imageDataList
        : spot.imageData
          ? [spot.imageData]
          : []
    ).filter(Boolean);
    let activeImageIndex = 0;
    $: activeImage = images[activeImageIndex] || spot.imageUrl || spot.imageData || null;
    $: facilities = (spot.facilities || []).map((f) => facilityLabels[f] || f);

    function prevImage() {
        if (!images.length) return;
        activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
    }

    function nextImage() {
        if (!images.length) return;
        activeImageIndex = (activeImageIndex + 1) % images.length;
    }
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <a class="back" href="/spots">← Back to list</a>

            <div class="hero">
                <div class="hero-text">
                    <p class="eyebrow">{spot.region || "Unknown region"}</p>
                    <h1>{spot.name}</h1>
                    {#if spot.description}
                        <p class="subtitle">{spot.description}</p>
                    {/if}
                    <div class="meta">
                        <span class="pill">📍 {spot.lat}, {spot.lng}</span>
                        <span class="pill pill-muted">
                            {spot.createdAt
                                ? new Date(spot.createdAt).toLocaleDateString()
                                : "no date"}
                        </span>
                        {#if spot.rating !== null && spot.rating !== undefined}
                            <span class="pill rating-pill">★ {spot.rating}/5</span>
                        {/if}
                        {#if spot.spotType}
                            <span class="pill pill-soft">
                                {spotTypeLabels[spot.spotType] || spot.spotType}
                            </span>
                        {/if}
                        {#if spot.visibility}
                            <span class="pill pill-visibility">
                                {spot.visibility === "private" ? "Private" : "Public"}
                            </span>
                        {/if}
                        {#if spot.season}
                            <span class="pill pill-soft">Season: {spot.season}</span>
                        {/if}
                    </div>
                </div>

                {#if activeImage}
                    <div class="image">
                        {#if images.length > 1}
                            <div class="slide-frame">
                                <img src={activeImage} alt={spot.name} />
                                <button
                                    class="nav prev"
                                    type="button"
                                    on:click={prevImage}
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button
                                    class="nav next"
                                    type="button"
                                    on:click={nextImage}
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            </div>
                            <div class="dots">
                                {#each images as img, idx}
                                    <button
                                        class:selected={idx === activeImageIndex}
                                        type="button"
                                        aria-label={`Show image ${idx + 1}`}
                                        on:click={() => (activeImageIndex = idx)}
                                    ></button>
                                {/each}
                            </div>
                        {:else}
                            <img src={activeImage} alt={spot.name} />
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </section>

    <section class="section cards">
        <div class="container grid">
            <div class="card">
                <p class="label">Coordinates</p>
                <p class="value">{spot.lat}, {spot.lng}</p>
            </div>
            <div class="card">
                <p class="label">Region</p>
                <p class="value">{spot.region || "—"}</p>
            </div>
            <div class="card">
                <p class="label">Description</p>
                <p class="muted">
                    {spot.description || "No description yet."}
                </p>
            </div>

            <div class="card">
                <p class="label">Skipper notes</p>
                <p class="muted">
                    {spot.notesSkipper || "No special notes."}
                </p>
            </div>
            <div class="card">
                <p class="label">Depth & bottom</p>
                <p class="value">
                    {spot.depthMin ?? "?"}–{spot.depthMax ?? "?"} m
                </p>
                <p class="muted">
                    {spot.bottomType
                        ? `Bottom: ${bottomTypeLabels[spot.bottomType] || spot.bottomType}`
                        : "No bottom type provided."}
                </p>
            </div>
            <div class="card">
                <p class="label">Holding & shelter</p>
                <p class="value">
                    {holdingLabels[spot.holdingQuality] || spot.holdingQuality || "—"}
                </p>
                <p class="muted">
                    {spot.shelterWindDirections
                        ? `Shelter: ${spot.shelterWindDirections}`
                        : "No shelter information."}
                </p>
            </div>

            <div class="card span2">
                <p class="label">Swell</p>
                <p class="value">
                    {spot.swellInfo || "—"}
                </p>
            </div>
            <div class="card span2">
                <p class="label">Facilities</p>
                {#if facilities.length}
                    <div class="chip-row">
                        {#each facilities as facility}
                            <span class="chip">{facility}</span>
                        {/each}
                    </div>
                {:else}
                    <p class="muted">No facilities listed.</p>
                {/if}
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
        background: #0f1f1f;
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
        background: url("/Spots.jpeg") center/cover no-repeat fixed;
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 2.8rem 0 3.2rem;
        background: transparent;
    }

    .back {
        color: #f7f6f4;
        text-decoration: none;
        font-weight: 700;
        display: inline-flex;
        margin-bottom: 1rem;
        text-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
    }

    .hero {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 1.2rem;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        padding: 1.6rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1.5rem;
        align-items: center;
    }

    .hero-text h1 {
        margin: 0.2rem 0 0.5rem;
        font-family: "Playfair Display", "Manrope", serif;
        font-size: clamp(2rem, 4vw, 2.6rem);
        letter-spacing: -0.01em;
    }

    .subtitle {
        margin: 0;
        color: var(--muted);
        font-size: 1rem;
        line-height: 1.5;
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

    .meta {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    .pill {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.75rem;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
        font-size: 0.85rem;
    }

    .pill-muted {
        background: #f2f2f2;
        color: var(--muted);
    }

    .pill-soft {
        background: #eef4ff;
        color: #0f6fb8;
    }

    .pill-visibility {
        background: #e8f3ff;
        color: #0f6fb8;
    }

    .rating-pill {
        background: #fff4d6;
        color: #b45309;
    }

    .image {
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: var(--shadow);
    }

    .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .slide-frame {
        position: relative;
        overflow: hidden;
    }

    .slide-frame img {
        display: block;
        width: 100%;
        max-height: 340px;
        object-fit: cover;
    }

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid #dbe6ff;
        color: #0f6fb8;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    }

    .nav.prev {
        left: 12px;
    }

    .nav.next {
        right: 12px;
    }

    .dots {
        display: flex;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.6rem 0 0;
    }

    .dots button {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        border: none;
        background: #d6deed;
        cursor: pointer;
        padding: 0;
    }

    .dots button.selected {
        background: #0f6fb8;
        transform: scale(1.05);
    }

    .cards {
        background: transparent;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
    }

    .card {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 1rem;
        padding: 1rem 1.2rem;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
    }

    .card.span2 {
        grid-column: span 2;
    }

    .label {
        margin: 0;
        color: var(--muted);
        font-size: 0.85rem;
        letter-spacing: 0.02em;
    }

    .value {
        margin: 0.1rem 0 0.2rem;
        font-weight: 800;
        font-size: 1.1rem;
    }

    .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.3rem 0 0;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        background: #eef4ff;
        color: #0f6fb8;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .muted {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
    }
</style>
