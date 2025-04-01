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
        <button
          class="btn secondary logout-btn"
          onclick={() => {
            authStore.logout();
            goto("/login");
          }}>Logout</button
        >
      {/if}
    </div>
  </header>

  {#if !isLoginPage}
    <nav
      class="sidebar"
      class:expanded={isNavbarHovered}
      onmouseenter={() => (isNavbarHovered = true)}
      onmouseleave={() => (isNavbarHovered = false)}
    >
      <ul class="nav-links">
        <li>
          <a href="/" class="nav-link">
            <span class="icon">📊</span>
            <span class="link-text">Overview</span>
          </a>
        </li>
        <li>
          <a href="/summary" class="nav-link">
            <span class="icon">📝</span>
            <span class="link-text">Summary</span>
          </a>
        </li>
      </ul>
    </nav>
  {/if}

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

  .sidebar {
    position: fixed;
    top: 64px; /* Adjust this value based on your header height */
    left: 0;
    height: calc(100vh - 64px); /* Viewport height minus header height */
    background-color: #f8f9fa;
    width: 60px;
    transition: width 0.3s ease;
    overflow: hidden;
    border-right: 1px solid #e9ecef;
    z-index: 100; /* Ensure sidebar appears above page content */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .sidebar.expanded {
    width: 200px;
  }

  .nav-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 1rem;
    color: #495057;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .nav-link:hover {
    background-color: #e9ecef;
  }

  .icon {
    font-size: 1.2rem;
    min-width: 24px;
  }

  .link-text {
    margin-left: 1rem;
    white-space: nowrap;
  }
</style>
