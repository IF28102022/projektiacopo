<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    export let data;
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <header class="header">
                <div>
                    <p class="eyebrow">Sammlung</p>
                    <h1>Segel-Spots</h1>
                    <p class="subtitle">
                        Alle gespeicherten Segel-Spots aus deiner Datenbank.
                        Helles Layout, glatte Cards, klare Typo.
                    </p>
                </div>
                <a href="/spots/new" class="btn-primary">+ Neuer Spot</a>
            </header>

            {#if data.spots.length === 0}
                <div class="empty">
                    <p>Noch keine Spots gespeichert.</p>
                    <a href="/spots/new" class="ghost-link">Jetzt ersten Spot anlegen</a>
                </div>
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
        --danger: #c53030;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: radial-gradient(circle at 20% 20%, #f2f2ff 0%, #f7f4ec 50%)
                no-repeat,
            var(--bg);
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

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }

    h1 {
        margin: 0;
        font-size: 2rem;
        letter-spacing: -0.01em;
    }

    .subtitle {
        color: var(--muted);
        font-size: 1rem;
        margin-top: 0.35rem;
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        text-decoration: none;
        padding: 0.6rem 1.3rem;
        border-radius: 999px;
        font-weight: 700;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.24);
        border: 1px solid transparent;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .empty {
        color: var(--muted);
        font-size: 1rem;
        margin-top: 1.4rem;
        background: var(--card);
        border: 1px dashed var(--border);
        border-radius: 1rem;
        padding: 1rem 1.25rem;
        box-shadow: var(--shadow);
        display: inline-flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .ghost-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        gap: 1.4rem;
        margin-top: 1.2rem;
    }

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
        background: var(--danger);
        color: white;
        border: 0;
        padding: 0.5rem 0.95rem;
        border-radius: 0.6rem;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(197, 48, 48, 0.25);
        border: 1px solid rgba(197, 48, 48, 0.35);
    }

    .delete-btn:hover {
        background: #a32020;
        transform: translateY(-1px);
    }
</style>
