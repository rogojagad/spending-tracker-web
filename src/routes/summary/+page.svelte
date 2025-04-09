<script lang="ts">
  import { getMonthlySpendingSummaries } from "$lib/api";
  import type { MonthSpendingSummary } from "$lib/interfaces";
  import dayjs from "dayjs";
  import { onMount } from "svelte";

  let monthlySpendingSummaries: MonthSpendingSummary[] = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    monthlySpendingSummaries = await getMonthlySpendingSummaries();
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
    <div class="card-header">
      <h3>Monthly Summary</h3>
    </div>

    <div class="table-container">
      {#if isLoading}
        <p>Loading monthly summary....</p>
      {:else}
        <table class="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Total</th>
              <th>Primary</th>
              <th>Secondary</th>
              <th>Ternary</th>
            </tr>
          </thead>
          <tbody>
            {#each monthlySpendingSummaries as monthSummary}
              <tr>
                <td>{dayjs(monthSummary.month).formatWithMonthOnly()}</td>
                <td><strong>{monthSummary.total.toIDRString()}</strong></td>

                {#each monthSummary.summaries as summary}
                  <td>{summary.amount.toIDRString()}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</div>

<style></style>
