<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let name = "";
    let region = "";
    let description = "";
    let lat = null;
    let lng = null;

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
</script>

<main class="page">
    <section class="section">
        <h1>Neuer Spot</h1>
        <p class="subtitle">
            Klicke auf die Karte und gib die Spotdetails ein.
        </p>

        <div class="layout">
            <form method="POST" class="form">
                <label>
                    Name *
                    <input name="name" required bind:value={name} />
                </label>

                <label>
                    Region
                    <input name="region" bind:value={region} />
                </label>

                <label>
                    Beschreibung
                    <textarea
                        name="description"
                        rows="4"
                        bind:value={description}
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
                        <input name="lat" readonly required value={lat ?? ""} />
                    </label>

                    <label>
                        Longitude *
                        <input name="lng" readonly required value={lng ?? ""} />
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
                <div id="select-map"></div>
                <p class="map-hint">
                    Auf die Karte klicken, um die Position zu setzen.
                </p>
            </div>
        </div>
    </section>
</main>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 2rem;
    }

    .section {
        width: 100%;
        max-width: 1100px;
        background: rgba(15, 23, 42, 0.9);
        border-radius: 1.2rem;
        border: 1px solid rgba(55, 65, 81, 0.8);
        padding: 2rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    h1 {
        margin: 0;
        font-size: 1.6rem;
    }

    .subtitle {
        color: #94a3b8;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 2rem;
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

    label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.9rem;
    }

    input,
    textarea {
        background: #020617;
        border: 1px solid #374151;
        border-radius: 0.5rem;
        padding: 0.6rem;
        color: #e5e7eb;
    }

    textarea {
        min-height: 80px;
        resize: vertical;
    }

    .coords {
        display: flex;
        gap: 1rem;
    }

    .coords input {
        color: #9ca3af;
    }

    .btn-primary {
        background: #0ea5e9;
        color: #0b1120;
        padding: 0.7rem 1.3rem;
        border-radius: 999px;
        font-weight: 600;
        border: none;
        box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
    }

    .btn-primary:hover {
        background: #38bdf8;
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }

    .map-wrapper {
        border-radius: 1rem;
        border: 1px solid #374151;
        background: #020617;
        overflow: hidden;
    }

    #select-map {
        width: 100%;
        height: 340px;
    }

    .map-hint {
        font-size: 0.8rem;
        color: #94a3b8;
        padding: 0.5rem 0.8rem;
        border-top: 1px solid #374151;
    }

    .dropzone {
        margin-top: 0.5rem;
        border-radius: 0.75rem;
        border: 1.5px dashed #4b5563;
        padding: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: rgba(15, 23, 42, 0.7);
        position: relative;
        overflow: hidden;
    }

    .dropzone.drop-active {
        border-color: #0ea5e9;
        background: rgba(15, 23, 42, 0.9);
    }

    .file-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }

    .drop-text {
        color: #9ca3af;
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
        color: #e5e7eb;
    }
</style>
