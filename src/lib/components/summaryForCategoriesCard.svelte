<script lang="ts">
  import type {
    MonthSpendingSummary,
    SpendingCategory,
    SpendingSummary,
  } from "$lib/interfaces";
  import dayjs from "dayjs";
  import { onMount } from "svelte";

  interface SummaryTableProps {
    categories: SpendingCategory[];
    monthSummaries: MonthSpendingSummary[];
  }

  let { categories, monthSummaries }: SummaryTableProps = $props();
  let isLoading = $derived(
    monthSummaries.length === 0 || categories.length === 0,
  );
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

            {#each categories as category}
              <th>{category.name}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each monthSummaries as monthSummary}
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
