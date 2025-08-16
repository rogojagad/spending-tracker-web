<script lang="ts">
  import {
    getColorByUsagePercentage,
    getUsageLevel,
    type UsageLevel,
  } from "$lib/util/usedPercentage";

  interface LimitStatusProps {
    usedPercentage: number;
  }

  let { usedPercentage }: LimitStatusProps = $props();
</script>

<div
  class="status-indicator"
  style="background: {getColorByUsagePercentage(usedPercentage)};"
></div>

<style>
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: 8px;
  }
</style>
