<script>
    import { page } from "$app/stores";

    const links = [
        { href: "/", label: "Home" },
        { href: "/spots", label: "Spots" },
        { href: "/map", label: "Karte" },
        { href: "/ai", label: "KI" },
    ];
</script>

<header class="topbar">
    <div class="container">
        <div class="brand">
            <span class="emoji" aria-hidden="true">⛵️</span>
            <div>
                <p class="brand-name">Segelspots</p>
                <p class="brand-sub">ruhig & klar</p>
            </div>
        </div>

        <nav class="nav">
            {#each links as link}
                <a
                    href={link.href}
                    class:selected={link.href === "/"
                        ? $page.url.pathname === "/"
                        : $page.url.pathname.startsWith(link.href)}
                    aria-current={link.href === "/"
                        ? $page.url.pathname === "/"
                            ? "page"
                            : undefined
                        : $page.url.pathname.startsWith(link.href)
                          ? "page"
                          : undefined}
                >
                    {link.label}
                </a>
            {/each}
        </nav>

        <a class="cta" href="/spots/new">Neuer Spot</a>
    </div>
</header>

<style>
    :global(:root) {
        --header-height: 72px;
    }

    .topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
        box-shadow: 0 10px 40px rgba(15, 81, 146, 0.06);
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0 1.25rem;
        min-height: var(--header-height);
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: space-between;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 700;
        color: var(--text);
    }

    .emoji {
        font-size: 1.2rem;
    }

    .brand-name {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.8rem;
    }

    .brand-sub {
        margin: 0;
        color: var(--muted);
        font-size: 0.82rem;
        letter-spacing: 0.02em;
    }

    .nav {
        display: flex;
        gap: 0.6rem;
        align-items: center;
    }

    .nav a {
        text-decoration: none;
        color: var(--muted);
        font-weight: 600;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        border: 1px solid transparent;
        transition: color 0.12s ease, border-color 0.12s ease,
            background 0.12s ease;
    }

    .nav a:hover {
        color: var(--accent);
        border-color: var(--accent-soft);
        background: var(--accent-soft);
    }

    .nav a.selected {
        color: var(--accent);
        background: var(--accent-soft);
        border-color: var(--accent-soft);
    }

    .cta {
        background: var(--accent);
        color: #f8fbff;
        text-decoration: none;
        padding: 0.55rem 1.05rem;
        border-radius: 999px;
        font-weight: 700;
        border: 1px solid transparent;
        box-shadow: 0 12px 35px rgba(15, 111, 184, 0.22);
        transition: transform 0.12s ease, box-shadow 0.12s ease,
            background 0.12s ease;
    }

    .cta:hover {
        background: #0c5c99;
        transform: translateY(-1px);
        box-shadow: 0 14px 40px rgba(12, 92, 153, 0.26);
    }

    @media (max-width: 720px) {
        .container {
            flex-wrap: wrap;
            gap: 0.75rem;
        }

        .nav {
            width: 100%;
            justify-content: flex-start;
            order: 3;
            flex-wrap: wrap;
        }

        .cta {
            order: 2;
        }
    }
</style>
