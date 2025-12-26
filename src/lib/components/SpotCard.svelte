<script>
    export let spot;
    export let action = "?/delete";
    export let showDelete = true;

    const imageList = Array.isArray(spot?.imageDataList)
        ? spot.imageDataList.filter(Boolean)
        : [];
    $: coverImage =
        (imageList[0] || spot?.imageData || spot?.imageUrl || "").trim() || null;
    $: hasCoords = spot?.lat !== undefined && spot?.lng !== undefined;
</script>

<article class="card">
    <a class="card-link" href={`/spots/${spot.id}`}>
        <div class="thumb" style={coverImage ? `background-image: url(${coverImage})` : ""}>
            {#if !coverImage}
                <div class="thumb-placeholder">🗺️</div>
            {/if}
        </div>
        <div class="body">
            <div class="title-row">
                <h3>{spot.name}</h3>
                {#if spot.spotType}
                    <span class="pill">{spot.spotType}</span>
                {/if}
            </div>
            <p class="muted region">
                📍 {spot.region || "Unbekannte Region"}{hasCoords ? ` · ${spot.lat}, ${spot.lng}` : ""}
            </p>
            <div class="meta">
                {#if spot.depthMin || spot.depthMax}
                    <span>{spot.depthMin ?? "?"}–{spot.depthMax ?? "?"} m</span>
                {/if}
                {#if spot.holdingQuality}
                    <span>{spot.holdingQuality}</span>
                {/if}
                {#if spot.swellInfo}
                    <span>{spot.swellInfo}</span>
                {/if}
            </div>
        </div>
    </a>

    {#if showDelete}
        <form method="POST" {action} class="delete-form">
            <input type="hidden" name="id" value={spot.id} />
            <button type="submit" class="delete-btn">Löschen</button>
        </form>
    {/if}
</article>

<style>
    .card {
        position: relative;
        border-radius: 0.9rem;
        border: 1px solid #e4e8ee;
        background: #ffffff;
        box-shadow: 0 12px 36px rgba(0, 41, 112, 0.06);
        transition:
            transform 0.14s ease,
            box-shadow 0.14s ease;
        min-height: 140px;
        overflow: hidden;
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 44px rgba(0, 41, 112, 0.1);
    }

    .card-link {
        color: inherit;
        text-decoration: none;
        display: block;
        height: 100%;
        padding: 0.75rem 0.9rem 0.9rem;
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 0.9rem;
    }

    .thumb {
        border-radius: 0.75rem;
        background: linear-gradient(135deg, #f3f6fb, #e9eef7);
        background-size: cover;
        background-position: center;
        min-height: 110px;
        display: grid;
        place-items: center;
        border: 1px solid #e6ebf2;
    }

    .thumb-placeholder {
        font-size: 1.6rem;
        color: #7a8aa0;
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
        letter-spacing: -0.01em;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .region {
        font-size: 0.95rem;
        margin: 0;
    }

    .muted {
        color: #6a7a8f;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        font-size: 0.93rem;
        color: #5b6a7a;
    }

    .meta span {
        background: #f4f7fc;
        border-radius: 999px;
        padding: 0.25rem 0.6rem;
        border: 1px solid #e2e7ef;
    }

    .pill {
        background: #e8f0ff;
        color: #0f1e36;
        border-radius: 999px;
        padding: 0.2rem 0.65rem;
        font-size: 0.85rem;
        border: 1px solid #d7e4ff;
    }

    .delete-form {
        position: absolute;
        right: 0.8rem;
        bottom: 0.8rem;
        margin: 0;
    }

    .delete-btn {
        background: #ffffff;
        color: #c53030;
        border: 0;
        padding: 0.4rem 0.85rem;
        border-radius: 0.55rem;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(197, 48, 48, 0.12);
        border: 1px solid rgba(197, 48, 48, 0.35);
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            background 0.12s ease;
    }

    .delete-btn:hover {
        background: #ffecec;
        transform: translateY(-1px);
    }
</style>
