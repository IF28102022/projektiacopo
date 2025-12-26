<script>
    const year = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="container">
        <div class="brand">
            <span class="emoji" aria-hidden="true">⛵️</span>
            <div>
                <p class="brand-name">Segelspots</p>
                <p class="brand-sub">Logbücher, Spots und Crew-Notizen an einem Ort.</p>
            </div>
        </div>

        <div class="stack">
            <p class="heading">Produkt</p>
            <a href="/spots">Spots</a>
            <a href="/map">Karte</a>
            <a href="/spots/new">Spot anlegen</a>
        </div>

        <div class="stack">
            <p class="heading">Support</p>
            <a href="mailto:hallo@segelspots.app">Kontakt</a>
            <a href="/ai">Updates & KI-Ideen</a>
            <a href="/spots/new">Feedback geben</a>
        </div>

        <div class="stack">
            <p class="heading">Rechtliches</p>
            <span class="muted">Impressum (folgt)</span>
            <span class="muted">Datenschutz (folgt)</span>
            <span class="muted">Nutzungsbedingungen (folgen)</span>
        </div>
    </div>

    <div class="footer-base">
        <p>© {year} Segelspots. Für ruhige Törns und klare Crews.</p>
        <div class="meta-links">
            <span class="muted">Beta-Release</span>
            <a href="mailto:hallo@segelspots.app">Support</a>
            <a href="/ai">Changelog</a>
        </div>
    </div>
</footer>

<style>
    .footer {
        margin-top: 2rem;
        background: linear-gradient(180deg, #f9fbff 0%, #f7f4ec 100%);
        border-top: 1px solid var(--border);
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 1.6rem 1.25rem 1.2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        align-items: start;
    }

    .brand {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .emoji {
        font-size: 1.2rem;
    }

    .brand-name {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.02em;
    }

    .brand-sub {
        margin: 0.1rem 0 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .stack {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        align-items: flex-start;
    }

    .heading {
        margin: 0 0 0.15rem;
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.01em;
    }

    .stack a {
        color: var(--muted);
        text-decoration: none;
        font-weight: 600;
        padding: 0.35rem 0;
        transition: color 0.12s ease;
    }

    .stack a:hover {
        color: var(--accent);
    }

    .muted {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .footer-base {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0.75rem 1.25rem 1.4rem;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

    .footer-base p {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
        font-weight: 600;
    }

    .meta-links {
        display: flex;
        gap: 0.9rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .meta-links a {
        color: var(--muted);
        font-weight: 600;
        text-decoration: none;
        transition: color 0.12s ease;
    }

    .meta-links a:hover {
        color: var(--accent);
    }
</style>
