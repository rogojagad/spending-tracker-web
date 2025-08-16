<script lang="ts">
  import type { Limit } from "$lib/interfaces";
  import LimitItemFilters from "./limitItemFilters.svelte";
  import LimitRemainingValue from "./limitRemainingValue.svelte";
  import LimitStatusIndicator from "./limitStatusIndicator.svelte";
  import LimitTotalValue from "./limitTotalValue.svelte";
  import LimitUsed from "./limitUsed.svelte";

  interface LimitProps {
    limit: Limit;
  }

  let { limit }: LimitProps = $props();
</script>

<div class="list-item">
  <div class="item-main">
    <div class="item-title">{limit.name}</div>
    <div class="item-subtitle">{limit.applicationPeriod}</div>
    <LimitItemFilters {limit} />
  </div>
  <LimitTotalValue value={limit.value} />

  <LimitRemainingValue
    value={limit.value}
    usedPercentage={limit.usedPercentage}
    usedValue={limit.usedValue}
  />

  <LimitUsed {limit} />

  <LimitStatusIndicator usedPercentage={limit.usedPercentage} />
</div>

<style>
  .list-item {
    padding: 20px 24px;
    border-bottom: 1px solid #f7fafc;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 20px;
    align-items: center;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .item-main {
    display: flex;
    flex-direction: column;
  }

  .item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 4px;
  }

  .item-subtitle {
    font-size: 13px;
    color: #718096;
  }
</style>
