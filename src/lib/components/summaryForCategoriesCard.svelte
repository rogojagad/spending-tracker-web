<script lang="ts">
  import { downloadSpendingSummary } from "$lib/api";
  import type { MonthSpendingSummary, SpendingCategory } from "$lib/interfaces";
  import dayjs from "dayjs";

  interface SummaryTableProps {
    categories: SpendingCategory[];
    monthSummaries: MonthSpendingSummary[];
  }

  let { categories, monthSummaries }: SummaryTableProps = $props();
  let isDownloading = $state(false);
  let downloadMessage = $state("");
  let downloadError = $state("");

  async function downloadFile() {
    isDownloading = true;
    downloadMessage = "";
    downloadError = "";
    try {
      const csvContent = await downloadSpendingSummary();
      const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "spending-summary.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      downloadMessage = "CSV downloaded.";
      setTimeout(() => (downloadMessage = ""), 3000);
    } catch {
      downloadError = "We couldn’t download the CSV. Try again.";
    } finally {
      isDownloading = false;
    }
  }
</script>

<div class="card-header">
  <div>
    <h2>Monthly breakdown</h2>
    <p>Totals by category for every available month.</p>
  </div>

  <button
    class="btn primary download-button"
    disabled={isDownloading}
    onclick={downloadFile}
    >{isDownloading ? "Preparing…" : "Download CSV"}</button
  >
</div>

{#if downloadMessage}
  <div class="success-message" role="status">{downloadMessage}</div>
{:else if downloadError}
  <div class="error-message" role="alert">{downloadError}</div>
{/if}

<div class="table-container">
  {#if monthSummaries.length === 0}
    <div class="empty-state">
      <h3>No summary yet</h3>
      <p>Your monthly totals will appear after you add spending.</p>
    </div>
  {:else}
    <table class="data-table">
      <caption class="sr-only">Monthly spending totals by category</caption>
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th scope="col">Total</th>

          {#each categories as category}
            <th scope="col">{category.name}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each monthSummaries as monthSummary}
          <tr>
            <td>{dayjs(monthSummary.month).formatWithMonthOnly()}</td>
            <td class="amount"
              ><strong>{monthSummary.total.toIDRString()}</strong></td
            >

            {#each monthSummary.summaries as summary}
              <td class="amount">{summary.amount.toIDRString()}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    font-size: 1.45rem;
  }

  .card-header p {
    margin-top: 0.4rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .table-container {
    max-height: 500px;
    overflow-y: auto;
  }

  .data-table {
    width: 100%;
  }

  .data-table thead {
    position: sticky;
    top: 0;
    background-color: var(--background-primary);
    z-index: 10;
  }

  .amount {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .empty-state {
    padding: 4rem 1rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .empty-state h3 {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 600px) {
    .card-header {
      grid-template-columns: 1fr;
    }

    .download-button {
      width: 100%;
    }
  }
</style>
