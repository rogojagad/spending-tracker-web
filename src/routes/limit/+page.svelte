<script lang="ts">
  import { getSpendingLimits } from "$lib/api";
  import type { Limit } from "$lib/interfaces";
  import { onMount } from "svelte";

  let isLoading = $state(true);
  let limits: Limit[] = $state([]);

  onMount(async () => {
    limits = await getSpendingLimits();
    isLoading = false;
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Limit</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <h2>Spending Limit</h2>
    <p class="subtitle">View your spending limit</p>
  </section>

  {#if isLoading}
    <p>Loading data...</p>
  {:else}
    {#each limits as limit}
      <div class="card">
        <h3>{limit.name}</h3>
        <p><strong>Limit:</strong> {limit.value.toIDRString()}</p>
        <p>
          <strong>Remaining Limit (Amount):</strong>
          {(limit.value - limit.usedValue).toIDRString()}
        </p>
        <p>
          <strong>Used Limit (Amount):</strong>
          {limit.usedValue.toIDRString()}
        </p>
        <p>
          <strong>Applied Category:</strong>
          {limit.categoryName ?? "-"}
        </p>
        <p>
          <strong>Applied Source:</strong>
          {limit.sourceName ?? "-"}
        </p>
      </div>
    {/each}
  {/if}
</div>

<style></style>
