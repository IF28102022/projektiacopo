<script>
    export let spot;
    export let action = "?/delete";
    export let showDelete = true;
</script>

<article class="card">
    {#if spot.imageUrl}
        <img class="card-img" src={spot.imageUrl} alt={spot.name} />
    {/if}

    <div class="card-body">
        <div class="top">
            <h3>{spot.name}</h3>
            {#if spot.region}
                <p class="region">{spot.region}</p>
            {/if}
        </div>

        {#if spot.description}
            <p class="desc">{spot.description}</p>
        {/if}

        <p class="coords">📍 {spot.lat}, {spot.lng}</p>

        {#if showDelete}
            <form method="POST" action={action} class="delete-form">
                <input type="hidden" name="id" value={spot.id} />
                <button type="submit" class="delete-btn">Löschen</button>
            </form>
        {/if}
    </div>
</article>

<style>
    .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow);
        transition: transform 0.12s ease, box-shadow 0.12s ease;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 70px rgba(15, 81, 146, 0.12);
    }

    .card-img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
    }

    .card-body {
        padding: 1.1rem 1.2rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.75rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .region {
        color: var(--muted);
        font-size: 0.9rem;
        margin: 0;
    }

    .desc {
        color: var(--text);
        font-size: 0.95rem;
        line-height: 1.5;
    }

    .coords {
        font-size: 0.85rem;
        color: var(--muted);
        margin-top: 0.3rem;
    }

    .delete-form {
        margin-top: 0.8rem;
    }

    .delete-btn {
        background: #c53030;
        color: white;
        border: 0;
        padding: 0.5rem 0.95rem;
        border-radius: 0.6rem;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(197, 48, 48, 0.25);
        border: 1px solid rgba(197, 48, 48, 0.35);
        transition: transform 0.12s ease, box-shadow 0.12s ease,
            background 0.12s ease;
    }

    .delete-btn:hover {
        background: #a32020;
        transform: translateY(-1px);
    }
</style>
