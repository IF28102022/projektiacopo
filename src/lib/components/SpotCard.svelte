<script>
    export let spot;
    export let action = "?/delete";
    export let showDelete = true;

    $: imageSrc =
        spot?.imageUrl ||
        (Array.isArray(spot?.imageDataList) ? spot.imageDataList[0] : null) ||
        spot?.imageData;
    const typeIcons = {
        Ankerplatz: "⚓",
        Marina: "🛥",
        Bucht: "🏝",
        Mooringfeld: "🟡",
        Hafen: "🚢",
    };
    const facilityLabels = {
        water: "Wasser",
        diesel: "Diesel",
        mooring: "Mooringbojen",
        power: "Strom",
        restaurant: "Restaurant",
        supermarket: "Supermarkt",
        service: "Werft/Service",
        waste: "Müllentsorgung",
    };

    $: typeIcon = typeIcons[spot?.spotType] || "📍";
    $: depthText =
        spot?.depthMin || spot?.depthMax
            ? `Tiefe ${spot?.depthMin ?? "?"}–${spot?.depthMax ?? "?"} m`
            : "";
    $: bottomText = spot?.bottomType ? `${spot.bottomType} Boden` : "";
    $: holdingText = spot?.holdingQuality
        ? `Halten: ${spot.holdingQuality}`
        : "";
    $: shelterText = spot?.shelterWindDirections || "";
    $: swellText = spot?.swellInfo || "";
    $: facilities = (spot?.facilities || []).map(
        (f) => facilityLabels[f] || f,
    );
    $: ratingText =
        spot?.rating === null || spot?.rating === undefined
            ? ""
            : `${spot.rating}/5`;
</script>

<article class="card">
    <a class="card-link" href={`/spots/${spot.id}`}>
        {#if imageSrc}
            <img class="card-img" src={imageSrc} alt={spot.name} />
        {/if}

        <div class="card-body">
            <div class="top">
                <div class="title">
                    <span class="icon">{typeIcon}</span>
                    <div>
                        <h3>{spot.name}</h3>
                        {#if spot.spotType}
                            <p class="muted">{spot.spotType}</p>
                        {/if}
                    </div>
                </div>
                {#if ratingText}
                    <span class="badge rating">{ratingText}</span>
                {/if}
            </div>

            {#if spot.region}
                <p class="muted region">📍 {spot.region}</p>
            {/if}

            {#if spot.description}
                <p class="desc">{spot.description}</p>
            {/if}

            <div class="meta">
                {#if depthText}
                    <span class="pill">{depthText}</span>
                {/if}
                {#if bottomText}
                    <span class="pill">{bottomText}</span>
                {/if}
                {#if holdingText}
                    <span class="pill">{holdingText}</span>
                {/if}
                {#if swellText}
                    <span class="pill pill-soft">{swellText}</span>
                {/if}
            </div>

            {#if shelterText}
                <p class="muted small">Schutz: {shelterText}</p>
            {/if}

            {#if facilities.length}
                <div class="facilities">
                    {#each facilities as facility}
                        <span class="chip">{facility}</span>
                    {/each}
                </div>
            {/if}

            {#if spot.notesSkipper}
                <p class="muted small">Skipper: {spot.notesSkipper}</p>
            {/if}

            <p class="coords">{spot.lat}, {spot.lng}</p>
        </div>
    </a>

    {#if showDelete}
        <form method="POST" action={action} class="delete-form">
            <input type="hidden" name="id" value={spot.id} />
            <button type="submit" class="delete-btn">Löschen</button>
        </form>
    {/if}
</article>

<style>
    .card {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border: 1px solid var(--border);
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.08);
        transition: transform 0.16s ease, box-shadow 0.16s ease,
            border-color 0.16s ease;
    }

    .card:hover {
        transform: translateY(-6px);
        border-color: rgba(15, 111, 184, 0.18);
        box-shadow: 0 26px 80px rgba(12, 50, 94, 0.14);
    }

    .card-link {
        color: inherit;
        text-decoration: none;
        display: block;
    }

    .card-img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        display: block;
    }

    .card-body {
        padding: 1.1rem 1.2rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.75rem;
    }

    .title {
        display: flex;
        gap: 0.6rem;
        align-items: center;
    }

    .icon {
        font-size: 1.3rem;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
    }

    .region {
        font-size: 0.92rem;
        margin: 0;
    }

    .desc {
        color: var(--text);
        font-size: 0.95rem;
        line-height: 1.5;
    }

    .muted {
        color: var(--muted);
    }

    .small {
        font-size: 0.9rem;
    }

    .badge {
        display: inline-flex;
        padding: 0.3rem 0.7rem;
        border-radius: 0.8rem;
        background: #f1f5fb;
        color: #0f6fb8;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .rating {
        background: #0f6fb8;
        color: #f8fbff;
        box-shadow: 0 10px 30px rgba(15, 111, 184, 0.18);
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
    }

    .pill {
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: #eef4fb;
        color: #0f6fb8;
        font-size: 0.9rem;
        border: 1px solid rgba(15, 111, 184, 0.18);
    }

    .pill-soft {
        background: #f9fbff;
        color: var(--muted);
        border-color: var(--border);
    }

    .facilities {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
    }

    .chip {
        padding: 0.28rem 0.6rem;
        border-radius: 0.7rem;
        background: #fafbfd;
        border: 1px solid var(--border);
        font-size: 0.85rem;
        color: var(--muted);
    }

    .coords {
        font-size: 0.85rem;
        color: var(--muted);
        margin-top: 0.3rem;
    }

    .delete-form {
        margin: 0.9rem 1.1rem 1.1rem;
    }

    .delete-btn {
        background: #c53030;
        color: white;
        border: 0;
        padding: 0.5rem 0.95rem;
        border-radius: 0.6rem;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(197, 48, 48, 0.25);
        border: 1px solid rgba(197, 48, 48, 0.35);
        transition: transform 0.12s ease, box-shadow 0.12s ease,
            background 0.12s ease;
    }

    .delete-btn:hover {
        background: #a32020;
        transform: translateY(-1px);
    }
</style>
