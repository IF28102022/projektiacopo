<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import SpotList from "$lib/components/SpotList.svelte";

    export let data;

    const total = data.spots.length;
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <div class="toolbar">
                <div>
                    <p class="eyebrow">Spots</p>
                    <h1>Segel-Spots</h1>
                    <p class="subtitle">Alle Spots als schnelle Übersicht.</p>
                </div>
                <div class="toolbar-actions">
                    <span class="badge">{total} gespeichert</span>
                    {#if data.canCreate}
                        <a href="/spots/new" class="btn-primary">+ Neuer Spot</a>
                    {/if}
                </div>
            </div>

            <div class="panel">
                <div class="panel-head">
                    <div>
                        <p class="panel-title">Spots & Karte</p>
                        <p class="panel-meta">Liste und Karten-Link</p>
                    </div>
                    <a class="ghost-link" href="/map">Karte öffnen</a>
                </div>

                {#if data.spots.length === 0}
                    <div class="empty">
                        <div>
                            <p class="empty-title">Noch keine Spots gespeichert</p>
                            <p class="empty-text">Lege den ersten Spot an.</p>
                        </div>
                        {#if data.canCreate}
                            <a href="/spots/new" class="btn-primary ghost-btn">Jetzt starten</a>
                        {/if}
                    </div>
                {:else}
                    <SpotList
                        spots={data.spots}
                        action="?/delete"
                        favoriteAction="?/favorite"
                        canFavorite={data.canFavorite}
                    />
                {/if}
            </div>
        </div>
    </section>
</main>

<Footer />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap");

    :global(:root) {
        --bg: #f6f9fc;
        --card: #ffffff;
        --text: #0f1e36;
        --muted: #5b6a7a;
        --border: #e4e8ee;
        --accent: #0061ff;
        --accent-soft: #e8f0ff;
        --shadow: 0 18px 60px rgba(0, 41, 112, 0.08);
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
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
    }

    .container {
        width: min(1200px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 2.5rem 0 3rem;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.2rem;
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
        font-size: 2.1rem;
        letter-spacing: -0.02em;
    }

    .subtitle {
        color: var(--muted);
        font-size: 1rem;
        margin-top: 0.35rem;
        max-width: 640px;
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
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        white-space: nowrap;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .ghost-btn {
        background: #ffffff;
        color: var(--accent);
        border: 1px solid var(--accent);
        box-shadow: none;
    }

    .ghost-btn:hover {
        background: var(--accent-soft);
    }

    .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
    }

    .badge {
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.45rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid #d7e4ff;
    }

    .panel {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1rem;
        box-shadow: 0 12px 45px rgba(0, 41, 112, 0.08);
        padding: 1.1rem;
    }

    .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.25rem 0 0.75rem;
        border-bottom: 1px solid var(--border);
        margin-bottom: 0.75rem;
    }

    .panel-title {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.01em;
    }

    .panel-meta {
        margin: 0.1rem 0 0;
        color: var(--muted);
        font-size: 0.95rem;
    }

    .ghost-link {
        color: var(--muted);
        text-decoration: none;
        font-weight: 600;
        padding: 0.45rem 0.9rem;
        border-radius: 0.65rem;
        border: 1px solid var(--border);
        background: #f8fafd;
    }

    .ghost-link:hover {
        color: var(--accent);
        border-color: var(--accent);
        background: var(--accent-soft);
    }

    .empty {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1rem 1.25rem;
        background: #f9fbff;
        border: 1px dashed var(--border);
        border-radius: 0.9rem;
    }

    .empty-title {
        margin: 0;
        font-weight: 700;
    }

    .empty-text {
        margin: 0.15rem 0 0;
        color: var(--muted);
    }
</style>
    
