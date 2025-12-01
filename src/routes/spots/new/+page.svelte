<form method="POST" class="form">
    <label>
        Name *
        <input name="name" required />
    </label>

    <label>
        Region
        <input name="region" />
    </label>

    <label>
        Bild-URL
        <input name="imageUrl" />
    </label>

    <label>
        Beschreibung
        <textarea name="description" rows="4"></textarea>
    </label>

    <label>
        Latitude *
        <input type="number" step="any" name="lat" required />
    </label>

    <label>
        Longitude *
        <input type="number" step="any" name="lng" required />
    </label>

    <button type="submit">Spot speichern</button>
</form>
