<script>
    const year = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="container">
        <div class="brand">
            <img class="logo" src="/Logo.png" alt="SailSpots Logo" />
            <div>
                <p class="brand-name">Segelspots</p>
                <p class="brand-sub">Spots speichern und abrufen.</p>
            </div>
        </div>

        <div class="stack">
            <p class="heading">Produkt</p>
            <a href="/spots">Spots</a>
            <a href="/map">Karte</a>
            <a href="/routen">Routen</a>
            <a href="/tour-planning">Tourplanung</a>
            <a href="/spots/new">Spot anlegen</a>
        </div>

        <div class="stack">
            <p class="heading">Support</p>
            <a href="mailto:hallo@segelspots.app">Kontakt</a>
            <a href="/spots/new">Feedback</a>
            <span class="muted">Updates (folgt)</span>
        </div>

        <div class="stack">
            <p class="heading">Rechtliches</p>
            <span class="muted">Impressum (folgt)</span>
            <span class="muted">Datenschutz (folgt)</span>
            <span class="muted">Nutzungsbedingungen (folgen)</span>
        </div>
    </div>

    <div class="footer-base">
        <p>© {year} Segelspots.</p>
        <div class="meta-links">
            <span class="muted">Beta-Release</span>
            <a href="mailto:hallo@segelspots.app">Support</a>
            <span class="muted">Changelog (folgt)</span>
        </div>
    </div>
</footer>

<style>
    .footer {
        margin-top: 0;
        background: #f6f6f4;
        border-top: 1px solid rgba(15, 23, 42, 0.08);
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

    .logo {
        width: 46px;
        height: 46px;
        object-fit: contain;
        display: block;
    }

    .brand-name {
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.95rem;
        color: #0f1f1f;
    }

    .brand-sub {
        margin: 0.1rem 0 0;
        color: #5f6b7a;
        font-size: 0.9rem;
        letter-spacing: 0.01em;
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
        font-size: 0.85rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0f1f1f;
    }

    .stack a {
        color: #1d2b38;
        text-decoration: none;
        font-weight: 600;
        padding: 0.35rem 0;
        transition: color 0.12s ease, opacity 0.12s ease;
        letter-spacing: 0.01em;
    }

    .stack a:hover {
        color: #0f1f1f;
        opacity: 0.85;
    }

    .muted {
        margin: 0;
        color: #6b7280;
        font-size: 0.9rem;
        letter-spacing: 0.01em;
    }

    .footer-base {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0.75rem 1.25rem 1.4rem;
        border-top: 1px solid rgba(15, 23, 42, 0.06);
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

    .footer-base p {
        margin: 0;
        color: #6b7280;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.01em;
    }

    .meta-links {
        display: flex;
        gap: 0.9rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .meta-links a {
        color: #1d2b38;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.12s ease, opacity 0.12s ease;
        letter-spacing: 0.01em;
    }

    .meta-links a:hover {
        color: #0f1f1f;
        opacity: 0.85;
    }
</style>
