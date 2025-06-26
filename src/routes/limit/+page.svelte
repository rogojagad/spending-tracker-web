<script lang="ts">
  import { getSpendingLimits } from "$lib/api";
  import type { Limit } from "$lib/interfaces";
  import { onMount } from "svelte";

  let isLoading = $state(true);
  let limits: Limit[] = $state([]);

  onMount(async () => {
    isLoading = false;

    limits = await getSpendingLimits();
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
  {/if}

  {#each limits as limit}
    <div class="card">
      <h3>{limit.name}</h3>
      <p>{limit.value.toIDRString()}</p>
    </div>
  {/each}
</div>

<style></style>
