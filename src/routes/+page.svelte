<script lang="ts">
  import dayjs from "dayjs";
  import "../types/number";
  import "../types/dayjs";
  import type {
    Spending,
    SpendingCategory,
    DateRange,
    SpendingFilter,
    SpendingSource,
    Payday,
  } from "$lib/interfaces";
  import DateRangeFilter from "$lib/components/dateRangeFilter.svelte";
  import {
    getAllCategories,
    getAllSources,
    getLatestPayday,
    getManySpendings,
  } from "$lib/api";

  import { onMount } from "svelte";
  import { dateRangeNameToDateValueMap } from "$lib/constants";
  import DropdownFilter from "$lib/components/dropdownFilter.svelte";
  import { formatAppliedFilterHint } from "$lib/util/messageFormatter";

  let isLoading = false; // For future filter operations
  let spendings: Spending[] = $state([]);
  let sources: SpendingSource[] = $state([]);
  let categories: SpendingCategory[] = $state([]);
  let spentAtRangeOptions: Map<string, DateRange> | undefined = $state();
  let appliedFilterHint: string = $state("");

  let latestPayday: Payday | undefined;

  let selectedCategoryId: string = $state("ALL");
  let selectedSourceId: string = $state("ALL");
  let selectedSpentAtRange: DateRange = $state(
    dateRangeNameToDateValueMap.get("Today")!,
  );

  const totalAmount = $derived(
    spendings.reduce((prev, next) => {
      return prev + next.amount;
    }, 0),
  );
  const totalPrimary = $derived(
    spendings
      .filter((spending) => {
        return spending.categoryName === "Primary";
      })
      .reduce((prev, next) => {
        return prev + next.amount;
      }, 0),
  );
  const totalSecondary = $derived(
    spendings
      .filter((spending) => {
        return spending.categoryName === "Secondary";
      })
      .reduce((prev, next) => {
        return prev + next.amount;
      }, 0),
  );
  const totalTernary = $derived(
    spendings
      .filter((spending) => {
        return spending.categoryName === "Ternary";
      })
      .reduce((prev, next) => {
        return prev + next.amount;
      }, 0),
  );

  async function handleFilterSubmitted() {
    const filterQuery: SpendingFilter = {
      fromInclusive: selectedSpentAtRange.fromInclusive,
      toExclusive: selectedSpentAtRange.toExclusive,
    };

    if (selectedCategoryId !== "ALL") filterQuery.category = selectedCategoryId;
    if (selectedSourceId !== "ALL") filterQuery.source = selectedSourceId;

    spendings = await getManySpendings(filterQuery);

    appliedFilterHint = formatAppliedFilterHint(
      categories.find((category) => category.id === selectedCategoryId)?.name ??
        "ALL",
      sources.find((source) => source.id === selectedSourceId)?.name || "ALL",
      selectedSpentAtRange.fromInclusive,
      selectedSpentAtRange.toExclusive,
    );
  }

  onMount(async () => {
    [spendings, categories, sources, latestPayday] = await Promise.all([
      getManySpendings({}),
      getAllCategories(),
      getAllSources(),
      getLatestPayday(),
    ]);

    categories.unshift({ id: "ALL", name: "All Categories", priority: 0 });
    sources.unshift({ id: "ALL", name: "All Sources", isActive: true });
    spentAtRangeOptions = dateRangeNameToDateValueMap.set(
      "This Payday Period",
      {
        fromInclusive: dayjs(latestPayday.paydayDate).toISOString(),
        toExclusive: dayjs().toISOString(),
      },
    );

    appliedFilterHint = appliedFilterHint = formatAppliedFilterHint(
      categories.find((category) => category.id === selectedCategoryId)?.name ??
        "ALL",
      sources.find((source) => source.id === selectedSourceId)?.name || "ALL",
      selectedSpentAtRange.fromInclusive,
      selectedSpentAtRange.toExclusive,
    );
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Overview</title>
</svelte:head>

<div class="page-container">
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  {/if}

  <section class="page-header">
    <h2>Spending Overview</h2>
    <p class="subtitle">View your spending records</p>
  </section>

  <div class="dashboard-grid">
    <!-- Summary card -->
    <div class="card amount-summary-card">
      <h3>Total Spending</h3>
      <p>{totalAmount.toIDRString()}</p>
    </div>

    <!-- Future cards for other statistics could go here -->
  </div>

  <div class="dashboard-grid">
    <!-- Summary card -->
    <div class="card amount-primary-card">
      <h3>Primary</h3>
      <p>{totalPrimary.toIDRString()}</p>
    </div>
    <div class="card amount-secondary-card">
      <h3>Secondary</h3>
      <p>{totalSecondary.toIDRString()}</p>
    </div>
    <div class="card amount-ternary-card">
      <h3>Ternary</h3>
      <p>{totalTernary.toIDRString()}</p>
    </div>

    <!-- Future cards for other statistics could go here -->
  </div>

  <!-- Spending records table -->
  <div class="card data-table-card">
    <div class="card-header">
      <h3>Spending Records</h3>

      <form
        class="card-actions"
        onsubmit={(e) => {
          e.preventDefault();
          handleFilterSubmitted();
        }}
      >
        <DropdownFilter
          bind:value={selectedCategoryId}
          data={{
            placeholder: "Categories",
            title: "Filter by Category",
            options: categories.map((category) => ({
              value: category.id,
              name: category.name,
            })),
          }}
        />

        <DropdownFilter
          bind:value={selectedSourceId}
          data={{
            placeholder: "Sources",
            title: "Filter by Source",
            options: sources
              .filter((source) => source.isActive)
              .map((source) => ({
                value: source.id,
                name: source.name,
              })),
          }}
        />

        <DateRangeFilter
          bind:value={selectedSpentAtRange}
          data={{
            id: "spent-at-range",
            title: "Filter by Spent At",
            placeholder: "Spent at",
            options:
              spentAtRangeOptions
                ?.keys()
                .map((key) => ({
                  name: key,
                  value: spentAtRangeOptions!!.get(key)!!,
                }))
                .toArray() ?? [],
          }}
        />

        <div class="filter-button">
          <button type="submit" class="btn primary" disabled={isLoading}>
            {isLoading ? "Filtering..." : "Filter"}</button
          >
        </div>
      </form>
    </div>

    <p>{@html appliedFilterHint}</p>

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
                <td>{dayjs(spending.createdAt).format("ddd, DD MMM YYYY")}</td>
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
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card-actions {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .amount-summary-card {
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
  }

  .amount-primary-card {
    background-color: var(--color-green-light);
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-green-dark);
  }

  .amount-secondary-card {
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    background-color: var(--color-blue-light);
    color: var(--color-blue-dark);
  }

  .amount-ternary-card {
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    background-color: #fff3e0;
    color: #795548;
  }

  .card-header {
    display: flexbox;
    align-items: center;
    margin-bottom: 1.5rem;
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
    background-color: var(--color-blue-light);
    color: var(--text-primary);
  }

  /* Tertiary category (lowest urgency) */
  .category-badge.tertiary {
    background-color: #fff3e0;
    color: #795548;
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

    .card-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filter-button {
      margin-top: 0.5rem;
      padding-top: 0;
    }

    .filter-button button {
      width: 100%;
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

  .filter-button {
    grid-column-start: -1;
  }
</style>
