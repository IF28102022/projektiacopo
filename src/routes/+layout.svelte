<script>
	import "leaflet/dist/leaflet.css";
</script>

<header class="topbar">
	<div class="topbar-inner">
		<div class="logo">⛵ SegelSpots</div>
		<nav class="nav">
			<a href="/" class="nav-link">Home</a>
			<a href="/spots" class="nav-link">Spots</a>
			<a href="/map" class="nav-link">Karte</a>
			<a href="/ai" class="nav-link">KI</a>
		</nav>
	</div>
</header>

<!-- Hier wird der Inhalt der einzelnen Seiten angezeigt -->
<slot />

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: rgba(15, 23, 42, 0.96);
		border-bottom: 1px solid rgba(55, 65, 81, 0.7);
		backdrop-filter: blur(10px);
	}

	.topbar-inner {
		max-width: 1040px;
		margin: 0 auto;
		padding: 0.75rem 1.25rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-size: 0.95rem;
	}

	.nav {
		display: flex;
		gap: 0.75rem;
	}

	.nav-link {
		font-size: 0.9rem;
		color: #9ca3af;
		text-decoration: none;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		border: 1px solid transparent;
	}

	.nav-link:hover {
		color: #e5e7eb;
		border-color: rgba(148, 163, 184, 0.4);
		background: rgba(15, 23, 42, 0.7);
	}
</style>
