<script>
    export let spot;
    export let action = "?/delete";
    export let showDelete = true;

    const imageList = Array.isArray(spot?.imageDataList)
        ? spot.imageDataList.filter(Boolean)
        : [];
    $: coverImage =
        (imageList[0] || spot?.imageData || spot?.imageUrl || "").trim() || null;
</script>

<article class="card">
    <a class="card-link" href={`/spots/${spot.id}`}>
        <div class="thumb" style={coverImage ? `background-image: url(${coverImage})` : ""}>
            {#if !coverImage}
                <div class="thumb-placeholder">🗺️</div>
            {/if}
        </div>
        <div class="footer">
            <h3>{spot.name}</h3>
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
    }

    .thumb {
        border-radius: 0.75rem 0.75rem 0 0;
        background: linear-gradient(135deg, #f3f6fb, #e9eef7);
        background-size: cover;
        background-position: center;
        min-height: 180px;
        display: grid;
        place-items: center;
    }

    .thumb-placeholder {
        font-size: 1.6rem;
        color: #7a8aa0;
    }

    .footer {
        padding: 0.9rem 1rem 1rem;
    }

    h3 {
        margin: 0;
        font-size: 1.05rem;
        letter-spacing: -0.01em;
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
