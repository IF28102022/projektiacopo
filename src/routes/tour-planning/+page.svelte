<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    const steps = [
        {
            title: "Etappen definieren",
            description: "Start- und Zielhäfen skizzieren, Distanzen und ETA festhalten.",
        },
        {
            title: "Alternativen sichern",
            description: "Ausweichhäfen und Ankerplätze je Leg notieren, inklusive Tiefe.",
        },
        {
            title: "Crew briefen",
            description: "Aufgaben verteilen, Safety-Check vorbereiten, Notfallinfos sammeln.",
        },
    ];

    const checklist = [
        {
            label: "Leg-Übersicht",
            note: "Strecken, Distanzen und geplanter Kurs",
            status: "offen",
        },
        {
            label: "Wetterfenster",
            note: "Wind, Böen, Wellen, Strömung",
            status: "offen",
        },
        {
            label: "Hafendaten",
            note: "Ansteuerung, Tiefe, Kontakt, Gebühren",
            status: "in Arbeit",
        },
        {
            label: "Crew & Safety",
            note: "Rollen, Notfallnummern, Medical Kit",
            status: "optional",
        },
    ];

    const notes = [
        {
            title: "Nächstes Wetterfenster",
            detail: "NW 12–18 kn, Böen 22 kn, Samstag ab 10 Uhr abflauend.",
        },
        {
            title: "Treibstoff",
            detail: "Reichweite ~22 nm bei 2200 rpm, Tank in Sønderborg prüfen.",
        },
        {
            title: "Crew-Hinweis",
            detail: "Schichten 3h/3h nachts, POB-Briefing nach Ablegen in Kiel.",
        },
    ];
</script>

<Header />

<main class="page">
    <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-grid">
            <div class="hero-copy">
                <p class="eyebrow">Tourplanung</p>
                <h1>Tour planen, Etappen skizzieren, Crew briefen.</h1>
                <p class="subtitle">
                    Grundgerüst für den Törn: Legs anlegen, Alternativen festhalten, Checklisten vorbereiten. Noch keine Logik – nur das Layout zum Starten.
                </p>
                <div class="hero-actions">
                    <a class="btn btn-primary" href="#plan">Plan starten</a>
                    <a class="btn btn-ghost" href="/map">Karte öffnen</a>
                </div>
                <div class="pills">
                    <span class="pill">Legs</span>
                    <span class="pill">Checklisten</span>
                    <span class="pill">Notizen</span>
                </div>
            </div>

            <div class="panel plan-preview" aria-label="Plan-Übersicht Mock">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot accent"></span>
                        <p class="panel-title">Aktueller Törn</p>
                    </div>
                    <span class="panel-meta">Mock-Daten</span>
                </div>
                <div class="plan-body">
                    <div class="line">
                        <p class="label">Name</p>
                        <p class="value">Ostsee · Sommer</p>
                    </div>
                    <div class="line">
                        <p class="label">Fenster</p>
                        <p class="value">15.06 – 22.06</p>
                    </div>
                    <div class="legs">
                        <p class="label">Legs</p>
                        <ul>
                            <li>
                                <div>
                                    <strong>Kiel</strong> → Maasholm
                                    <span class="meta">28 nm</span>
                                </div>
                                <span class="tag">ETA 6h</span>
                            </li>
                            <li>
                                <div>
                                    <strong>Maasholm</strong> → Sønderborg
                                    <span class="meta">21 nm</span>
                                </div>
                                <span class="tag">ETA 4h</span>
                            </li>
                            <li>
                                <div>
                                    <strong>Sønderborg</strong> → Ærøskøbing
                                    <span class="meta">25 nm</span>
                                </div>
                                <span class="tag">ETA 5h</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section" id="plan">
        <div class="container grid">
            <div class="panel">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot"></span>
                        <p class="panel-title">Nächste Schritte</p>
                    </div>
                    <p class="panel-meta">Grundgerüst</p>
                </div>
                <ul class="step-list">
                    {#each steps as step}
                        <li>
                            <p class="step-title">{step.title}</p>
                            <p class="step-desc">{step.description}</p>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="panel">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot"></span>
                        <p class="panel-title">Checkliste</p>
                    </div>
                    <p class="panel-meta">für den Start</p>
                </div>
                <ul class="checklist">
                    {#each checklist as item}
                        <li>
                            <span class="check-dot" aria-hidden="true"></span>
                            <div class="check-copy">
                                <p class="check-title">{item.label}</p>
                                <p class="check-note">{item.note}</p>
                            </div>
                            <span class="status">{item.status}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container notes">
            <div class="panel">
                <div class="panel-head">
                    <div class="row">
                        <span class="dot"></span>
                        <p class="panel-title">Notizen</p>
                    </div>
                    <p class="panel-meta">später editierbar</p>
                </div>
                <div class="notes-grid">
                    {#each notes as note}
                        <article class="note">
                            <p class="note-title">{note.title}</p>
                            <p class="note-desc">{note.detail}</p>
                        </article>
                    {/each}
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

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .hero {
        position: relative;
        overflow: hidden;
        padding: 3.2rem 0 2.4rem;
    }

    .hero-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                circle at 82% 22%,
                rgba(15, 111, 184, 0.16),
                transparent 36%
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.4rem;
        position: relative;
        z-index: 1;
        align-items: stretch;
    }

    .hero-copy {
        max-width: 640px;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    h1 {
        font-family: "Playfair Display", "Manrope", serif;
        font-size: clamp(2.2rem, 4vw, 3.2rem);
        margin: 0;
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
        font-weight: 700;
        font-size: 0.85rem;
        width: fit-content;
    }

    .subtitle {
        font-size: 1rem;
        color: var(--muted);
        max-width: 38rem;
        margin: 0;
        line-height: 1.5;
    }

    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.3rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.7rem 1.4rem;
        border-radius: 999px;
        font-weight: 700;
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

    .pills {
        display: flex;
        gap: 0.45rem;
        flex-wrap: wrap;
        margin-top: 0.4rem;
    }

    .pill {
        padding: 0.4rem 0.85rem;
        border-radius: 999px;
        background: #f2f5fb;
        color: #0f1f35;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .panel {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border-radius: 1.2rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        overflow: hidden;
    }

    .plan-preview {
        align-self: stretch;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
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
        font-weight: 800;
        letter-spacing: 0.01em;
        color: #0f172a;
    }

    .panel-meta {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .plan-body {
        display: flex;
        flex-direction: column;
        padding: 1.25rem;
        gap: 0.6rem;
    }

    .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7rem 0.85rem;
        background: #f6f9ff;
        border-radius: 0.9rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
    }

    .label {
        margin: 0;
        color: var(--muted);
        font-weight: 700;
        font-size: 0.95rem;
    }

    .value {
        margin: 0;
        font-weight: 800;
    }

    .legs {
        background: #0f1f35;
        color: #e9f2ff;
        border-radius: 0.95rem;
        padding: 1rem 1.1rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .legs ul {
        list-style: none;
        padding: 0;
        margin: 0.35rem 0 0;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
    }

    .legs li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .legs strong {
        font-weight: 800;
    }

    .meta {
        color: #a7b7d3;
        font-weight: 600;
    }

    .tag {
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        color: #dbe8ff;
        font-weight: 700;
        font-size: 0.85rem;
        border: 1px solid rgba(255, 255, 255, 0.14);
    }

    .section {
        padding: 2.6rem 0 2.8rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.2rem;
    }

    .step-list,
    .checklist {
        margin: 0;
        padding: 1.1rem 1.1rem 1.2rem;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .step-title {
        margin: 0 0 0.1rem;
        font-weight: 800;
    }

    .step-desc {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
        line-height: 1.45;
    }

    .checklist li {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 0.6rem;
        align-items: center;
        padding: 0.35rem 0.4rem;
    }

    .check-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0f6fb8, #4ca3ff);
        box-shadow: 0 0 0 6px rgba(15, 111, 184, 0.08);
    }

    .check-copy {
        display: flex;
        flex-direction: column;
        gap: 0.05rem;
    }

    .check-title {
        margin: 0;
        font-weight: 800;
    }

    .check-note {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .status {
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        background: #f2f5fb;
        font-weight: 700;
        font-size: 0.85rem;
        color: #0f1f35;
        border: 1px solid #dde6f5;
    }

    .notes {
        display: grid;
    }

    .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.9rem;
        padding: 1rem;
    }

    .note {
        background: #f6f9ff;
        border-radius: 0.9rem;
        padding: 0.9rem 1rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
    }

    .note-title {
        margin: 0 0 0.2rem;
        font-weight: 800;
    }

    .note-desc {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
        line-height: 1.4;
    }

    @media (max-width: 700px) {
        .panel-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
        }

        .legs li {
            align-items: flex-start;
        }
    }
</style>
