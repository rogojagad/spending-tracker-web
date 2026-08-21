<script lang="ts">
  interface DropdownProps {
    data: DropdownAttributeProps;
    value: string;
  }

  interface DropdownAttributeProps {
    id: string;
    title: string;
    placeholder: string;
    options: DropdownItem[];
  }

  interface DropdownItem {
    value: string | number;
    name: string;
  }

  let { data, value = $bindable() }: DropdownProps = $props();
  let isLoading = $derived(data.options.length === 0);
</script>

<div class="form-input">
  <label for={data.id}>{data.title}</label>

  <div>
    {#if isLoading}
      <p class="field-loading" role="status">Loading {data.placeholder}…</p>
    {:else}
      <select bind:value id={data.id} name={data.id}>
        <option value="" disabled>{data.placeholder}</option>
        {#each data.options as option}
          <option value={String(option.value)}>{option.name}</option>
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
