<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    let name = "";
    let region = "";
    let description = "";
    let lat = null;
    let lng = null;

    let spotType = "Bucht";
    let depthMin = "";
    let depthMax = "";
    let bottomType = "";
    let holdingQuality = "";
    let shelterWindDirections = "";
    let swellInfo = "";
    let facilities = [];
    let season = "";
    let rating = "3";
    let notesSkipper = "";

    let imageData = "";
    let imageName = "";
    let dragActive = false;

    let map;
    let marker;

    const facilitySets = {
        Bucht: ["restaurant", "mooring", "calm", "protected"],
        Ankerplatz: ["restaurant", "mooring", "calm", "protected", "water", "waste"],
        Marina: [
            "water",
            "power",
            "diesel",
            "mooring",
            "restaurant",
            "supermarket",
            "service",
            "waste",
            "wifi",
            "showers",
        ],
    };

    const facilityLabels = {
        restaurant: "Restaurant",
        mooring: "Mooringbojen",
        calm: "Ruhig",
        protected: "Geschützt",
        water: "Wasser",
        waste: "Müllentsorgung",
        power: "Strom",
        diesel: "Diesel",
        supermarket: "Supermarkt",
        service: "Werft/Service",
        wifi: "WLAN",
        showers: "Duschen",
    };

    $: visibleFacilities = facilitySets[spotType] || facilitySets.Bucht;
    $: {
        const filtered = facilities.filter((f) => visibleFacilities.includes(f));
        if (filtered.length !== facilities.length) {
            facilities = filtered;
        }
    }

    onMount(async () => {
        if (!browser) return;

        const L = (await import("leaflet")).default;

        map = L.map("select-map", {
            center: [42, 15],
            zoom: 5,
            minZoom: 3,
            maxZoom: 12,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        map.on("click", (e) => {
            lat = Number(e.latlng.lat.toFixed(6));
            lng = Number(e.latlng.lng.toFixed(6));

            if (marker) marker.remove();

            marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup("Spot gewählt")
                .openPopup();
        });
    });

    function handleFiles(files) {
        const file = files?.[0];
        if (!file) return;

        imageName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function onFileInputChange(event) {
        handleFiles(event.target.files);
    }

    function onDrop(event) {
        event.preventDefault();
        dragActive = false;
        if (event.dataTransfer?.files?.length) {
            handleFiles(event.dataTransfer.files);
        }
    }

    function onDragOver(event) {
        event.preventDefault();
        dragActive = true;
    }

    function onDragLeave(event) {
        event.preventDefault();
        dragActive = false;
    }
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <div class="page-head">
                <div>
                    <p class="eyebrow">Nautischer Spot</p>
                    <h1>Neuer Spot</h1>
                    <p class="subtitle">
                        Erfassung wie bei Navily & Co: Typ wählen, Nautik ausfüllen,
                        Ausstattung nach Logik des Typs.
                    </p>
                </div>
                <a class="ghost-link" href="/spots">Zurück zur Liste</a>
            </div>

            <div class="layout">
                <form method="POST" class="form">
                    <div class="group">
                        <div class="group-head">
                            <h3>Allgemein</h3>
                            <p>Basisdaten für alle Spot-Typen.</p>
                        </div>
                        <div class="field-grid">
                            <label>
                                Name *
                                <input
                                    name="name"
                                    required
                                    bind:value={name}
                                    placeholder="Bucht, Ankerplatz oder Marina"
                                />
                            </label>
                            <label>
                                Spot-Typ *
                                <select name="spotType" bind:value={spotType} required>
                                    <option value="Bucht">Bucht</option>
                                    <option value="Ankerplatz">Ankerplatz</option>
                                    <option value="Marina">Marina</option>
                                </select>
                            </label>
                            <label>
                                Region
                                <input
                                    name="region"
                                    bind:value={region}
                                    placeholder="z. B. Südliche Adria"
                                />
                            </label>
                        </div>
                        <label>
                            Beschreibung
                            <textarea
                                name="description"
                                rows="3"
                                bind:value={description}
                                placeholder="Kurzbeschreibung des Spots"
                            ></textarea>
                        </label>
                    </div>

                    <div class="group">
                        <div class="group-head">
                            <h3>Nautik</h3>
                            <p>Tiefe, Boden, Halten, Schutz & Schwell.</p>
                        </div>
                        <div class="field-grid">
                            <label>
                                Tiefe min (m)
                                <input
                                    type="number"
                                    name="depthMin"
                                    min="0"
                                    step="0.1"
                                    bind:value={depthMin}
                                    placeholder="z. B. 4"
                                />
                            </label>
                            <label>
                                Tiefe max (m)
                                <input
                                    type="number"
                                    name="depthMax"
                                    min="0"
                                    step="0.1"
                                    bind:value={depthMax}
                                    placeholder="z. B. 12"
                                />
                            </label>
                            <label>
                                Boden
                                <select name="bottomType" bind:value={bottomType}>
                                    <option value="">Bitte wählen</option>
                                    <option value="Sand">Sand</option>
                                    <option value="Seegras">Seegras</option>
                                    <option value="Fels">Fels</option>
                                    <option value="Schlamm">Schlamm</option>
                                    <option value="Gemischt">Gemischt</option>
                                </select>
                            </label>
                            <label>
                                Haltequalität
                                <select name="holdingQuality" bind:value={holdingQuality}>
                                    <option value="">Bitte wählen</option>
                                    <option value="gut">gut</option>
                                    <option value="mittel">mittel</option>
                                    <option value="schlecht">schlecht</option>
                                </select>
                            </label>
                            <label>
                                Schutz (Windrichtungen)
                                <input
                                    name="shelterWindDirections"
                                    bind:value={shelterWindDirections}
                                    placeholder="z. B. gut bei N–E, offen bei SW"
                                />
                            </label>
                            <label>
                                Schwell
                                <input
                                    name="swellInfo"
                                    bind:value={swellInfo}
                                    placeholder="ruhig, Schwell bei Südwind ..."
                                />
                            </label>
                        </div>
                    </div>

                    <div class="group">
                        <div class="group-head">
                            <h3>Ausstattung</h3>
                            <p>Optionen je nach Spot-Typ (automatisch gefiltert).</p>
                        </div>
                        <div class="facility-grid">
                            {#each visibleFacilities as facility}
                                <label class="chip">
                                    <input
                                        type="checkbox"
                                        name="facilities"
                                        value={facility}
                                        bind:group={facilities}
                                    />
                                    <span>{facilityLabels[facility] || facility}</span>
                                </label>
                            {/each}
                        </div>
                    </div>

                    <div class="group">
                        <div class="group-head">
                            <h3>Saison & Rating</h3>
                            <p>Beste Reisezeit und deine Bewertung.</p>
                        </div>
                        <div class="field-grid">
                            <label>
                                Saison
                                <input
                                    name="season"
                                    bind:value={season}
                                    placeholder="z. B. Juni–September"
                                />
                            </label>
                            <label class="rating">
                                Bewertung
                                <div class="rating-row">
                                    <input
                                        type="range"
                                        name="rating"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        bind:value={rating}
                                    />
                                    <span>{rating}/5</span>
                                </div>
                            </label>
                        </div>
                        <label>
                            Notizen für Skipper
                            <textarea
                                name="notesSkipper"
                                rows="3"
                                bind:value={notesSkipper}
                                placeholder="Ansteuerung, Besonderheiten, Funk, Gebühren ..."
                            ></textarea>
                        </label>
                    </div>

                    <div class="group">
                        <div class="group-head">
                            <h3>Bild</h3>
                            <p>Optionales Foto (Drag & Drop).</p>
                        </div>
                        <input type="hidden" name="imageData" value={imageData} />
                        <div
                            class="dropzone {dragActive ? 'drop-active' : ''}"
                            on:dragover={onDragOver}
                            on:dragenter={onDragOver}
                            on:dragleave={onDragLeave}
                            on:drop={onDrop}
                            role="button"
                            tabindex="0"
                            aria-label="Bild hochladen durch Ziehen oder Klicken"
                        >
                            <input
                                class="file-input"
                                type="file"
                                accept="image/*"
                                on:change={onFileInputChange}
                            />

                            {#if imageData}
                                <div class="preview">
                                    <img src={imageData} alt="Preview" />
                                    <p class="file-name">{imageName}</p>
                                </div>
                            {:else}
                                <p class="drop-text">
                                    Bild hierher ziehen oder klicken, um ein Bild auszuwählen.
                                </p>
                            {/if}
                        </div>
                    </div>

                    <div class="group coords">
                        <label>
                            Latitude *
                            <input
                                name="lat"
                                readonly
                                required
                                value={lat ?? ""}
                                placeholder="Karte klicken"
                            />
                        </label>

                        <label>
                            Longitude *
                            <input
                                name="lng"
                                readonly
                                required
                                value={lng ?? ""}
                                placeholder="Karte klicken"
                            />
                        </label>
                    </div>

                    <button class="btn-primary" type="submit" disabled={lat === null}>
                        Spot speichern
                    </button>
                </form>

                <div class="map-wrapper">
                    <div class="map-head">
                        <div>
                            <p class="eyebrow small">Karte</p>
                            <h3>Position setzen</h3>
                            <p class="hint">Karte klicken, Marker wird platziert.</p>
                        </div>
                    </div>
                    <div id="select-map"></div>
                </div>
            </div>
        </div>
    </section>
</main>

<Footer />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap");

    :global(:root) {
        --bg: #f6f8fb;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #5f6b7a;
        --border: #e5e7eb;
        --accent: #1e3a8a;
        --accent-2: #3b82f6;
        --accent-soft: #e8f0ff;
        --shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
    }

    .container {
        width: min(1200px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem 2.5rem;
    }

    .section {
        padding: 2.5rem 0 3rem;
    }

    .page-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
    }

    h1 {
        margin: 0.2rem 0;
        font-size: 2.1rem;
        letter-spacing: -0.01em;
    }

    .subtitle {
        margin: 0.2rem 0 0;
        color: var(--muted);
        max-width: 640px;
    }

    .layout {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 1.5rem;
        align-items: start;
    }

    @media (max-width: 1024px) {
        .layout {
            grid-template-columns: 1fr;
        }
    }

    .form {
        background: var(--card);
        border-radius: 1rem;
        padding: 1.25rem 1.35rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid rgba(17, 24, 39, 0.06);
    }

    .group:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }

    .group-head h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--accent);
    }

    .group-head p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        font-size: 0.95rem;
    }

    .field-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 0.9rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-size: 0.92rem;
        color: var(--muted);
    }

    input,
    textarea,
    select {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 0.65rem 0.75rem;
        color: var(--text);
        font-size: 1rem;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    input:focus,
    textarea:focus,
    select:focus {
        outline: none;
        border-color: var(--accent-2);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    textarea {
        min-height: 80px;
        resize: vertical;
    }

    select {
        background: linear-gradient(180deg, #fff 0%, #f8fbff 100%);
    }

    .facility-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 0.5rem;
    }

    .chip {
        background: #f8fbff;
        border: 1px solid var(--border);
        border-radius: 0.9rem;
        padding: 0.55rem 0.7rem;
        display: flex;
        gap: 0.45rem;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text);
    }

    .chip input {
        margin: 0;
    }

    .rating-row {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-top: 0.2rem;
    }

    input[type="range"] {
        width: 100%;
        appearance: none;
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(90deg, #d9e3f8 0%, #3b82f6 100%);
        outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        cursor: pointer;
        margin-top: -6px;
    }

    input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        cursor: pointer;
    }

    input[type="range"]::-moz-range-track {
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(90deg, #d9e3f8 0%, #3b82f6 100%);
    }

    .coords {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.9rem;
        border: none;
        padding-bottom: 0;
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        padding: 0.75rem 1.25rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid transparent;
        box-shadow: 0 14px 45px rgba(30, 58, 138, 0.22);
        cursor: pointer;
        align-self: flex-start;
    }

    .btn-primary:hover {
        background: #152a63;
        transform: translateY(-1px);
    }

    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
    }

    .map-wrapper {
        background: var(--card);
        border-radius: 1rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 640px;
    }

    #select-map {
        width: 100%;
        height: 100%;
        min-height: 520px;
    }

    .map-head {
        padding: 1rem 1.1rem 0.5rem;
        border-bottom: 1px solid var(--border);
        background: linear-gradient(180deg, #fff 0%, #f5f8ff 100%);
    }

    .hint {
        margin: 0.15rem 0 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
    }

    .eyebrow.small {
        font-size: 0.78rem;
    }

    .ghost-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
        padding: 0.55rem 0.95rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: #fff;
    }

    .ghost-link:hover {
        border-color: var(--accent-2);
        color: var(--accent-2);
    }

    .dropzone {
        border-radius: 0.9rem;
        border: 1.5px dashed var(--border);
        padding: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #f8fbff;
        position: relative;
        overflow: hidden;
        transition: border-color 0.12s ease, background 0.12s ease;
    }

    .dropzone.drop-active {
        border-color: var(--accent-2);
        background: #e8f0ff;
    }

    .file-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }

    .drop-text {
        color: var(--muted);
        font-size: 0.9rem;
    }

    .preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
    }

    .preview img {
        max-width: 100%;
        max-height: 200px;
        border-radius: 0.6rem;
        object-fit: cover;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
    }

    .file-name {
        font-size: 0.85rem;
        color: var(--muted);
    }
</style>
