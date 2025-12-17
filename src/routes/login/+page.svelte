<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    export let form;
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container grid">
            <div class="panel copy">
                <p class="eyebrow">Zugang</p>
                <h1>Login</h1>
                <p class="subtitle">
                    Owner meldet sich mit der hinterlegten E-Mail an und bekommt volle
                    Rechte. Für alle anderen gibt es ein gemeinsames Passwort, das du
                    teilen kannst.
                </p>
                <div class="cards">
                    <div class="card">
                        <p class="label">Owner</p>
                        <p class="value">Alle Aktionen, Spots anlegen/löschen</p>
                        <p class="muted">Nutze deine Owner-Mail + Owner-Passwort.</p>
                    </div>
                    <div class="card">
                        <p class="label">Alle anderen</p>
                        <p class="value">Leserechte, Karte & Spot-Details</p>
                        <p class="muted">
                            Beliebige E-Mail + gemeinsames Passwort (USER_PASSWORD).
                        </p>
                    </div>
                </div>
            </div>

            <form method="POST" class="panel form">
                <div class="form-head">
                    <div>
                        <p class="eyebrow small">Anmelden</p>
                        <h2>Weiter zu Spots & Karte</h2>
                    </div>
                </div>

                {#if form?.message}
                    <div class="alert">{form.message}</div>
                {/if}

                <label>
                    E-Mail
                    <input
                        name="email"
                        type="email"
                        placeholder="du@example.com"
                        value={form?.email || ""}
                        required
                    />
                </label>

                <label>
                    Passwort
                    <input
                        name="password"
                        type="password"
                        placeholder="Gemeinsames Passwort oder Owner-Passwort"
                        required
                    />
                </label>

                <p class="hint">
                    Nach dem Login wirst du zur letzten Seite zurückgeführt. Kein Account?
                    <a class="link" href="/register">Registrieren</a>
                </p>

                <button class="btn-primary" type="submit">Einloggen</button>
            </form>
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
        width: min(1100px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .section {
        padding: 3rem 0 3.2rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.4rem;
        align-items: start;
    }

    .panel {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border-radius: 1.2rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: var(--shadow);
        padding: 1.4rem 1.5rem;
    }

    .copy h1 {
        margin: 0.2rem 0 0.5rem;
        font-size: 2.2rem;
        letter-spacing: -0.01em;
        font-family: "Playfair Display", "Manrope", serif;
    }

    .subtitle {
        margin: 0 0 1rem;
        color: var(--muted);
        max-width: 640px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 0.8rem;
    }

    .card {
        background: #f8fbff;
        border: 1px solid var(--border);
        border-radius: 0.9rem;
        padding: 0.8rem 1rem;
    }

    .label {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        font-size: 0.78rem;
        font-weight: 700;
    }

    .value {
        margin: 0.2rem 0 0.1rem;
        font-weight: 800;
    }

    .muted {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .form-head h2 {
        margin: 0.2rem 0 0.1rem;
        font-size: 1.4rem;
        letter-spacing: -0.01em;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        color: var(--muted);
        font-size: 0.95rem;
    }

    input {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 0.65rem 0.8rem;
        font-size: 1rem;
        color: var(--text);
        transition: border-color 0.12s ease, box-shadow 0.12s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(15, 111, 184, 0.15);
    }

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.85rem;
        margin: 0;
    }

    .eyebrow.small {
        font-size: 0.8rem;
    }

    .alert {
        background: #fff5f5;
        color: #9b2c2c;
        border: 1px solid rgba(197, 48, 48, 0.3);
        border-radius: 0.8rem;
        padding: 0.75rem 0.9rem;
        font-weight: 600;
    }

    .hint {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
    }

    .btn-primary {
        background: var(--accent);
        color: #f8fbff;
        padding: 0.7rem 1.1rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid transparent;
        box-shadow: 0 14px 45px rgba(15, 111, 184, 0.24);
        cursor: pointer;
        align-self: flex-start;
    }

    .btn-primary:hover {
        background: #0c5c99;
        transform: translateY(-1px);
    }

    .link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
    }

    .link:hover {
        text-decoration: underline;
    }
</style>
