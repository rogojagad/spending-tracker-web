<script lang="ts">
  import type { Limit } from "$lib/interfaces";
  import { derived } from "svelte/store";

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
    border: 1px solid;
  }

  .filter-source {
    background: #e6fffa;
    color: #234e52;
    border-color: #b2f5ea;
  }

  .filter-category {
    background: rgb(230, 255, 163);
    color: #138b1d;
    border-color: #c1fe72;
  }

  .filter-keyword {
    background: #f0f4ff;
    color: #3c4fe0;
    border-color: #a5b4fc;
  }
</style>
