<script>
    import { onMount } from "svelte";
    import Header from "$lib/components/header.svelte";
    import Footer from "$lib/components/footer.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import { tourPlan } from "$lib/stores/tourPlan";

    export let data;

    const heroImage = "routes.jpeg";

    onMount(() => {
        tourPlan.init(data.spots);
        tourPlan.syncWithSpots(data.spots);
    });

    $: plan = $tourPlan;
    $: spotMap = new Map((data.spots || []).map((spot) => [spot.id, spot]));
    $: stages = (plan?.stages || []).map((stage, index) => ({
        id: stage.id,
        title: stage.title || `Etappe ${index + 1}`,
        spots: (stage.spotIds || [])
            .map((id) => spotMap.get(id))
            .filter(Boolean),
    }));
    $: hasRoute = stages.some((stage) => stage.spots.length > 0);
</script>

<Header />

<main class="page">
    <Hero
        eyebrow="Routen"
        title="Deine geplanten Etappen"
        subtitle="Alle Routen, die du im Tour Builder zusammengestellt hast, übersichtlich an einem Ort."
        ctaText="Tourplanung öffnen →"
        ctaHref="/tour-planning"
        backgroundImageUrl={heroImage}
        align="left"
        overlayStrength={0.6}
    />

    <section class="section">
        <div class="container">
            {#if !hasRoute}
                <div class="empty">
                    <div>
                        <p class="empty-title">Noch keine Routen gespeichert</p>
                        <p class="empty-text">
                            Erstelle in der Tourplanung eine Route, um sie hier
                            zu sehen.
                        </p>
                    </div>
                    <a class="ghost-link" href="/tour-planning"
                        >Zur Tourplanung</a
                    >
                </div>
            {:else}
                <div class="stage-grid">
                    {#each stages as stage}
                        {#if stage.spots.length}
                            <article class="stage-card">
                                <div class="stage-head">
                                    <p class="stage-title">{stage.title}</p>
                                    <span class="stage-count">
                                        {stage.spots.length} Spots
                                    </span>
                                </div>
                                <div class="stage-list">
                                    {#each stage.spots as spot, index}
                                        <div class="spot-row">
                                            <span class="spot-index"
                                                >{index + 1}</span
                                            >
                                            <div>
                                                <p class="spot-name">
                                                    {spot.name}
                                                </p>
                                                <p class="spot-meta">
                                                    {spot.region || "—"} · {spot.spotType ||
                                                        "Spot"}
                                                </p>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </article>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    </section>
</main>

<Footer />

<style>
    :global(body) {
        margin: 0;
        font-family: "Manrope", "Inter", system-ui, sans-serif;
        background: #f8f7f3;
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
    }

    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    .page {
        min-height: 100vh;
        background: #f8f7f3;
    }

    .section {
        padding: 2.8rem 0 3.5rem;
        background: linear-gradient(180deg, #f8f7f3 0%, #f3f6ff 100%);
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .stage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
    }

    .stage-card {
        background: #ffffff;
        border-radius: 1.1rem;
        border: 1px solid rgba(15, 111, 184, 0.08);
        box-shadow: 0 18px 45px rgba(12, 40, 70, 0.08);
        padding: 1.2rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .stage-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.6rem;
    }

    .stage-title {
        margin: 0;
        font-weight: 800;
        letter-spacing: 0.01em;
    }

    .stage-count {
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #eef4ff;
        color: #0f6fb8;
        font-weight: 700;
        font-size: 0.85rem;
    }

    .stage-list {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
    }

    .spot-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        padding: 0.6rem 0.7rem;
        border-radius: 0.85rem;
        background: #f8fbff;
        border: 1px solid #e5eaf5;
    }

    .spot-index {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: #0f6fb8;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .spot-name {
        margin: 0;
        font-weight: 700;
    }

    .spot-meta {
        margin: 0.1rem 0 0;
        color: #5f6b7a;
        font-size: 0.9rem;
    }

    .empty {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1.2rem 1.4rem;
        background: #ffffff;
        border-radius: 1rem;
        border: 1px dashed #e2e8f0;
        box-shadow: 0 12px 30px rgba(12, 40, 70, 0.06);
    }

    .empty-title {
        margin: 0;
        font-weight: 700;
    }

    .empty-text {
        margin: 0.2rem 0 0;
        color: #5f6b7a;
    }

    .ghost-link {
        color: #1f2937;
        text-decoration: none;
        font-weight: 600;
        padding: 0.55rem 1rem;
        border-radius: 0.65rem;
        border: 1px solid #e5e7eb;
        background: #ffffff;
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease;
    }

    .ghost-link:hover {
        color: #0f1f35;
        border-color: #d5cfc3;
        background: #f9f7f2;
    }
</style>
