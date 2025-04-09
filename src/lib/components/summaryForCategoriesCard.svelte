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

<div class="card data-table-card">
  <div class="card-header">
    <h3>Monthly Summary For Categories</h3>
  </div>

  <div class="table-container">
    {#if isLoading}
      <p>Loading....</p>
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
