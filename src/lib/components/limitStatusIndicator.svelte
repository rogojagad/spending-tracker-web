<script lang="ts">
  import { getUsageLevel } from "$lib/util/usedPercentage";

  interface LimitStatusProps {
    usedPercentage: number;
  }

  let { usedPercentage }: LimitStatusProps = $props();
  let usageLevel = $derived(getUsageLevel(usedPercentage));
  let statusLabel = $derived(
    usageLevel === "safe"
      ? "On track"
      : usageLevel === "warning"
        ? "Approaching limit"
        : "Limit exceeded",
  );
</script>

<div class={`status-indicator ${usageLevel}`} aria-label={statusLabel}>
  <span class="status-dot" aria-hidden="true"></span>
  <span>{statusLabel}</span>
</div>

<style>
  .status-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 650;
    white-space: nowrap;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-success);
  }

  .warning .status-dot {
    background: var(--color-warning);
  }

  .exceeded .status-dot {
    background: var(--color-danger);
  }
</style>
