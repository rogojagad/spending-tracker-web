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
  import DateRangeFilter from "$lib/components/formInput/dateRangeInput.svelte";
  import {
    getAllCategories,
    getAllSources,
    getLatestPayday,
    getManySpendings,
  } from "$lib/api";

  import { onMount } from "svelte";
  import { dateRangeNameToDateValueMap } from "$lib/constants";
  import DropdownInput from "$lib/components/formInput/dropdownInput.svelte";
  import LoadingState from "$lib/components/loadingState.svelte";

  let isLoading = $state(true);
  let loadError = $state("");
  let spendings: Spending[] = $state([]);
  let sources: SpendingSource[] = $state([]);
  let categories: SpendingCategory[] = $state([]);
  let spentAtRangeOptions: Map<string, DateRange> | undefined = $state();
  let appliedFilterHint = $state({
    category: "All categories",
    source: "All sources",
    from: "",
    to: "",
  });

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
  async function handleFilterSubmitted() {
    isLoading = true;
    loadError = "";
    const filterQuery: SpendingFilter = {
      fromInclusive: selectedSpentAtRange.fromInclusive,
      toExclusive: selectedSpentAtRange.toExclusive,
    };

    if (selectedCategoryId !== "ALL") filterQuery.category = selectedCategoryId;
    if (selectedSourceId !== "ALL") filterQuery.source = selectedSourceId;

    try {
      spendings = await getManySpendings(filterQuery);
      appliedFilterHint = {
        category:
          categories.find((category) => category.id === selectedCategoryId)
            ?.name ?? "All categories",
        source:
          sources.find((source) => source.id === selectedSourceId)?.name ??
          "All sources",
        from: dayjs(selectedSpentAtRange.fromInclusive).format("D MMM YYYY"),
        to: dayjs(selectedSpentAtRange.toExclusive).format("D MMM YYYY"),
      };
    } catch {
      loadError = "We couldn’t update your spending records. Try again.";
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    try {
      [spendings, categories, sources, latestPayday] = await Promise.all([
        getManySpendings({}),
        getAllCategories(),
        getAllSources(),
        getLatestPayday(),
      ]);

      categories.unshift({ id: "ALL", name: "All Categories", priority: 0 });
      sources.unshift({ id: "ALL", name: "All Sources", isActive: true });
      spentAtRangeOptions = new Map(dateRangeNameToDateValueMap);
      if (latestPayday) {
        spentAtRangeOptions.set("This Payday Period", {
          fromInclusive: dayjs(latestPayday.paydayDate).toISOString(),
          toExclusive: dayjs().toISOString(),
        });
      }
      appliedFilterHint = {
        category: "All categories",
        source: "All sources",
        from: dayjs(selectedSpentAtRange.fromInclusive).format("D MMM YYYY"),
        to: dayjs(selectedSpentAtRange.toExclusive).format("D MMM YYYY"),
      };
    } catch {
      loadError = "We couldn’t load your spending overview. Try again.";
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>My Spending Tracker - Overview</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <p class="eyebrow">Overview</p>
    <h1>Your spending, clearly.</h1>
    <p class="subtitle">See where your money went and what matters now.</p>
  </section>

  {#if loadError}
    <div class="error-message" role="alert">{loadError}</div>
  {/if}

  <div class="card amount-summary-card total-card">
    <span>Total spending</span>
    <strong>{totalAmount.toIDRString()}</strong>
  </div>

  <div class="card data-table-card">
    <div class="card-header">
      <div>
        <h2>Records</h2>
        <p>Filter your latest spending by category, source, or period.</p>
      </div>

      <form
        class="card-actions"
        onsubmit={(e) => {
          e.preventDefault();
          handleFilterSubmitted();
        }}
      >
        <DropdownInput
          bind:value={selectedCategoryId}
          data={{
            id: "overview-category",
            placeholder: "Categories",
            title: "Category",
            options: categories.map((category) => ({
              value: category.id,
              name: category.name,
            })),
          }}
        />

        <DropdownInput
          bind:value={selectedSourceId}
          data={{
            id: "overview-source",
            placeholder: "Sources",
            title: "Source",
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
            title: "Period",
            placeholder: "Spent at",
            options: Array.from(spentAtRangeOptions?.entries() ?? []).map(
              ([name, value]) => ({ name, value }),
            ),
          }}
        />

        <div class="filter-button">
          <button type="submit" class="btn primary" disabled={isLoading}>
            {isLoading ? "Updating…" : "Apply filters"}</button
          >
        </div>
      </form>
    </div>

    {#if appliedFilterHint.from}
      <p class="filter-summary">
        Showing <strong>{appliedFilterHint.category}</strong> from
        <strong>{appliedFilterHint.source}</strong>, {appliedFilterHint.from}–{appliedFilterHint.to}.
      </p>
    {/if}

    {#if isLoading}
      <LoadingState message="Updating your records…" />
    {:else if spendings.length === 0}
      <div class="empty-state">
        <h3>No records found</h3>
        <p class="hint">Try another filter or add a new spending record.</p>
      </div>
    {:else}
      <div class="table-container">
        <table class="data-table">
          <caption class="sr-only">Filtered spending records</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Source</th>
              <th scope="col" class="amount-column">Amount</th>
            </tr>
          </thead>
          <tbody>
            {#each spendings as spending (spending.id)}
              <tr>
                <td data-label="Date"
                  >{dayjs(spending.createdAt).format("D MMM YYYY")}</td
                >
                <td data-label="Description" class="description-cell"
                  >{spending.description}</td
                >
                <td data-label="Category">
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
                <td data-label="Source">{spending.sourceName}</td>
                <td data-label="Amount" class="amount-cell"
                  >{spending.amount.toIDRString()}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .eyebrow {
    margin-bottom: 0.45rem;
    color: var(--color-accent);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .card-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 1fr)) auto;
    gap: 0.75rem;
    align-items: end;
    margin-top: 1.25rem;
  }

  /* The shared .form-input spacing lives inside the child inputs, so it has to
     be cleared globally for the filter row to bottom-align with the button. */
  .card-actions :global(.form-input) {
    margin-bottom: 0;
  }

  .amount-summary-card {
    max-width: 420px;
    min-height: 132px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }

  .amount-summary-card span {
    color: var(--text-secondary);
    font-size: 0.83rem;
    font-weight: 600;
  }

  .amount-summary-card strong {
    font-size: clamp(1.05rem, 2vw, 1.45rem);
    line-height: 1.05;
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
  }

  .total-card {
    color: white;
    background: linear-gradient(145deg, #1687f8, #0065cb);
    border-color: transparent;
    box-shadow: 0 16px 38px rgba(0, 113, 227, 0.24);
  }

  .total-card span {
    color: rgba(255, 255, 255, 0.76);
  }

  .total-card strong {
    color: white;
    font-size: clamp(1.45rem, 3vw, 2rem);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-header h2 {
    font-size: 1.45rem;
  }

  .card-header > div > p,
  .filter-summary {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 0.4rem;
  }

  .filter-summary {
    padding: 0.8rem 0 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .amount-column {
    text-align: right;
  }

  .amount-cell {
    text-align: right;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
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
    background-color: var(--color-success-soft);
    color: var(--color-success);
  }

  /* Secondary category (medium urgency) */
  .category-badge.secondary {
    background-color: var(--color-blue-light);
    color: var(--text-primary);
  }

  /* Tertiary category (lowest urgency) */
  .category-badge.tertiary {
    background-color: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .empty-state {
    padding: 4rem 1rem;
    text-align: center;
    color: var(--text-hint);
  }

  .hint {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 900px) {
    .card-actions {
      grid-template-columns: repeat(2, 1fr);
    }

    .filter-button {
      grid-column: 2;
    }

    .filter-button button {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .amount-summary-card {
      max-width: none;
      min-height: 112px;
    }

    .card-actions {
      grid-template-columns: 1fr;
    }

    .filter-button {
      grid-column: auto;
    }

    .data-table thead {
      display: none;
    }

    .data-table,
    .data-table tbody,
    .data-table tr,
    .data-table td {
      display: block;
      width: 100%;
    }

    .data-table tr {
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .data-table td {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.45rem 0;
      border: 0;
      text-align: right;
      white-space: normal;
    }

    .data-table td::before {
      content: attr(data-label);
      color: var(--text-hint);
      font-size: 0.8rem;
      font-weight: 600;
      text-align: left;
    }

    .description-cell {
      max-width: none;
    }
  }

  .filter-button {
    align-self: end;
  }

  /* Match the control height so the button and the selects share a baseline. */
  .filter-button button {
    min-height: 46px;
  }
</style>
