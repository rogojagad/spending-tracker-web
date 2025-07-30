<script lang="ts">
  import type { DateRange } from "$lib/interfaces";

  interface DateRangeProps {
    data: DateRangeAttributeProps;
    value: DateRange;
  }

  interface DateRangeAttributeProps {
    id: string;
    title: string;
    placeholder: string;
    options: DateRangeItem[];
  }

  interface DateRangeItem {
    value: DateRange;
    name: string;
  }

  let { data, value = $bindable() }: DateRangeProps = $props();
  let isLoading = $derived(data.options.length === 0);
</script>

<div class="filter-group">
  <h5>{data.title}</h5>

  <div>
    {#if isLoading}
      <p>Loading {data.placeholder}</p>
    {:else}
      <select placeholder={data.placeholder} bind:value id={data.id}>
        {#each data.options as option}
          <option value={option.value}>{option.name}</option>
        {/each}
      </select>
    {/if}
  </div>
</div>

<style>
</style>
