<script lang="ts">
  import { getColorByUsagePercentage } from "$lib/util/usedPercentage";

  interface LimitRemainingValueProps {
    value: number;
    usedValue: number;
    usedPercentage: number;
  }

  let { value, usedValue, usedPercentage }: LimitRemainingValueProps = $props();
</script>

<div class="item-amount">
  <div
    class="amount-primary"
    style="color: {getColorByUsagePercentage(usedPercentage)};"
  >
    {(value - usedValue).toIDRString()}
  </div>
  <div class="amount-secondary">Remaining</div>
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
