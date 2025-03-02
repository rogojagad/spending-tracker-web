<script lang="ts">
  import "../app.css";
</script>

<div class="app">
  <header class="app-header">
    <div class="header-content">
      <h1 class="site-title">Spending Tracker</h1>
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
  }

  .site-title {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
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
