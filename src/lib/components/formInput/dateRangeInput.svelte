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
  let selectedName = $state("");

  $effect(() => {
    const matchingOption = data.options.find(
      (option) =>
        option.value.fromInclusive === value?.fromInclusive &&
        option.value.toExclusive === value?.toExclusive,
    );
    if (matchingOption) selectedName = matchingOption.name;
  });
</script>

<div class="form-input">
  <label for={data.id}>{data.title}</label>

  <div>
    {#if isLoading}
      <p class="field-loading" role="status">Loading {data.placeholder}…</p>
    {:else}
      <select
        id={data.id}
        name={data.id}
        value={selectedName}
        onchange={(event) => {
          selectedName = (event.currentTarget as HTMLSelectElement).value;
          const selected = data.options.find(
            (option) => option.name === selectedName,
          );
          if (selected) value = selected.value;
        }}
      >
        {#each data.options as option}
          <option value={option.name}>{option.name}</option>
        {/each}
      </select>
    {/if}
  </div>
</div>

<style>
  .field-loading {
    min-height: 46px;
    display: flex;
    align-items: center;
    padding: 0 0.85rem;
    border-radius: var(--radius-sm);
    background: var(--color-gray-light);
    color: var(--text-hint);
    font-size: 0.9rem;
  }
</style>
