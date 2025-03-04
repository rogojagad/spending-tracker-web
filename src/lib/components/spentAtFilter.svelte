<script lang="ts">
  import type { SpendingCreatedAtRange } from "$lib/interfaces";
  import dayjs from "dayjs";
  import { onMount } from "svelte";

  const dateRangeNameToDateValueMap = new Map<string, SpendingCreatedAtRange>([
    [
      "Today",
      {
        fromInclusive: dayjs().startOf("day").toISOString(),
        toExclusive: dayjs().endOf("day").toISOString(),
      },
    ],
    [
      "Last 3 Days",
      {
        fromInclusive: dayjs().subtract(3, "day").startOf("day").toISOString(),
        toExclusive: dayjs().endOf("day").toISOString(),
      },
    ],
    [
      "Last 7 Days",
      {
        fromInclusive: dayjs().subtract(7, "day").startOf("day").toISOString(),
        toExclusive: dayjs().endOf("day").toISOString(),
      },
    ],
  ]);

  export let selectedSpentAtRange: SpendingCreatedAtRange;
</script>

<div class="filter-card">
  <h5>Filter By Date Range</h5>

  <div class="category-filter">
    <select
      placeholder="Spent at"
      bind:value={selectedSpentAtRange}
      id="source-select"
    >
      {#each Array.from(dateRangeNameToDateValueMap.keys()) as rangeName}
        <option value={dateRangeNameToDateValueMap.get(rangeName)}
          >{rangeName}</option
        >
      {/each}
    </select>
  </div>
</div>

<style>
</style>
