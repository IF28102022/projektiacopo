<script>
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";

    const quickLinks = [
        {
            href: "/spots",
            label: "Spots entdecken",
            desc: "Alle gespeicherten Buchten, Marinas und Ankerplätze als ruhige Übersicht.",
        },
        {
            href: "/map",
            label: "Karte öffnen",
            desc: "Spots auf der Karte prüfen, Marker setzen und Positionen vergleichen.",
        },
        {
            href: "/tour-planning",
            label: "Tour planen",
            desc: "Etappen zusammenstellen, Reihenfolge festlegen und Route berechnen.",
        },
        {
            href: "/routen",
            label: "Routen ansehen",
            desc: "Deine geplanten Etappen gesammelt und strukturiert nachschlagen.",
        },
        {
            href: "/login",
            label: "Einloggen",
            desc: "Anmelden, um Spots zu speichern, Favoriten zu setzen und Routen zu bauen.",
        },
    ];
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap"
    />
    <title>SailSpots · Discover Places Worth Dropping Anchor</title>
</svelte:head>

<main class="page">
    <Header />

    <section class="hero">
        <div class="hero-image" aria-hidden="true"></div>
        <div class="overlay"></div>
        <div class="hero-content">
            <p class="eyebrow">SailSpots</p>
            <h1>Discover Places Worth Dropping Anchor</h1>
            <p class="sub">
                Carefully curated sailing spots across Europe. Quiet anchorages,
                harbours, and hidden bays to explore at your own pace.
            </p>
            <a class="cta" href="/map">Explore the map →</a>
        </div>
    </section>

    <section class="links-section">
        <div class="links-container">
            {#each quickLinks as link}
                <div class="link-row">
                    <a class="link-title" href={link.href}>{link.label} →</a>
                    <p class="link-desc">{link.desc}</p>
                </div>
            {/each}
        </div>
    </section>

    <Footer />
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: url("/Home.jpeg") center/cover no-repeat;
        color: #0f1f1f;
        -webkit-font-smoothing: antialiased;
    }

    .page {
        min-height: 100vh;
        background: url("/Home.jpeg") center/cover no-repeat;
        color: #0f1f1f;
    }

    .hero {
        position: relative;
        min-height: 90vh;
        display: grid;
        place-items: center;
        overflow: hidden;
        padding-top: 80px;
    }

    .hero-image {
        position: absolute;
        inset: 0;
        display: none;
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

    .links-section {
        padding: 3rem 1.6rem 3.8rem;
        background: transparent;
    }

    .links-container {
        width: min(860px, 100%);
        margin: 0 auto;
        display: grid;
        gap: 0;
        text-align: center;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .link-row {
        padding: 1.25rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: grid;
        gap: 0.45rem;
        justify-items: center;
    }

    .link-title {
        color: rgba(255, 255, 255, 0.96);
        text-decoration: none;
        font-weight: 700;
        letter-spacing: 0.02em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.35);
        padding-bottom: 0.15rem;
    }

    .link-title:hover {
        border-color: rgba(255, 255, 255, 0.65);
    }

    .link-desc {
        margin: 0;
        color: rgba(255, 255, 255, 0.72);
        font-size: 0.98rem;
        max-width: 640px;
    }

    @media (max-width: 720px) {
        .hero {
            min-height: 80vh;
            padding-top: 70px;
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

        .links-section {
            padding: 2.6rem 1.25rem 3.2rem;
        }
    }
</style>
