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

        // --- Optional: Umschalten zwischen Layern ---
        L.control
            .layers({ OpenStreetMap: osmLayer }, { OpenSeaMap: seamapLayer })
            .addTo(map);

        // --- Marker bei Klick ---
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

<div id="map"></div>

<style>
    #map {
        width: 100%;
        height: 100vh;
    }
</style>
