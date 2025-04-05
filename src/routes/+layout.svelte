<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { authStore } from "$lib/stores/auth";
  import { afterNavigate, goto } from "$app/navigation";
  import type { AfterNavigate } from "@sveltejs/kit";

  let checkSessionInterval: NodeJS.Timeout;
  let isNavbarHovered = $state(false);
  let isLoginPage = $state(true);

  let { children } = $props();

  afterNavigate((navigation: AfterNavigate) => {
    const destinationRoute = navigation.to?.route.id || "";
    isLoginPage = destinationRoute === "/login";
  });

  onMount(() => {
    checkSessionInterval = setInterval(() => {
      if (!isLoginPage && !authStore.isSessionValid()) {
        goto("/login", { replaceState: true });
      }
    }, 6000);

    return () => {
      clearInterval(checkSessionInterval);
    };
  });
</script>

<div class="app">
  <header class="app-header">
    <div class="header-content">
      <h1 class="site-title">Spending Tracker</h1>

      {#if $authStore.isAuthenticated}
        <div class="header-right">
          <nav class="header-nav">
            <button class="mobile-menu-btn">☰</button>
            <ul class="nav-links">
              <li><a href="/" class="nav-link">Overview</a></li>
              <li><a href="/summary" class="nav-link">Summary</a></li>
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
    background-color: #78909c;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .site-title {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
  }

  .logout-btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .main-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;
  }

  .app-footer {
    background-color: #f5f5f5;
    color: #666;
    padding: 1rem 0;
    margin-top: 2rem;
    font-size: 0.8rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
  }

  .header-nav {
    margin: 0 2rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-nav {
    margin: 0; /* Remove the previous margin */
  }

  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 1rem;
    }

    .header-right {
      position: relative;
    }

    .mobile-menu-btn {
      display: block;
    }

    .nav-links {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #78909c;
      flex-direction: column;
      min-width: 200px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      margin-top: 0.5rem;
    }

    .header-nav:hover .nav-links,
    .header-nav:focus-within .nav-links {
      display: flex;
    }

    .nav-link {
      padding: 0.75rem 1rem;
      width: 100%;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
    }
  }
</style>
