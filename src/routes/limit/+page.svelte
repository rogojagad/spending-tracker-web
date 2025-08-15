<script lang="ts">
  import { getSpendingLimits } from "$lib/api";
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
        <div class="list-item">
          <div class="item-main">
            <div class="item-title">{limit.name}</div>
            <div class="item-subtitle">{limit.applicationPeriod}</div>
            <div class="item-filters">
              {#if limit.descriptionKeywords}
                {#each limit.descriptionKeywords as keyword}
                  <span class="filter-tag filter-keyword">{keyword}</span>
                {/each}
              {:else if limit.sourceName}
                <span class="filter-tag filter-source">{limit.sourceName}</span
                >{:else}<span class="filter-tag filter-category"
                  >{limit.categoryName}</span
                >{/if}
            </div>
          </div>
          <div class="item-amount">
            <div class="amount-primary">{limit.value.toIDRString()}</div>
            <div class="amount-secondary">Total Limit</div>
          </div>
          <div class="item-amount">
            <div
              class="amount-primary"
              style="color: {limit.usedPercentage > 60
                ? '#d69e2e'
                : '#38a169'};"
            >
              {(limit.value - limit.usedValue).toIDRString()}
            </div>
            <div class="amount-secondary">Remaining</div>
          </div>
          <div class="item-amount">
            <div class="amount-primary">{limit.usedValue.toIDRString()}</div>
            <div class="amount-secondary">
              Used ({limit.usedPercentage.toFixed(2)}%)
            </div>
          </div>
          {#if limit.usedPercentage > 60}
            <div class="status-indicator status-warning"></div>
          {:else}
            <div class="status-indicator status-good"></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>{/if}

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

  .list-item {
    padding: 20px 24px;
    border-bottom: 1px solid #f7fafc;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 20px;
    align-items: center;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .item-main {
    display: flex;
    flex-direction: column;
  }

  .item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 4px;
  }

  .item-subtitle {
    font-size: 13px;
    color: #718096;
  }

  .item-amount {
    text-align: right;
  }

  .amount-primary {
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
  }

  .amount-secondary {
    font-size: 13px;
    color: #718096;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 8px;
  }

  .status-good {
    background: #38a169;
  }
  .status-warning {
    background: #d69e2e;
  }

  .item-filters {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .filter-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 12px;
    border: 1px solid;
  }

  .filter-source {
    background: #e6fffa;
    color: #234e52;
    border-color: #b2f5ea;
  }

  .filter-category {
    background: #ffd4a3;
    color: #8b4513;
    border-color: #feb672;
  }

  .filter-keyword {
    background: #f0f4ff;
    color: #3c4fe0;
    border-color: #a5b4fc;
  }
</style>
