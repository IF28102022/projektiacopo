<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    const features = [
        {
            title: "Schöne Orte entdecken",
            text: "Kuratiere deine Lieblingsbuchten, Marinas und Ankerplätze mit klaren Bildern und Kurzinfos.",
        },
        {
            title: "Eigene Spots merken",
            text: "Markiere Spots direkt auf der Karte und nutze sie als persönliches, geordnetes Logbuch.",
        },
        {
            title: "Später: KI-Unterstützung",
            text: "Geplant: Ein Assistent schlägt neue Spots oder einfache Routenideen vor.",
        },
    ];
</script>

<Header />

<main class="page">
    <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-grid">
            <div class="hero-copy">
                <p class="eyebrow">Segeln, aber edel.</p>
                <h1>
                    Finde und speichere deine schönsten Segel-Spots mit Stil und
                    Struktur.
                </h1>
                <p class="hero-subtitle">
                    Eine ruhige, professionelle Oberfläche für Segler:innen: Orte
                    entdecken, Spots markieren, Routen vorbereiten. Alles klar,
                    hell und fokussiert.
                </p>

                <div class="hero-actions">
                    <a href="/map" class="btn btn-primary">Karte öffnen</a>
                    <a href="/spots" class="btn btn-ghost">Spots ansehen</a>
                </div>

                <div class="meta">
                    <span class="pill">Live Karte</span>
                    <span class="pill pill-muted">Eigene Sammlung</span>
                    <span class="pill pill-muted">Bald: KI-Ideen</span>
                </div>
            </div>

            <div class="hero-card">
                <div class="card-head">
                    <p>Dein nächster Törn</p>
                    <span class="accent-dot"></span>
                </div>
                <ul class="card-list">
                    <li>
                        <span class="dot"></span>
                        Spots sauber geordnet
                    </li>
                    <li>
                        <span class="dot"></span>
                        Karte für schnelle Entscheidungen
                    </li>
                    <li>
                        <span class="dot"></span>
                        Geteilte Infos für Crew & Gäste
                    </li>
                </ul>
                <div class="card-foot">
                    <div>
                        <p class="label">Kurs</p>
                        <p class="value">Südliche Adria</p>
                    </div>
                    <div>
                        <p class="label">Wetter</p>
                        <p class="value">ruhig & klar</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-header">
                <h2>Was die Seite kann</h2>
                <p class="section-subtitle">
                    Klare Navigation, helle Oberfläche, Fokus auf deine Route.
                </p>
            </div>
        </div>
        <div class="container features">
            {#each features as feature}
                <article class="feature-card">
                    <h3>
                        <span class="badge"></span>
                        {feature.title}
                    </h3>
                    <p>{feature.text}</p>
                </article>
            {/each}
        </div>
    </section>

    <section class="section section-steps">
        <div class="container steps-grid">
            <div class="section-header">
                <h2>Geplanter Ablauf für Nutzer:innen</h2>
                <p class="section-subtitle">
                    In vier klaren Schritten zu einer gepflegten Spot-Sammlung.
                </p>
            </div>
            <ol class="steps">
                <li>
                    <span class="step-number">1</span> Auf der Startseite den
                    Zweck erfassen.
                </li>
                <li>
                    <span class="step-number">2</span> Schöne Spots in der Liste
                    entdecken.
                </li>
                <li>
                    <span class="step-number">3</span> Eigene Spots direkt auf der
                    Karte setzen.
                </li>
                <li>
                    <span class="step-number">4</span> Später: KI für neue Spots
                    oder Routen ansprechen.
                </li>
            </ol>
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
        background: radial-gradient(circle at 20% 20%, #f2f2ff 0%, #f7f4ec 50%)
                no-repeat,
            var(--bg);
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
                circle at 85% 10%,
                rgba(15, 111, 184, 0.12),
                transparent 32%
            ),
            radial-gradient(
                circle at 0% 20%,
                rgba(255, 255, 255, 0.9),
                transparent 35%
            ),
            linear-gradient(135deg, #f7f4ec 0%, #fefefe 45%, #f6f9ff 100%);
        z-index: 0;
    }

    .hero-grid {
        display: grid;
        position: relative;
        z-index: 1;
        gap: 2.5rem;
        align-items: center;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
        margin-bottom: 1.75rem;
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

    .meta {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .pill {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 600;
        font-size: 0.85rem;
    }

    .pill-muted {
        background: #f2f2f2;
        color: var(--muted);
    }

    .hero-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.25rem;
        padding: 1.5rem;
        box-shadow: var(--shadow);
        max-width: 460px;
        margin-left: auto;
    }

    .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: var(--muted);
        font-weight: 600;
        letter-spacing: 0.01em;
    }

    .accent-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 6px var(--accent-soft);
    }

    .card-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        color: var(--text);
        font-weight: 600;
    }

    .card-list li {
        display: flex;
        gap: 0.6rem;
        align-items: center;
    }

    .dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 8px var(--accent-soft);
        flex-shrink: 0;
    }

    .card-foot {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }

    .label {
        color: var(--muted);
        font-size: 0.82rem;
        margin: 0 0 0.15rem;
    }

    .value {
        margin: 0;
        font-weight: 700;
        font-size: 1.05rem;
    }

    .section {
        padding: 2.8rem 0 3.2rem;
    }

    .section:nth-of-type(odd) {
        background: linear-gradient(180deg, #ffffff 0%, #f8f8fb 100%);
    }

    .section-header {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-bottom: 1.5rem;
    }

    .section h2 {
        margin: 0;
        font-size: 1.55rem;
        letter-spacing: -0.01em;
    }

    .section-subtitle {
        margin: 0;
        color: var(--muted);
        max-width: 520px;
    }

    .features {
        display: grid;
        gap: 1.2rem;
    }

    .feature-card {
        background: var(--card);
        border-radius: 1rem;
        padding: 1.4rem 1.5rem;
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
    }

    @media (min-width: 768px) {
        .features {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    .feature-card h3 {
        font-size: 1.08rem;
        margin: 0 0 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.45rem;
    }

    .badge {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 0 6px var(--accent-soft);
        flex-shrink: 0;
    }

    .feature-card p {
        font-size: 0.95rem;
        color: var(--muted);
        line-height: 1.6;
        margin: 0;
    }

    .section-steps {
        background: var(--bg);
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        align-items: start;
    }

    .steps {
        list-style: none;
        padding: 0;
        margin: 1.5rem 0 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .steps li {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.96rem;
        color: var(--text);
        font-weight: 600;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 0.85rem 1rem;
        box-shadow: var(--shadow);
    }

    .step-number {
        width: 1.7rem;
        height: 1.7rem;
        border-radius: 999px;
        border: 1px solid var(--accent);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
        color: var(--accent);
    }
</style>
