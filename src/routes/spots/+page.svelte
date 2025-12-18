<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import SpotList from "$lib/components/SpotList.svelte";

    export let data;
    $: isOwner = data?.user?.role === "owner";
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
                {#if data.user}
                    <a href="/spots/new" class="btn-primary">+ Neuer Spot</a>
                {/if}
            </header>

            {#if data.spots.length === 0}
                <div class="empty">
                    <p>Noch keine Spots gespeichert.</p>
                    <a href="/spots/new" class="ghost-link">Jetzt ersten Spot anlegen</a>
                </div>
            {:else}
                <SpotList spots={data.spots} action="?/delete" showDelete={isOwner} />
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
        background: linear-gradient(180deg, #f8f7f3 0%, #f3f6ff 100%);
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

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.75rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
        border: 1px solid var(--border);
    }

    .badge.muted {
        background: #f8f8fb;
        color: var(--muted);
    }

</style>
    
