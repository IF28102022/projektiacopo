<script>
    export let spot;
    export let action = "?/delete";
    export let favoriteAction = "?/favorite";
    export let canFavorite = false;
    export let showDelete = true;

    const imageList = Array.isArray(spot?.imageDataList)
        ? spot.imageDataList.filter(Boolean)
        : [];
    $: coverImage =
        (imageList[0] || spot?.imageData || spot?.imageUrl || "").trim() || null;
</script>

<article class="card">
    {#if canFavorite}
        <form method="POST" action={favoriteAction} class="favorite-form">
            <input type="hidden" name="id" value={spot.id} />
            <button
                type="submit"
                class:favorited={spot.isFavorite}
                aria-pressed={spot.isFavorite}
                aria-label={spot.isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}
                title={spot.isFavorite ? "Favorit entfernen" : "Als Favorit markieren"}
            >
                {spot.isFavorite ? "★" : "☆"}
            </button>
        </form>
    {/if}

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

    .favorite-form {
        position: absolute;
        top: 0.65rem;
        right: 0.65rem;
        z-index: 2;
        margin: 0;
    }

    .favorite-form button {
        background: #ffffff;
        border: 1px solid #d7e4ff;
        color: #7a8aa0;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        font-size: 1.1rem;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(0, 41, 112, 0.1);
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            color 0.12s ease,
            background 0.12s ease;
    }

    .favorite-form button:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 32px rgba(0, 41, 112, 0.14);
        color: #0f6fb8;
        background: #f2f7ff;
    }

    .favorite-form button.favorited {
        color: #f59e0b;
        border-color: #fde9c3;
        background: #fffaf0;
        box-shadow: 0 12px 30px rgba(245, 158, 11, 0.2);
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
