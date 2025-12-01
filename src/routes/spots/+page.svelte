<script>
    export let data;
</script>

<main class="page">
    <section class="section">
        <header class="header">
            <div>
                <h1>Segel-Spots</h1>
                <p class="subtitle">
                    Alle gespeicherten Segel-Spots aus deiner Datenbank.
                </p>
            </div>
            <a href="/spots/new" class="btn-primary">+ Neuer Spot</a>
        </header>

        {#if data.spots.length === 0}
            <p class="empty">Noch keine Spots gespeichert.</p>
        {:else}
            <div class="grid">
                {#each data.spots as spot}
                    <article class="card">
                        {#if spot.imageUrl}
                            <img
                                class="card-img"
                                src={spot.imageUrl}
                                alt={spot.name}
                            />
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

                            <p class="coords">
                                📍 {spot.lat}, {spot.lng}
                            </p>

                            <form
                                method="POST"
                                action="?/delete"
                                class="delete-form"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={spot.id}
                                />
                                <button type="submit" class="delete-btn"
                                    >Löschen</button
                                >
                            </form>
                        </div>
                    </article>
                {/each}
            </div>
        {/if}
    </section>
</main>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 2rem 1.5rem;
    }

    .section {
        width: 100%;
        max-width: 1100px;
        background: rgba(15, 23, 42, 0.9);
        border-radius: 1.2rem;
        border: 1px solid rgba(55, 65, 81, 0.8);
        padding: 2rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .subtitle {
        color: #94a3b8;
        font-size: 0.9rem;
        margin-top: 0.4rem;
    }

    .btn-primary {
        background: #0ea5e9;
        color: #0b1120;
        text-decoration: none;
        padding: 0.6rem 1.3rem;
        border-radius: 999px;
        font-weight: 600;
        box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
    }

    .btn-primary:hover {
        background: #38bdf8;
    }

    .empty {
        color: #94a3b8;
        font-size: 0.95rem;
        margin-top: 1rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        gap: 1.4rem;
        margin-top: 1rem;
    }

    .card {
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .card-img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }

    .card-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .region {
        color: #94a3b8;
        font-size: 0.85rem;
        margin: 0;
    }

    .desc {
        color: #e2e8f0;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .coords {
        font-size: 0.85rem;
        color: #94a3b8;
        margin-top: 0.3rem;
    }

    .delete-form {
        margin-top: 0.8rem;
    }

    .delete-btn {
        background: #dc2626;
        color: white;
        border: 0;
        padding: 0.45rem 0.9rem;
        border-radius: 0.6rem;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
    }

    .delete-btn:hover {
        background: #ef4444;
    }
</style>
