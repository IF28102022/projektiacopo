<script>
    export let eyebrow = "";
    export let title = "";
    export let subtitle = "";
    export let ctaText = "";
    export let ctaHref = "#";
    export let backgroundImageUrl = "";
    export let align = "left"; // "left" | "center"
    export let overlayStrength = 0.55;

    const alignClass = align === "center" ? "center" : "left";
</script>

<section class={"hero " + alignClass}>
    <div
        class="hero-image"
        style={`background-image: url(${backgroundImageUrl});`}
        aria-hidden="true"
    ></div>
    <div class="overlay" style={`opacity: ${overlayStrength};`}></div>
    <div class="content">
        {#if eyebrow}
            <p class="eyebrow">{eyebrow}</p>
        {/if}
        {#if title}
            <h1>{title}</h1>
        {/if}
        {#if subtitle}
            <p class="sub">{subtitle}</p>
        {/if}
        {#if ctaText}
            <a class="cta" href={ctaHref}>{ctaText}</a>
        {/if}
    </div>
</section>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap");

    .hero {
        position: relative;
        min-height: 78vh;
        display: grid;
        place-items: center;
        overflow: hidden;
        color: #f7f6f4;
    }

    .hero-image {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transform: scale(1.02);
        filter: saturate(0.95);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                180deg,
                rgba(10, 18, 28, 0.25) 0%,
                rgba(10, 18, 28, 0.6) 75%
            ),
            linear-gradient(
                90deg,
                rgba(15, 25, 35, 0.2) 0%,
                rgba(10, 18, 28, 0.3) 100%
            );
    }

    .content {
        position: relative;
        z-index: 1;
        width: min(900px, 100%);
        padding: 0 1.8rem;
    }

    .hero.left .content {
        margin-left: 6vw;
        text-align: left;
    }

    .hero.center .content {
        text-align: center;
    }

    .eyebrow {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.85rem;
        margin-bottom: 1rem;
    }

    h1 {
        margin: 0;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(2.8rem, 5vw, 4.8rem);
        letter-spacing: -0.01em;
        line-height: 1.1;
        text-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
    }

    .sub {
        margin: 1.1rem 0 1.8rem;
        max-width: 36rem;
        font-size: 1.05rem;
        line-height: 1.65;
        color: rgba(247, 246, 244, 0.88);
        text-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    }

    .hero.center .sub {
        margin-left: auto;
        margin-right: auto;
    }

    .cta {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: #f7f6f4;
        text-decoration: none;
        font-weight: 700;
        border-bottom: 1px solid rgba(247, 246, 244, 0.5);
        padding-bottom: 0.1rem;
        transition:
            border-color 0.15s ease,
            opacity 0.15s ease;
    }

    .cta:hover {
        border-color: #f7f6f4;
        opacity: 0.92;
    }

    @media (max-width: 720px) {
        .hero {
            min-height: 70vh;
        }
        .hero.left .content {
            margin-left: 0;
            text-align: center;
        }
        h1 {
            font-size: clamp(2.4rem, 7vw, 3.4rem);
        }
        .sub {
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
