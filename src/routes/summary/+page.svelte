<script lang="ts">
  import SummaryForCategoriesCard from "$lib/components/summaryForCategoriesCard.svelte";
  import LoadingState from "$lib/components/loadingState.svelte";
  import { getAllCategories, getMonthlySpendingSummaries } from "$lib/api";
  import type { MonthSpendingSummary, SpendingCategory } from "$lib/interfaces";
  import { onMount } from "svelte";

  let categories: SpendingCategory[] = $state([]);
  let summaries: MonthSpendingSummary[] = $state([]);
  let isLoading = $state(true);
  let loadError = $state("");

  onMount(async () => {
    try {
      [summaries, categories] = await Promise.all([
        getMonthlySpendingSummaries(),
        getAllCategories(),
      ]);
    } catch {
      loadError = "We couldn’t load your monthly summary. Try again.";
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Summary</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <p class="eyebrow">Summary</p>
    <h1>See the bigger picture.</h1>
    <p class="subtitle">
      Compare monthly totals and category trends at a glance.
    </p>
  </section>

  {#if loadError}
    <div class="error-message" role="alert">{loadError}</div>
  {/if}

  <div class="card data-table-card">
    {#if isLoading}
      <LoadingState message="Building your monthly summary…" />
    {:else}
      <SummaryForCategoriesCard {categories} monthSummaries={summaries} />
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
</style>
