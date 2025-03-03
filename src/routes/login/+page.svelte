<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";

  let password = "";
  let isLoading = false;
  let error = "";

  async function verifyPassword() {
    if (!password) {
      error = "Please enter a password";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const data = { isAllowed: true }; // TODO: implement actual auth on API

      if (data.isAllowed) {
        authStore.authenticate();
        goto("/");
      } else {
        error = "Invalid password";
      }
    } catch (error) {
      error = "Failed when verifying password. Please try again";
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    if (authStore.isSessionValid()) {
      goto("/");
    }
  });
</script>

<svelte:head>
  <title>Login - Spending Tracker</title>
</svelte:head>

<class class="login-container">
  <div class="login-card">
    <h1>Spending Tracker</h1>
    <p class="subtitle">Enter password to access your data</p>

    <form on:submit|preventDefault={verifyPassword} class="login-form">
      <div class="form-group">
        <label for="password">Password</label>

        <input
          type="password"
          name="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          autocomplete="current-password"
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button
        type="submit"
        class="btn primary login-button"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Login"}</button
      >
    </form>
  </div>
</class>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    padding: 1rem;
  }

  .login-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }

  .login-form {
    text-align: left;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .login-button {
    width: 100%;
    margin-top: 1rem;
  }

  .error-message {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: rgba(211, 47, 47, 0.1);
  }
</style>
