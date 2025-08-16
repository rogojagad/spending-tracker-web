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
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
  }

  .amount-secondary {
    font-size: 13px;
    color: #718096;
  }
</style>
