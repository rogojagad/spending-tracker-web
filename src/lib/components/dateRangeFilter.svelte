<script lang="ts">
  import { dateRangeNameToDateValueMap } from "$lib/constants";
  import type { SpendingCreatedAtRange } from "$lib/interfaces";
  export let selectedSpentAtRange: SpendingCreatedAtRange;
</script>

<div class="filter-group">
  <h5>Filter By Date Range</h5>

  <div>
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
