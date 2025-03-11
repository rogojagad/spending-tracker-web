<script lang="ts">
  interface DropdownProps {
    data: DropdownAttributeProps;
    value: string;
  }

  interface DropdownAttributeProps {
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

<div class="filter-group">
  <h5>{data.title}</h5>

  <div>
    {#if isLoading}
      <p>Loading {data.placeholder}</p>
    {:else}
      <select placeholder={data.placeholder} bind:value id="source-select">
        {#each data.options as option}
          <option value={option.value}>{option.name}</option>
        {/each}
      </select>
    {/if}
  </div>
</div>
