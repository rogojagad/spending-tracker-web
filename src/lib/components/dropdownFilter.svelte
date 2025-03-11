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
</script>

<div class="filter-card">
  <h5>{data.title}</h5>

  <div class="category-filter">
    <select placeholder={data.placeholder} bind:value id="source-select">
      {#each data.options as option}
        <option value={option.value}>{option.name}</option>
      {/each}
    </select>
  </div>
</div>
