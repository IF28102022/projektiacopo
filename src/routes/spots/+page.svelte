<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import SpotList from "$lib/components/SpotList.svelte";

    export let data;

    const total = data.spots.length;
    const visibility = data.visibility || "public";
    const canViewPrivate = data.canViewPrivate;
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
                <div class="intro">
                    <div>
                        <p class="eyebrow">Spots</p>
                        <h2>Alle Orte, eine ruhige Übersicht</h2>
                    <p class="subtitle">
                        Finde deinen nächsten Ankerplatz in Sekunden. Filtern, merken, auf der Karte öffnen.
                    </p>
                </div>
                <div class="toolbar-actions">
                    <div class="visibility-toggle">
                        <a
                            href="/spots?visibility=public"
                            class:selected={visibility === "public"}
                        >
                            Öffentlich
                        </a>
                        {#if canViewPrivate}
                            <a
                                href="/spots?visibility=private"
                                class:selected={visibility === "private"}
                            >
                                Privat
                            </a>
                        {/if}
                    </div>
                    <span class="badge">{total} gespeichert</span>
                    {#if data.canCreate}
                        <a href="/spots/new" class="ghost-link">+ Neuer Spot</a>
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
                            <p class="empty-title">
                                {visibility === "private"
                                    ? "Noch keine privaten Spots"
                                    : "Noch keine Spots gespeichert"}
                            </p>
                            <p class="empty-text">Lege den ersten Spot an.</p>
                        </div>
                        {#if data.canCreate}
                            <a href="/spots/new" class="ghost-link">Jetzt starten</a>
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
        --bg: #f7f4ee;
        --card: #ffffff;
        --text: #111820;
        --muted: #4a5563;
        --border: #e7e4dd;
        --accent: #0f6fb8;
        --accent-soft: #e6f0fa;
        --shadow: 0 18px 60px rgba(12, 40, 70, 0.08);
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
        background: #0f1f1f;
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
        background: url("/Spots.jpeg") center/cover no-repeat fixed;
        color: #f7f6f4;
    }

    .container {
        width: min(1200px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 2.8rem 0 3.6rem;
        background: transparent;
    }

    .intro {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.4rem;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: rgba(255, 255, 255, 0.18);
        color: #f7f6f4;
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.2rem;
    }

    h2 {
        margin: 0;
        font-size: 2.2rem;
        letter-spacing: -0.02em;
        color: #f7f6f4;
        text-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    .subtitle {
        color: rgba(247, 246, 244, 0.82);
        font-size: 1rem;
        margin-top: 0.35rem;
        max-width: 640px;
        text-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
    }

    .ghost-link {
        color: #f7f6f4;
        text-decoration: none;
        font-weight: 600;
        padding: 0.5rem 0.95rem;
        border-radius: 0.65rem;
        border: 1px solid rgba(255, 255, 255, 0.35);
        background: rgba(255, 255, 255, 0.08);
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease,
            opacity 0.12s ease;
    }

    .ghost-link:hover {
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.16);
        opacity: 0.95;
    }

    .badge {
        background: rgba(255, 255, 255, 0.2);
        color: #f7f6f4;
        padding: 0.45rem 0.8rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(6px);
    }

    .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
    }

    .visibility-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .visibility-toggle a {
        text-decoration: none;
        color: rgba(255, 255, 255, 0.82);
        font-weight: 700;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        border: 1px solid transparent;
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .visibility-toggle a:hover {
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.5);
    }

    .visibility-toggle a.selected {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.6);
    }

    .panel {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 1rem;
        box-shadow: 0 18px 50px rgba(12, 40, 70, 0.18);
        padding: 1.1rem;
        color: #111820;
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
        color: #0f172a;
    }

    .panel-meta {
        margin: 0.1rem 0 0;
        color: #5f6b7a;
        font-size: 0.95rem;
    }

    .empty {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1rem 1.25rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px dashed #e2e8f0;
        border-radius: 0.9rem;
    }

    .empty-title {
        margin: 0;
        font-weight: 700;
    }

    .empty-text {
        margin: 0.15rem 0 0;
        color: #5f6b7a;
    }
</style>
    
