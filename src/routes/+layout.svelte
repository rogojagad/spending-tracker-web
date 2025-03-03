<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";

  let checkSessionInterval: number;

  onMount(() => {
    checkSessionInterval = setInterval(() => {
      if (
        window.location.pathname !== "/login" &&
        !authStore.isSessionValid()
      ) {
        goto("/login");
      }
    }, 60000);

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
          on:click={() => {
            authStore.logout();
            goto("/login");
          }}>Logout</button
        >
      {/if}
    </div>
  </header>

  <main class="main-content">
    <slot />
  </main>

  <footer class="app-footer">
    <div class="footer-content">
      <p>© {new Date().getFullYear()} Spending Tracker</p>
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
</style>
