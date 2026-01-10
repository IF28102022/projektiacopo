<script>
    import { page } from "$app/stores";

    const links = [
        { href: "/spots", label: "Spots" },
        { href: "/map", label: "Karte" },
        { href: "/routen", label: "Routen" },
        { href: "/tour-planning", label: "Tourplanung" }
    ];

    $: user = $page.data?.user || null;
    $: canCreate = user && (user.role === "user" || user.role === "admin");
</script>

<header class="topbar">
    <div class="container">
        <a class="brand" href="/" aria-label="SailSpots Home">
            <img class="logo" src="/Logo.png" alt="SailSpots Logo" />
            <span class="brand-text">SailSpots</span>
        </a>

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

        <div class="actions">
            {#if canCreate}
                <a class="ghost" href="/spots/new">Neuer Spot</a>
            {/if}
            {#if user}
                <span class="user-pill">
                    {user.email} · {user.role}
                </span>
                <a class="ghost" href="/logout">Logout</a>
            {:else}
                <a class="ghost" href="/login">Login</a>
            {/if}
        </div>
    </div>
</header>

<style>
    .topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    }

    .container {
        width: min(1180px, 100%);
        margin: 0 auto;
        padding: 0.85rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: space-between;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #0f1f1f;
        font-size: 0.95rem;
        text-decoration: none;
    }

    .brand:hover {
        opacity: 0.9;
    }

    .logo {
        width: 42px;
        height: 42px;
        object-fit: contain;
        display: block;
    }

    .nav {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .nav a {
        text-decoration: none;
        color: #1d2b38;
        font-weight: 600;
        padding: 0.35rem 0.65rem;
        border-radius: 0.5rem;
        border: 1px solid transparent;
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease,
            opacity 0.12s ease;
    }

    .nav a:hover {
        color: #0f1f1f;
        border-color: rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.6);
        opacity: 0.9;
    }

    .nav a.selected {
        color: #0b1f35;
        background: rgba(15, 23, 42, 0.08);
        border-color: rgba(15, 23, 42, 0.1);
        box-shadow: none;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .ghost {
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 0.45rem 0.9rem;
        border-radius: 0.65rem;
        text-decoration: none;
        color: #1d2b38;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.9);
        transition:
            color 0.12s ease,
            border-color 0.12s ease,
            background 0.12s ease,
            transform 0.12s ease;
    }

    .ghost:hover {
        border-color: rgba(15, 23, 42, 0.18);
        color: #0f1f1f;
        background: #ffffff;
        transform: translateY(-1px);
    }

    .user-pill {
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.06);
        color: #0f1f1f;
        font-weight: 600;
        border: 1px solid rgba(15, 23, 42, 0.08);
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
