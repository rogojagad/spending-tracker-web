<script lang="ts">
  import { getAllSources } from "$lib/api";
  import type { SpendingSource } from "$lib/interfaces";
  import { onMount } from "svelte";

  export let selectedSourceId: string;
  let sources: SpendingSource[] = [];
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    sources = (await getAllSources()).filter((source) => source.isActive);
    isLoading = false;
  });
</script>

<div class="filter-card">
  <h5>Filter By Source</h5>

  {#if isLoading}
    <div class="loading-indicator">Loading sources...</div>
  {:else}
    <div class="category-filter">
      <select
        placeholder="Source"
        bind:value={selectedSourceId}
        id="source-select"
      >
        <option value="ALL">All Sources</option>
        {#each sources as source}
          <option value={source.id}>{source.name}</option>
        {/each}
      </select>
    </div>
  {/if}
</div>

<style>
</style>
