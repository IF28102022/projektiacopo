<script>
    // einfach JS, kein TS:
    export let data;
</script>

<main class="page">
    <section class="section">
        <header class="header">
            <div>
                <h1>Spots Übersicht</h1>
                <p class="subtitle">
                    Alle gespeicherten Segel-Spots aus der Datenbank.
                </p>
            </div>
            <a href="/spots/new" class="btn">Neuen Spot hinzufügen</a>
        </header>

        {#if data.spots.length === 0}
            <p>Noch keine Spots gespeichert.</p>
        {:else}
            <ul class="list">
                {#each data.spots as spot}
                    <li class="item">
                        <div class="item-main">
                            <div>
                                <strong>{spot.name}</strong> – {spot.region}<br
                                />
                                ({spot.lat}, {spot.lng})
                            </div>

                            <!-- Lösch-Button -->
                            <form
                                method="POST"
                                action="?/delete"
                                class="delete-form"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={spot.id}
                                />
                                <button type="submit" class="delete-btn">
                                    Löschen
                                </button>
                            </form>
                        </div>
                    </li>
                {/each}
            </ul>
        {/if}
    </section>
</main>

<style>
    .page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 2rem 1.5rem;
    }
    .section {
        width: 100%;
        max-width: 1040px;
        background: rgba(15, 23, 42, 0.85);
        border-radius: 1rem;
        border: 1px solid rgba(55, 65, 81, 0.8);
        padding: 1.5rem 1.5rem 2rem;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    h1 {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
    }
    .subtitle {
        margin: 0;
        color: #9ca3af;
        font-size: 0.9rem;
    }
    .btn {
        text-decoration: none;
        background: #0ea5e9;
        color: #0b1120;
        padding: 0.6rem 1.1rem;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 500;
        border: none;
    }
    .list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .item {
        font-size: 0.95rem;
    }

    .item-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
    }

    .delete-form {
        margin: 0;
    }

    .delete-btn {
        background: #dc2626;
        color: #fff;
        border: none;
        padding: 0.35rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.15s ease;
    }

    .delete-btn:hover {
        background: #ef4444;
    }
</style>
