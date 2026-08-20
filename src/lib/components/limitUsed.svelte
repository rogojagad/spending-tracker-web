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
    font-size: 0.95rem;
    font-weight: 650;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }

  .amount-secondary {
    font-size: 0.75rem;
    color: var(--text-hint);
  }
</style>
