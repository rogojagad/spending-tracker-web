<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth, downloadSpendingSummary } from "$lib/api";
  import type {
    MonthSpendingSummary,
    SpendingCategory,
    SpendingSummary,
  } from "$lib/interfaces";
  import { authStore } from "$lib/stores/auth";
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

  async function downloadFile() {
    const csvContent = await downloadSpendingSummary();
    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(file);

    // Create a temporary anchor element, set download attributes, and click it
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "spending-summary.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary URL and element
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
</script>

<div class="card data-table-card">
  <div class="card-header">
    <h3>Monthly Summary For Categories</h3>

    <button
      class="btn primary download-button"
      onclick={() => {
        downloadFile();
      }}>Download as CSV</button
    >
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

<style>
  .card-header {
    display: grid;
    grid-template-columns: 2fr auto;
    align-items: center;
  }

  .download-button {
    margin-bottom: 16px;
  }
</style>
