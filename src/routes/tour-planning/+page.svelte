<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    function startPlanning() {
        // Platzhalter: hier können später die nächsten Schritte eingehängt werden
    }
</script>

<Header />

<main class="page">
    <section class="start-screen">
        <div class="start-card">
            <p class="start-eyebrow">Tourplanung</p>
            <h1>Starte deinen Törn-Plan.</h1>
            <p class="start-subtitle">
                Button klicken – den Rest definieren wir gleich.
            </p>
            <button class="start-btn" type="button" on:click={startPlanning}>
                Tour planen
            </button>
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
    }

    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: linear-gradient(180deg, #f8f7f3 0%, #f3f6ff 100%);
        color: var(--text);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .start-screen {
        min-height: calc(100vh - 80px);
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #f7f4ec 0%, #ffffff 45%, #f0f5ff 100%);
        padding: 2rem 1.5rem;
    }

    .start-card {
        max-width: 620px;
        width: min(620px, 100%);
        background: #ffffff;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 24px 80px rgba(12, 50, 94, 0.12);
        border-radius: 1.4rem;
        padding: 2rem 2.4rem;
        text-align: center;
    }

    .start-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.4rem 0.85rem;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .start-card h1 {
        margin: 0.75rem 0 0.35rem;
        font-family: "Playfair Display", "Manrope", serif;
        font-size: clamp(2rem, 4.2vw, 2.8rem);
        letter-spacing: -0.01em;
    }

    .start-subtitle {
        margin: 0 0 1.3rem;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.6;
    }

    .start-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1.8rem;
        border-radius: 999px;
        background: var(--accent);
        color: #f8fbff;
        border: 1px solid transparent;
        font-weight: 800;
        letter-spacing: 0.01em;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 18px 50px rgba(15, 111, 184, 0.26);
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            background 0.15s ease;
    }

    .start-btn:hover {
        background: #0c5c99;
        transform: translateY(-1px);
        box-shadow: 0 20px 60px rgba(12, 92, 153, 0.28);
    }

    .start-btn:active {
        transform: translateY(0);
    }

</style>
