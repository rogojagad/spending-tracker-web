<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { authStore } from "$lib/stores/auth";
  import { afterNavigate, goto } from "$app/navigation";
  import type { AfterNavigate } from "@sveltejs/kit";
  import { page } from "$app/state";

  let checkSessionInterval: NodeJS.Timeout;
  let isLoginPage = $state(true);
  let isMenuOpen = $state(false);
  let menuElement = $state<HTMLElement>();
  let menuButton = $state<HTMLButtonElement>();

  let { children } = $props();

  afterNavigate((navigation: AfterNavigate) => {
    const destinationRoute = navigation.to?.route.id || "";
    isLoginPage = destinationRoute === "/login";
    isMenuOpen = false;
  });

  onMount(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        !menuElement?.contains(target) &&
        !menuButton?.contains(target)
      ) {
        isMenuOpen = false;
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape" && isMenuOpen) {
        isMenuOpen = false;
        menuButton?.focus();
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeydown);

    checkSessionInterval = setInterval(() => {
      if (!isLoginPage && !authStore.isSessionValid()) {
        goto("/login", { replaceState: true });
      }
    }, 6000);

    return () => {
      clearInterval(checkSessionInterval);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  const navItems = [
    { href: "/", label: "Overview" },
    { href: "/manual-entry", label: "Add spending" },
    { href: "/limit", label: "Limits" },
    { href: "/summary", label: "Summary" },
  ];

  function isCurrentRoute(href: string) {
    return page.url.pathname === href;
  }
</script>

<div class="app">
  <header class="app-header">
    <div class="header-content">
      <a class="site-title" href="/" aria-label="Spending Tracker overview">
        <span class="brand-mark" aria-hidden="true">S</span>
        <span>Spending</span>
      </a>

      {#if $authStore.isAuthenticated}
        <div class="header-right">
          <nav class="header-nav">
            <button
              bind:this={menuButton}
              class="mobile-menu-btn"
              type="button"
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              onclick={() => (isMenuOpen = !isMenuOpen)}
            >
              <span class="menu-line"></span>
              <span class="menu-line"></span>
              <span class="menu-line"></span>
            </button>
            <ul
              bind:this={menuElement}
              id="primary-navigation"
              class:open={isMenuOpen}
              class="nav-links"
            >
              {#each navItems as item}
                <li>
                  <a
                    href={item.href}
                    class:active={isCurrentRoute(item.href)}
                    class="nav-link"
                    aria-current={isCurrentRoute(item.href)
                      ? "page"
                      : undefined}>{item.label}</a
                  >
                </li>
              {/each}
            </ul>
          </nav>
          <button
            class="btn secondary logout-btn"
            onclick={() => {
              authStore.logout();
              goto("/login");
            }}>Logout</button
          >
        </div>
      {/if}
    </div>
  </header>

  <main class="main-content">
    {@render children()}
  </main>

  <footer class="app-footer">
    <div class="footer-content">
      <p>© {new Date().getFullYear()} OTRW - Spending Tracker</p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--background-elevated);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(24px) saturate(180%);
  }

  .header-content {
    max-width: var(--content-width);
    margin: 0 auto;
    min-height: 64px;
    padding: 0.55rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .site-title {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--text-primary);
    font-size: 1.02rem;
    font-weight: 650;
    letter-spacing: -0.015em;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .site-title:active {
    opacity: 0.65;
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(145deg, #1687f8, #0066cc);
    color: white;
    font-size: 0.86rem;
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.24);
  }

  .logout-btn {
    min-height: 38px;
    font-size: 0.82rem;
    padding: 0.35rem 0.85rem;
  }

  .main-content {
    flex: 1;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
    padding: clamp(2rem, 6vw, 4.5rem) 1.5rem;
  }

  .app-footer {
    color: var(--text-hint);
    padding: 1.25rem 0;
    font-size: 0.75rem;
  }

  .footer-content {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 0 1.5rem;
    text-align: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-nav {
    margin: 0;
  }

  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 0.2rem;
  }

  .nav-link {
    display: inline-flex;
    min-height: 38px;
    align-items: center;
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 550;
    font-size: 0.86rem;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    transition:
      background-color 160ms ease,
      color 160ms ease,
      transform 100ms ease-out;
  }

  .nav-link:hover {
    background-color: rgba(118, 118, 128, 0.09);
    text-decoration: none;
  }

  .nav-link.active {
    color: var(--text-primary);
    background-color: rgba(118, 118, 128, 0.13);
  }

  .nav-link:active {
    transform: scale(0.96);
  }

  .mobile-menu-btn {
    display: none;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    background: rgba(118, 118, 128, 0.09);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-menu-btn:active {
    transform: scale(0.94);
  }

  .menu-line {
    width: 17px;
    height: 1.5px;
    border-radius: 2px;
    background: var(--text-primary);
  }

  @media (max-width: 768px) {
    .header-content {
      min-height: 58px;
      padding: 0.45rem 1rem;
    }

    .header-right {
      position: relative;
    }

    .mobile-menu-btn {
      display: flex;
    }

    .nav-links {
      display: flex;
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: min(280px, calc(100vw - 2rem));
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(30px) saturate(180%);
      flex-direction: column;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px) scale(0.97);
      transform-origin: top right;
      pointer-events: none;
      transition:
        opacity 180ms ease,
        transform 320ms var(--spring-ease),
        visibility 180ms;
    }

    .nav-links.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .nav-link {
      min-height: 48px;
      padding: 0.75rem 1rem;
      width: 100%;
      border-radius: 12px;
    }

    .logout-btn {
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
    }

    .main-content {
      padding-inline: 1rem;
    }

    .app-footer {
      display: none;
    }
  }

  @media (prefers-reduced-transparency: reduce) {
    .app-header,
    .nav-links {
      background: #ffffff;
      backdrop-filter: none;
    }
  }
</style>
