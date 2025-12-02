<footer class="footer">
    <div class="container">
        <div class="brand">
            <span class="emoji" aria-hidden="true">⛵️</span>
            <div>
                <p class="brand-name">Segelspots</p>
                <p class="brand-sub">Gepflegte Logbücher, helle UI.</p>
            </div>
        </div>

        <div class="links">
            <a href="/spots">Spots</a>
            <a href="/map">Karte</a>
            <a href="/spots/new">Neuer Spot</a>
        </div>

        <div class="note">
            <span class="pill">Bald: KI-Ideen</span>
            <p class="muted">Für ruhige Törns und klare Crews.</p>
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
        padding: 1.6rem 1.25rem 1.8rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

    .links {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .links a {
        color: var(--muted);
        text-decoration: none;
        font-weight: 600;
        padding: 0.45rem 0.75rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .links a:hover {
        color: var(--accent);
        border-color: var(--accent);
        background: var(--accent-soft);
    }

    .note {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .pill {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
        font-size: 0.85rem;
        width: fit-content;
    }

    .muted {
        margin: 0;
        color: var(--muted);
        font-size: 0.95rem;
    }
</style>
