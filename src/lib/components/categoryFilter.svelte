<script lang="ts">
  import { getAllCategories } from "$lib/api";
  import type { SpendingCategory } from "$lib/interfaces";
  import { onMount } from "svelte";

  export let selectedCategoryId: string;
  let categories: SpendingCategory[] = [];
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    categories = (await getAllCategories()).sort(
      (category) => category.priority,
    );
    isLoading = false;
  });
</script>

<div class="filter-card">
  <h5>Filter By Category</h5>

  {#if isLoading}
    <div class="loading-indicator">Loading categories...</div>
  {:else}
    <div class="category-filter">
      <select
        placeholder="Category"
        bind:value={selectedCategoryId}
        id="category-select"
      >
        <option value="ALL">All Categories</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
  {/if}
</div>

<style>
</style>
