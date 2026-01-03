<script>
    import SpotCard from "./SpotCard.svelte";

    export let spots = [];
    export let action = "?/delete";
    export let favoriteAction = "?/favorite";
    export let canFavorite = false;
</script>

<div class="grid">
    {#each spots as spot}
        <SpotCard
            {spot}
            {action}
            {favoriteAction}
            showDelete={spot.canDelete}
            {canFavorite}
        />
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        gap: 1.4rem;
        margin-top: 1.2rem;
    }
</style>
