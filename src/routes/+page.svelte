<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
</script>

<Header />

<main class="page">
    <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-grid">
            <div class="hero-copy">
                <p class="eyebrow">Segelspots</p>
                <h1>Spots speichern. Karte öffnen. Fertig.</h1>
                <p class="hero-subtitle">Spots anlegen, Liste prüfen, Karte nutzen.</p>

                <div class="hero-actions">
                    <a href="/map" class="btn btn-primary">Karte öffnen</a>
                    <a href="/spots" class="btn btn-ghost">Spots ansehen</a>
                </div>
            </div>
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
        display: flex;
        flex-direction: column;
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .hero {
        position: relative;
        overflow: hidden;
        padding: 4rem 0 3rem;
    }

    .hero-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 80% 20%,
                rgba(15, 111, 184, 0.16),
                transparent 35%
            ),
            radial-gradient(
                circle at 12% 18%,
                rgba(255, 255, 255, 0.9),
                transparent 45%
            ),
            linear-gradient(135deg, #f7f4ec 0%, #ffffff 45%, #f0f5ff 100%);
        z-index: 0;
    }

    .hero-grid {
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        gap: 1.4rem;
        align-items: flex-start;
    }

    .hero-copy {
        max-width: 640px;
    }

    h1 {
        font-family: "Playfair Display", "Manrope", serif;
        font-size: clamp(2.4rem, 4vw, 3.3rem);
        margin: 0 0 0.9rem;
        letter-spacing: -0.01em;
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .hero-subtitle {
        font-size: 1rem;
        color: var(--muted);
        max-width: 38rem;
        margin-bottom: 1.2rem;
        line-height: 1.5;
    }

    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.7rem 1.4rem;
        border-radius: 999px;
        font-weight: 500;
        text-decoration: none;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.92rem;
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.3);
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
        box-shadow: 0 16px 50px rgba(12, 92, 153, 0.35);
    }

    .btn-ghost {
        background: transparent;
        color: var(--text);
        border-color: var(--border);
    }

    .btn-ghost:hover {
        border-color: var(--accent);
        color: var(--accent);
        transform: translateY(-1px);
    }

</style>
