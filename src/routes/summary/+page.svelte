<script lang="ts">
  import SummaryForCategoriesCard from "$lib/components/summaryForCategoriesCard.svelte";
  import { getAllCategories, getMonthlySpendingSummaries } from "$lib/api";
  import type { MonthSpendingSummary, SpendingCategory } from "$lib/interfaces";
  import { onMount } from "svelte";

  let categories: SpendingCategory[] = $state([]);
  let summaries: MonthSpendingSummary[] = $state([]);
  let isLoading = $derived(categories.length === 0 || summaries.length === 0);

  onMount(async () => {
    [summaries, categories] = await Promise.all([
      getMonthlySpendingSummaries(),
      getAllCategories(),
    ]);
    isLoading = false;
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Summary</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <h2>Spending Summary</h2>
    <p class="subtitle">View your spending summary</p>
  </section>

  <div class="card data-table-card">
    {#if isLoading}
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    {:else}
      <SummaryForCategoriesCard {categories} monthSummaries={summaries} />
    {/if}
  </div>
</div>

<style></style>
