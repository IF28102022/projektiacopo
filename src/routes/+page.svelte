<script>
    const features = [
        {
            title: "Schöne Orte entdecken",
            text: "Stöbere durch eine Auswahl an Buchten, Marinas und Ankerplätzen mit Bildern und kurzen Infos.",
        },
        {
            title: "Eigene Spots merken",
            text: "Nutze die Karte, um deine eigenen Segel-Spots zu markieren und als persönliches Logbuch zu verwenden.",
        },
        {
            title: "Später: KI-Unterstützung",
            text: "Geplant: Ein Assistent, der dir neue Spots oder einfache Routenideen vorschlägt.",
        },
    ];
</script>

<main class="page">
    <section class="hero">
        <div class="hero-inner">
            <div class="hero-text">
                <h1>Finde und speichere deine schönsten Segel-Spots.</h1>
                <p class="hero-subtitle">
                    Eine einfache Webseite für Segler:innen: schöne Orte
                    ansehen, eigene Spots auf der Karte setzen und dein nächster
                    Törn besser planen.
                </p>

                <div class="hero-actions">
                    <a href="/map" class="btn btn-primary">Karte öffnen</a>
                    <a href="/spots" class="btn btn-secondary">Spots ansehen</a>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <h2>Was die Seite kann</h2>
        <div class="features">
            {#each features as feature}
                <article class="feature-card">
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                </article>
            {/each}
        </div>
    </section>

    <section class="section section-dark">
        <div class="section-inner">
            <h2>Geplanter Ablauf für Nutzer:innen</h2>
            <ol class="steps">
                <li>
                    <span class="step-number">1</span> Auf der Startseite verstehen,
                    worum es geht.
                </li>
                <li>
                    <span class="step-number">2</span> Schöne Spots in der Liste
                    entdecken.
                </li>
                <li>
                    <span class="step-number">3</span> Auf der Karte eigene Spots
                    setzen und speichern.
                </li>
                <li>
                    <span class="step-number">4</span> Später: KI nach neuen Spots
                    oder Routen fragen.
                </li>
            </ol>
        </div>
    </section>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        background: #020617;
        color: #e5e7eb;
    }

    .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: radial-gradient(
            circle at top,
            #0f172a 0,
            #020617 55%,
            #000 100%
        );
    }

    .hero {
        padding: 3.5rem 1.5rem 2.5rem;
    }

    .hero-inner {
        max-width: 1040px;
        margin: 0 auto;
    }

    .hero-text {
        max-width: 640px;
    }

    h1 {
        font-size: clamp(2.1rem, 4vw, 3rem);
        margin-bottom: 0.75rem;
    }

    .hero-subtitle {
        font-size: 0.98rem;
        color: #9ca3af;
        max-width: 32rem;
        margin-bottom: 1.75rem;
        line-height: 1.5;
    }

    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
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
            transform 0.1s ease,
            box-shadow 0.1s ease,
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
    }

    .btn-primary {
        background: #0ea5e9;
        color: #0b1120;
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.35);
    }

    .btn-primary:hover {
        background: #38bdf8;
        transform: translateY(-1px);
        box-shadow: 0 14px 35px rgba(56, 189, 248, 0.4);
    }

    .btn-secondary {
        background: transparent;
        color: #e5e7eb;
        border-color: #4b5563;
    }

    .btn-secondary:hover {
        border-color: #9ca3af;
        background: rgba(15, 23, 42, 0.7);
    }

    .section {
        padding: 2.5rem 1.5rem 3rem;
        background: rgba(15, 23, 42, 0.85);
    }

    .section-dark {
        background: transparent;
    }

    .section h2 {
        text-align: left;
        max-width: 1040px;
        margin: 0 auto 1.5rem;
        font-size: 1.4rem;
    }

    .features {
        max-width: 1040px;
        margin: 0 auto;
        display: grid;
        gap: 1.25rem;
    }

    @media (min-width: 768px) {
        .features {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    .feature-card {
        background: rgba(15, 23, 42, 0.96);
        border-radius: 1rem;
        padding: 1.2rem 1.4rem;
        border: 1px solid rgba(55, 65, 81, 0.9);
    }

    .feature-card h3 {
        font-size: 1.02rem;
        margin-bottom: 0.45rem;
    }

    .feature-card p {
        font-size: 0.9rem;
        color: #9ca3af;
        line-height: 1.45;
    }

    .section-inner {
        max-width: 720px;
        margin: 0 auto;
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
        font-size: 0.95rem;
        color: #d1d5db;
    }

    .step-number {
        width: 1.7rem;
        height: 1.7rem;
        border-radius: 999px;
        border: 1px solid #0ea5e9;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.85rem;
    }
</style>
