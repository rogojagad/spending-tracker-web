<script lang="ts">
  import type { Limit } from "$lib/interfaces";

  interface LimitUsedProps {
    limit: Limit;
  }

  let { limit }: LimitUsedProps = $props();
</script>

<div class="item-amount">
  <div class="amount-primary">{limit.usedValue.toIDRString()}</div>
  <div class="amount-secondary">
    Used ({limit.usedPercentage.toFixed(2)}%)
  </div>
</div>

<style>
  .item-amount {
    text-align: right;
  }

  .amount-primary {
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
  }

  .amount-secondary {
    font-size: 13px;
    color: #718096;
  }
</style>
