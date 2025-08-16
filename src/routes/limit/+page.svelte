<script lang="ts">
  import { getSpendingLimits } from "$lib/api";
  import LimitItem from "$lib/components/limitItem.svelte";
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

<section class="page-header">
  <h2>Spending Limit</h2>
  <p class="subtitle">View your spending limit</p>
</section>

{#if isLoading}
  <p>Loading data...</p>
{:else}
  <div class="ui-option">
    <div class="compact-list">
      {#each limits as limit}
        <LimitItem {limit} />
      {/each}
    </div>
  </div>
{/if}

<style>
  .ui-option {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 40px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  /* Option 3: Compact List */
  .compact-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
</style>
