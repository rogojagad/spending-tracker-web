<script lang="ts">
  import dayjs from "dayjs";
  import type { PageData } from "./+page";
  import "../types/number";
  import "../types/dayjs";

  export let data: PageData;

  let { spendings } = data;
  let isLoading = false; // For future filter operations

  $: totalAmount = spendings.reduce((prev, next) => {
    return prev + next.amount;
  }, 0);
</script>

<svelte:head>
  <title>My Spending Tracker</title>
</svelte:head>

<div class="page-container">
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  {/if}

  <section class="page-header">
    <h2>Your Spending Overview</h2>
    <p class="subtitle">View and analyze your spending records</p>
  </section>

  <div class="dashboard-grid">
    <!-- Summary card -->
    <div class="card summary-card">
      <h3>Total Spending</h3>
      <p class="amount">{totalAmount.toIDRString()}</p>
    </div>

    <!-- Future cards for other statistics could go here -->
  </div>

  <!-- Spending records table -->
  <div class="card data-table-card">
    <div class="card-header">
      <h3>Spending Records</h3>
      <div class="card-actions">
        <!-- Future filter/search controls could go here -->
      </div>
    </div>

    {#if spendings.length === 0}
      <div class="empty-state">
        <p>No spending records found.</p>
        <p class="hint">Records you add will appear here.</p>
      </div>
    {:else}
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Source</th>
              <th class="amount-column">Amount</th>
            </tr>
          </thead>
          <tbody>
            {#each spendings as spending (spending.id)}
              <tr>
                <td>{dayjs(spending.createdAt).toFormattedDate()}</td>
                <td class="description-cell">{spending.description}</td>
                <td>
                  {#if spending.categoryName === "Primary"}
                    <span class="category-badge primary"
                      >{spending.categoryName}</span
                    >
                  {:else if spending.categoryName === "Secondary"}
                    <span class="category-badge secondary"
                      >{spending.categoryName}</span
                    >
                  {:else if spending.categoryName === "Ternary"}
                    <span class="category-badge tertiary"
                      >{spending.categoryName}</span
                    >
                  {:else}
                    <span class="category-badge">{spending.categoryName}</span>
                  {/if}
                </td>
                <td>{spending.sourceName}</td>
                <td class="amount-cell">{spending.amount.toIDRString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .page-container {
    width: 100%;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .subtitle {
    color: var(--text-secondary);
    margin-top: -0.5rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .summary-card {
    background-color: var(--color-green-light);
    text-align: center;
  }

  .amount {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-green-dark);
  }

  .data-table-card {
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.8rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  .data-table th {
    font-weight: 600;
    color: var(--text-secondary);
    background-color: var(--color-gray-light);
  }

  .data-table tr:hover {
    background-color: var(--color-blue-light);
  }

  .amount-column {
    text-align: right;
  }

  .amount-cell {
    text-align: right;
    font-family: "Courier New", monospace;
    font-weight: 500;
  }

  .description-cell {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    color: var(--text-primary);
  }

  /* Primary category (highest urgency) */
  .category-badge.primary {
    background-color: #e8f5e9;
    color: #388e3c;
  }

  /* Secondary category (medium urgency) */
  .category-badge.secondary {
    background-color: #fff3e0;
    color: #795548;
  }

  /* Tertiary category (lowest urgency) */
  .category-badge.tertiary {
    background-color: var(--color-blue-light);
    color: var(--text-primary);
  }

  .empty-state {
    padding: 3rem 0;
    text-align: center;
    color: var(--text-hint);
  }

  .hint {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .data-table th,
    .data-table td {
      padding: 0.6rem;
    }

    .description-cell {
      max-width: 150px;
    }
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid var(--color-gray-light);
    border-top-color: var(--color-blue-dark);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
