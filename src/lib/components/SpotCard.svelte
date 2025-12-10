<script>
    export let spot;
    export let action = "?/delete";
    export let showDelete = true;

    const imageList = Array.isArray(spot?.imageDataList)
        ? spot.imageDataList.filter(Boolean)
        : [];
    $: images = imageList.length
        ? imageList
        : (spot?.imageData ? [spot.imageData] : []).filter(Boolean);
    $: fallbackImage = spot?.imageUrl || spot?.imageData || null;
    let activeIndex = 0;
    $: activeImage = images[activeIndex] || fallbackImage;

    function nextImage() {
        if (!images.length) return;
        activeIndex = (activeIndex + 1) % images.length;
    }

    function prevImage() {
        if (!images.length) return;
        activeIndex = (activeIndex - 1 + images.length) % images.length;
    }
</script>

<article class="card">
    <a class="card-link" href={`/spots/${spot.id}`}>
        <div
            class="card-bg"
            style={activeImage
                ? `background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 70%), url(${activeImage})`
                : ""}
        >
            {#if images.length > 1}
                <button
                    class="nav prev"
                    type="button"
                    on:click|preventDefault={prevImage}
                    aria-label="Vorheriges Bild"
                >
                    ‹
                </button>
                <button
                    class="nav next"
                    type="button"
                    on:click|preventDefault={nextImage}
                    aria-label="Nächstes Bild"
                >
                    ›
                </button>
                <div class="dots">
                    {#each images as img, idx}
                        <span class:selected={idx === activeIndex}></span>
                    {/each}
                </div>
            {/if}
            <div class="info">
                <h3>{spot.name}</h3>
                {#if spot.region}
                    <p class="muted region">📍 {spot.region}</p>
                {/if}
            </div>
        </div>
    </a>

    {#if showDelete}
        <form method="POST" {action} class="delete-form">
            <input type="hidden" name="id" value={spot.id} />
            <button type="submit" class="delete-btn">Löschen</button>
        </form>
    {/if}
</article>

<style>
    .card {
        position: relative;
        border-radius: 1.2rem;
        overflow: hidden;
        box-shadow: 0 18px 50px rgba(12, 50, 94, 0.12);
        transition:
            transform 0.16s ease,
            box-shadow 0.16s ease;
        min-height: 260px;
        background: #e9eef6;
    }

    .card:hover {
        transform: translateY(-6px);
        box-shadow: 0 26px 80px rgba(12, 50, 94, 0.16);
    }

    .card-link {
        color: inherit;
        text-decoration: none;
        display: block;
        height: 100%;
    }

    .card-bg {
        height: 100%;
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.2)
        );
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .info {
        position: absolute;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        color: #f5f7fb;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
    }

    h3 {
        margin: 0 0 0.15rem;
        font-size: 1.25rem;
        color: #f8fbff;
    }

    .region {
        font-size: 0.95rem;
        margin: 0;
        color: #e6ebf5;
    }

    .muted {
        color: #d9e1ee;
    }

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(0, 0, 0, 0.08);
        color: #0f172a;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    }

    .nav.prev {
        left: 10px;
    }

    .nav.next {
        right: 10px;
    }

    .dots {
        position: absolute;
        left: 50%;
        bottom: 0.65rem;
        transform: translateX(-50%);
        display: flex;
        gap: 0.35rem;
    }

    .dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .dots span.selected {
        background: #fff;
    }

    .delete-form {
        position: absolute;
        right: 0.8rem;
        bottom: 0.8rem;
        margin: 0;
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
        transition:
            transform 0.12s ease,
            box-shadow 0.12s ease,
            background 0.12s ease;
    }

    .delete-btn:hover {
        background: #a32020;
        transform: translateY(-1px);
    }
</style>
