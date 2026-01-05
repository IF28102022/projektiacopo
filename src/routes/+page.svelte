<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap"
    />
    <title>SailSpots · Discover Places Worth Dropping Anchor</title>
</svelte:head>

<script>
    import Footer from "$lib/components/footer.svelte";

    const links = [
        { href: "/", label: "Home" },
        { href: "/spots", label: "Spots" },
        { href: "/map", label: "Map" },
        { href: "/ai", label: "AI" },
        { href: "/tour-planning", label: "Tourplanning" },
        { href: "/login", label: "Login" }
    ];
</script>

<main class="page">
    <nav class="nav">
        <div class="brand">SailSpots</div>
        <div class="links">
            {#each links as link}
                <a href={link.href}>{link.label}</a>
            {/each}
        </div>
    </nav>

    <section class="hero">
        <div class="hero-image" aria-hidden="true"></div>
        <div class="overlay"></div>
        <div class="hero-content">
            <p class="eyebrow">SailSpots</p>
            <h1>Discover Places Worth Dropping Anchor</h1>
            <p class="sub">
                Carefully curated sailing spots across Europe. Quiet anchorages, harbours, and hidden bays
                to explore at your own pace.
            </p>
            <a class="cta" href="/map">Explore the map →</a>
        </div>
    </section>

    <section class="intro">
        <div class="intro-inner">
            <p>
                SailSpots ist eine kuratierte Sammlung ausgewählter Segelorte. Wir glauben an leise Entdeckungen,
                ruhige Abende vor Anker und eine klare, elegante Navigation durch Ihre Reise.
            </p>
            <p>
                Keine Eile, keine grellen Farben – nur Orte, die es wert sind, entdeckt zu werden.
            </p>
        </div>
    </section>
    <Footer />
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: #f8f6f2;
        color: #0f1f1f;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
        background: #f8f6f2;
        color: #0f1f1f;
    }

    .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.2rem 1.6rem;
        mix-blend-mode: difference;
        color: #f7f6f4;
        font-weight: 600;
        letter-spacing: 0.02em;
    }

    .nav a {
        color: inherit;
        text-decoration: none;
        margin-left: 1rem;
        font-weight: 600;
    }

    .nav a:hover {
        text-decoration: underline;
    }

    .brand {
        font-size: 1rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .hero {
        position: relative;
        min-height: 90vh;
        display: grid;
        place-items: center;
        overflow: hidden;
    }

    .hero-image {
        position: absolute;
        inset: 0;
        background: url("https://cdn.shopify.com/s/files/1/0287/2724/6893/files/custom_resized_bf168553-fbfa-451c-bcba-b064fd9c84d4.png?v=1693477199")
            center/cover no-repeat;
        transform: scale(1.03);
        filter: saturate(0.9);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(10, 18, 28, 0.25) 0%, rgba(10, 18, 28, 0.55) 70%),
            linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0%, rgba(10, 18, 28, 0.4) 100%);
    }

    .hero-content {
        position: relative;
        z-index: 1;
        text-align: left;
        max-width: 720px;
        padding: 0 1.8rem;
        color: #f7f6f4;
        transform: translateY(6vh);
    }

    .eyebrow {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(8px);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }

    h1 {
        margin: 0;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(2.8rem, 5vw, 4.6rem);
        letter-spacing: -0.01em;
        line-height: 1.1;
    }

    .sub {
        margin: 1.1rem 0 1.8rem;
        max-width: 34rem;
        font-size: 1.05rem;
        line-height: 1.6;
        color: rgba(247, 246, 244, 0.82);
    }

    .cta {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: #f7f6f4;
        text-decoration: none;
        font-weight: 700;
        border-bottom: 1px solid rgba(247, 246, 244, 0.4);
        padding-bottom: 0.1rem;
    }

    .cta:hover {
        border-color: #f7f6f4;
    }

    .intro {
        padding: 4rem 1.5rem 5rem;
        background: linear-gradient(180deg, #f8f6f2 0%, #f4f1ea 100%);
        display: flex;
        justify-content: center;
    }

    .intro-inner {
        max-width: 960px;
        text-align: center;
        font-size: 1.05rem;
        line-height: 1.8;
        color: #1f2427;
        letter-spacing: 0.01em;
    }

    .intro-inner p {
        margin: 0 0 1rem;
    }

    @media (max-width: 720px) {
        .nav {
            padding: 1rem 1.25rem;
        }
        .nav .links {
            display: none;
        }
        .hero-content {
            text-align: center;
            transform: translateY(4vh);
        }
        .hero-content h1 {
            font-size: clamp(2.6rem, 7vw, 3.4rem);
        }
        .sub {
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
