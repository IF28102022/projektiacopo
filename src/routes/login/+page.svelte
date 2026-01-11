<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    export let form;
</script>

<Header />

<main class="page">
    <section class="section">
        <div class="container">
            <div class="panel">
                <div>
                    <p class="eyebrow">Sign in</p>
                    <h1>Sign in</h1>
                    <p class="muted">Create spots and manage your own spots.</p>
                </div>
                <form method="POST" class="form">
                    {#if form?.error}
                        <p class="error">{form.error}</p>
                    {/if}
                    <label>
                        Email
                        <input name="email" type="email" required />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" required />
                    </label>
                    <button type="submit" class="btn-primary">Sign in</button>
                </form>
                <p class="register-hint">
                    No account yet? <a href="/register">Create one</a>
                </p>
            </div>
        </div>
    </section>
</main>

<Footer />

<style>
    :global(:root) {
        --border: #e5e7eb;
        --muted: #6b7280;
        --accent: #0f6fb8;
        --accent-soft: #e6f0fa;
    }

    .page {
        min-height: 100vh;
    }

    .section {
        padding: 2.5rem 0 3rem;
    }

    .container {
        width: min(640px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .panel {
        background: #ffffff;
        border: 1px solid var(--border);
        border-radius: 1rem;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .eyebrow {
        display: inline-flex;
        background: var(--accent-soft);
        color: var(--accent);
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        font-weight: 700;
        margin: 0;
    }

    h1 {
        margin: 0.35rem 0 0.2rem;
    }

    .muted {
        margin: 0;
        color: var(--muted);
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        color: var(--muted);
        font-weight: 600;
    }

    input {
        border-radius: 0.75rem;
        border: 1px solid var(--border);
        padding: 0.65rem 0.75rem;
        font-size: 1rem;
    }

    .btn-primary {
        background: var(--accent);
        color: #fff;
        border: none;
        padding: 0.7rem 1.1rem;
        border-radius: 0.8rem;
        font-weight: 700;
        cursor: pointer;
    }

    .error {
        margin: 0;
        color: #b91c1c;
        font-weight: 700;
    }

    .register-hint {
        margin: 0;
        color: var(--muted);
        font-weight: 600;
    }

    .register-hint a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
    }

    .register-hint a:hover {
        text-decoration: underline;
    }
</style>
