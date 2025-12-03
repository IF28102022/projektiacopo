<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <p class="eyebrow">Work in Progress</p>
            <h1>KI-Assistent</h1>
            <p class="subtitle">
                Hier entsteht ein smarter Helfer für neue Spots, Routenideen und
                Crew-Briefings. Bald kannst du deine Sammlung mit KI-Inspiration
                erweitern.
            </p>

            <div class="panel">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot accent"></span>
                        <p class="panel-title">Status</p>
                    </div>
                    <p class="panel-meta">Geplant · noch nicht aktiv</p>
                </div>

                <div class="panel-body">
                    <ul class="list">
                        <li>
                            <span class="badge">Demnächst</span>
                            Vorschläge für neue Spots entlang deiner Route
                        </li>
                        <li>
                            <span class="badge">Demnächst</span>
                            Kurzbriefings für Crew und Gäste
                        </li>
                        <li>
                            <span class="badge">Demnächst</span>
                            Routenvorschläge nach Wind und Zeitfenster
                        </li>
                    </ul>
                    <div class="info">
                        <p class="label">ETA</p>
                        <p class="value">coming soon</p>
                    </div>
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
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 3rem 0 3.2rem;
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
        margin-bottom: 0.3rem;
    }

    h1 {
        margin: 0;
        font-size: 2.2rem;
        letter-spacing: -0.01em;
        font-family: "Playfair Display", "Manrope", serif;
    }

    .subtitle {
        color: var(--muted);
        font-size: 1rem;
        margin-top: 0.3rem;
        max-width: 700px;
    }

    .panel {
        margin-top: 1.8rem;
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border-radius: 1.2rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        overflow: hidden;
    }

    .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.1rem 1.25rem;
        border-bottom: 1px solid var(--border);
    }

    .row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--muted);
    }

    .dot.accent {
        background: var(--accent);
        box-shadow: 0 0 0 8px var(--accent-soft);
    }

    .panel-title {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.01em;
    }

    .panel-meta {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .panel-body {
        padding: 1.25rem;
        display: grid;
        gap: 1.1rem;
    }

    .list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
    }

    .list li {
        display: flex;
        gap: 0.6rem;
        align-items: center;
        color: var(--text);
        font-weight: 600;
        background: #fafbfd;
        border: 1px solid var(--border);
        border-radius: 0.85rem;
        padding: 0.7rem 0.9rem;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.28rem 0.6rem;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
        font-size: 0.8rem;
        flex-shrink: 0;
    }

    .info {
        display: inline-flex;
        align-items: baseline;
        gap: 0.4rem;
        color: var(--muted);
    }

    .label {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.75rem;
        font-weight: 700;
    }

    .value {
        margin: 0;
        font-weight: 800;
        color: var(--text);
    }
</style>
