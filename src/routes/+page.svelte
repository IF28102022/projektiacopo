<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let map;
    let currentMarker = null; // letzter gesetzter Marker

    onMount(async () => {
        if (!browser) return;

        const L = (await import("leaflet")).default;

        map = L.map("map", {
            center: [48, 8],
            zoom: 5
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        // 👉 Klick-Handler: immer nur EIN Marker
        map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            // alten Marker entfernen, falls vorhanden
            if (currentMarker) {
                currentMarker.remove(); // oder: map.removeLayer(currentMarker);
            }

            // neuen Marker setzen und merken
            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`Spot gesetzt<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
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