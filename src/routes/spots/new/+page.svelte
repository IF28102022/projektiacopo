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

    let spotType = "";
    let depthMin = "";
    let depthMax = "";
    let bottomType = "";
    let holdingQuality = "";
    let shelterWindDirections = "";
    let swellInfo = "";
    let facilities = [];
    let season = "";
    let rating = "";
    let notesSkipper = "";

    let imageData = ""; // Base64 vom Bild
    let imageName = "";
    let dragActive = false;

    let map;
    let marker;

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
            imageData = e.target.result; // Data-URL
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

    const facilityOptions = [
        { label: "Wasser", value: "water" },
        { label: "Diesel", value: "diesel" },
        { label: "Mooringbojen", value: "mooring" },
        { label: "Strom", value: "power" },
        { label: "Restaurant", value: "restaurant" },
        { label: "Supermarkt", value: "supermarket" },
        { label: "Werft/Service", value: "service" },
        { label: "Müllentsorgung", value: "waste" },
    ];
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <h1>Neuer Spot</h1>
            <p class="subtitle">
                Klicke auf die Karte und gib die Spotdetails ein. Hell, klar,
                modern.
            </p>

            <div class="layout">
                <form method="POST" class="form">
                    <div class="field-grid">
                        <label>
                            Name *
                            <input
                                name="name"
                                required
                                bind:value={name}
                                placeholder="Ankerplatz oder Marina"
                            />
                        </label>

                        <label>
                            Spot-Typ
                            <select name="spotType" bind:value={spotType}>
                                <option value="">Bitte wählen</option>
                                <option value="Ankerplatz">Ankerplatz</option>
                                <option value="Marina">Marina</option>
                                <option value="Bucht">Bucht</option>
                                <option value="Mooringfeld">Mooringfeld</option>
                                <option value="Hafen">Hafen</option>
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
                            <select
                                name="holdingQuality"
                                bind:value={holdingQuality}
                            >
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

                    <label>
                        Beschreibung
                        <textarea
                            name="description"
                            rows="3"
                            bind:value={description}
                            placeholder="Besonderheiten, Windschutz, Restaurants ..."
                        ></textarea>
                    </label>

                    <div class="field-grid facilities">
                        <p class="label">Ausstattung</p>
                        <div class="facility-grid">
                            {#each facilityOptions as option}
                                <label class="chip">
                                    <input
                                        type="checkbox"
                                        name="facilities"
                                        value={option.value}
                                        bind:group={facilities}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            {/each}
                        </div>
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
                                <span>{rating || "0"}/5</span>
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

                    <!-- Hidden Feld für das Base64-Bild -->
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
                                Bild hierher ziehen oder klicken, um ein Bild
                                auszuwählen.
                            </p>
                        {/if}
                    </div>

                    <div class="coords">
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

                    <button
                        class="btn-primary"
                        type="submit"
                        disabled={lat === null}
                    >
                        Spot speichern
                    </button>
                </form>

                <div class="map-wrapper">
                    <div class="map-head">
                        <div class="row">
                            <span class="dot accent"></span>
                            <p>Position setzen</p>
                        </div>
                        <p class="hint">Karte klicken, Marker wird platziert</p>
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
        background: linear-gradient(180deg, #f8f7f3 0%, #f3f6ff 100%);
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 2.8rem 0 3.2rem;
    }

    h1 {
        margin: 0;
        font-size: 2rem;
        letter-spacing: -0.01em;
    }

    .subtitle {
        color: var(--muted);
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 2rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.2rem;
        box-shadow: var(--shadow);
        padding: 1.5rem;
    }

    @media (max-width: 900px) {
        .layout {
            grid-template-columns: 1fr;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .field-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-bottom: 0.2rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.9rem;
        color: var(--muted);
    }

    input,
    textarea {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        padding: 0.6rem;
        color: var(--text);
        font-size: 1rem;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    select {
        background: #f9fbff;
        border-radius: 0.5rem;
        padding: 0.65rem;
    }

    textarea {
        min-height: 80px;
        resize: vertical;
    }

    .facilities {
        align-items: start;
    }

    .facility-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 0.5rem;
    }

    .chip {
        background: #f9fbff;
        border: 1px solid var(--border);
        border-radius: 0.8rem;
        padding: 0.55rem 0.7rem;
        display: flex;
        gap: 0.4rem;
        align-items: center;
        font-size: 0.9rem;
    }

    .chip input {
        margin: 0;
    }

    .label {
        font-weight: 700;
        color: var(--text);
        margin: 0;
    }

    .rating-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-top: 0.35rem;
    }

    input[type="range"] {
        width: 100%;
    }

    .coords {
        display: flex;
        gap: 1rem;
    }

    .coords input {
        color: var(--muted);
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        padding: 0.7rem 1.3rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid transparent;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.24);
        cursor: pointer;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }

    .map-wrapper {
        border-radius: 1rem;
        border: 1px solid var(--border);
        background: #fff;
        overflow: hidden;
        box-shadow: var(--shadow);
    }

    #select-map {
        width: 100%;
        height: 340px;
    }

    .map-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid var(--border);
        background: #fafbfd;
        color: var(--text);
    }

    .row {
        display: flex;
        gap: 0.6rem;
        align-items: center;
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

    .hint {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
    }

    .dropzone {
        margin-top: 0.5rem;
        border-radius: 0.75rem;
        border: 1.5px dashed var(--border);
        padding: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #fafbfd;
        position: relative;
        overflow: hidden;
        transition: border-color 0.12s ease, background 0.12s ease;
    }

    .dropzone.drop-active {
        border-color: var(--accent);
        background: #eef4fb;
    }

    .file-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }

    .drop-text {
        color: var(--muted);
        font-size: 0.85rem;
    }

    .preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
    }

    .preview img {
        max-width: 100%;
        max-height: 180px;
        border-radius: 0.5rem;
        object-fit: cover;
    }

    .file-name {
        font-size: 0.8rem;
        color: var(--muted);
    }
</style>
