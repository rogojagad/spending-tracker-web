<script lang="ts">
  import { getSpendingLimits } from "$lib/api";
  import LimitItem from "$lib/components/limitItem.svelte";
  import LoadingState from "$lib/components/loadingState.svelte";
  import type { Limit } from "$lib/interfaces";
  import { onMount } from "svelte";

  let isLoading = $state(true);
  let limits: Limit[] = $state([]);
  let loadError = $state("");

  onMount(async () => {
    try {
      limits = await getSpendingLimits();
    } catch {
      loadError = "We couldn’t load your limits. Try again.";
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Limit</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <p class="eyebrow">Limits</p>
    <h1>Stay ahead of your spending.</h1>
    <p class="subtitle">
      See what’s available before you make the next purchase.
    </p>
  </section>

  {#if loadError}
    <div class="error-message" role="alert">{loadError}</div>
  {/if}

  <div class="card compact-list">
    {#if isLoading}
      <LoadingState message="Checking your limits…" />
    {:else if limits.length === 0}
      <div class="empty-state">
        <h2>No limits yet</h2>
        <p>Create a limit to track progress here.</p>
      </div>
    {:else}
      {#each limits as limit (limit.id)}
        <LimitItem {limit} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .eyebrow {
    margin-bottom: 0.45rem;
    color: var(--color-accent);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .compact-list {
    padding: 0;
    overflow: hidden;
  }

  .empty-state {
    padding: 4rem 1.5rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .empty-state h2 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 1.3rem;
  }
</style>
