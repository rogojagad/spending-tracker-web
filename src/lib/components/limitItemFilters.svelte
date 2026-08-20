<script lang="ts">
  import type { Limit } from "$lib/interfaces";

  interface LimitFilterProps {
    limit: Limit;
  }

  type FilterKey = "descriptionKeywords" | "sourceName" | "categoryName";

  interface Filter {
    key: FilterKey;
    value: string | string[] | undefined;
  }

  let { limit }: LimitFilterProps = $props();
  let limitFilters: Filter[] = $derived(
    [
      {
        key: "descriptionKeywords" as FilterKey,
        value: limit.descriptionKeywords,
      },
      { key: "sourceName" as FilterKey, value: limit.sourceName },
      { key: "categoryName" as FilterKey, value: limit.categoryName },
    ].filter((limitFilter) => !!limitFilter.value),
  );
</script>

<div class="item-filters">
  {#each limitFilters as limitFilter}
    {#if limitFilter.key === "descriptionKeywords"}
      {#each limitFilter.value as string[] as keyword}
        <span class="filter-tag filter-keyword">{keyword}</span>
      {/each}
    {:else if limitFilter.key === "sourceName"}
      <span class="filter-tag filter-source">{limitFilter.value}</span
      >{:else}<span class="filter-tag filter-category">{limitFilter.value}</span
      >{/if}
  {/each}
</div>

<style>
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
    border: 1px solid var(--border-color);
  }

  .filter-source {
    background: var(--color-success-soft);
    color: #126b28;
  }

  .filter-category {
    background: var(--color-warning-soft);
    color: var(--color-warning);
  }

  .filter-keyword {
    background: var(--color-accent-soft);
    color: #0057ad;
  }
</style>
