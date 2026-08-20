<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth } from "$lib/api";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";

  let password = "";
  let isLoading = false;
  let error = "";

  async function verifyPassword() {
    if (!password) {
      error = "Enter your password to continue.";
      return;
    }

    isLoading = true;
    error = "";

    try {
      const { token } = await auth(password);

      if (token) {
        authStore.authenticate(token);
        goto("/");
      } else {
        error = "That password isn’t correct.";
      }
    } catch (_err) {
      error = "We couldn’t verify your password. Try again.";
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

<div class="login-container">
  <div class="login-card card">
    <div class="login-icon" aria-hidden="true">S</div>
    <h1>Welcome back</h1>
    <p class="subtitle">Sign in to view and manage your spending.</p>

    <form
      onsubmit={(event) => {
        event.preventDefault();
        verifyPassword();
      }}
      class="login-form"
    >
      <div class="form-group">
        <label for="password">Password</label>

        <input
          type="password"
          name="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          autocomplete="current-password"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      {#if error}
        <div id="login-error" class="error-message" role="alert">{error}</div>
      {/if}

      <button
        type="submit"
        class="btn primary login-button"
        disabled={isLoading}
      >
        {isLoading ? "Signing in…" : "Continue"}</button
      >
    </form>
  </div>
</div>

<style>
  .login-container {
    display: grid;
    place-items: center;
    min-height: min(640px, calc(100vh - 190px));
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: clamp(2rem, 6vw, 3rem);
    text-align: center;
  }

  .login-icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    margin: 0 auto 1.5rem;
    border-radius: 17px;
    background: linear-gradient(145deg, #1687f8, #0066cc);
    box-shadow: 0 12px 28px rgba(0, 113, 227, 0.25);
    color: white;
    font-size: 1.35rem;
    font-weight: 700;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    margin: 0.65rem 0 2rem;
  }

  .login-form {
    text-align: left;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .login-button {
    width: 100%;
    margin-top: 0.5rem;
  }
</style>
