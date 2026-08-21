<script lang="ts">
  import type { LimitHistorySnapshot } from "$lib/interfaces";
  import LimitItemFilters from "./limitItemFilters.svelte";
  import LimitStatusIndicator from "./limitStatusIndicator.svelte";
  import "../../types/number";

  interface LimitHistoryItemProps {
    snapshot: LimitHistorySnapshot;
  }

  const periodLabel: Record<string, string> = {
    PAYDAY: "Payday",
    MONTHLY: "Monthly",
  };

  let { snapshot }: LimitHistoryItemProps = $props();
  let progress = $derived(Math.min(Math.max(snapshot.usedPercentage, 0), 100));
  let remaining = $derived(snapshot.value - snapshot.usedValue);
</script>

<div class="list-item">
  <div class="item-main">
    <div class="item-title">{snapshot.name}</div>
    <div class="item-subtitle">
      {periodLabel[snapshot.applicationPeriod] ?? snapshot.applicationPeriod}
    </div>
    <LimitItemFilters limit={snapshot} />
  </div>
  <div class="metric">
    <div class="item-amount">
      <div class="amount-primary">{snapshot.value.toIDRString()}</div>
      <div class="amount-secondary">Limit</div>
    </div>
  </div>
  <div class="metric remaining">
    <div class="item-amount">
      <div class="amount-primary">{remaining.toIDRString()}</div>
      <div class="amount-secondary">Remaining</div>
    </div>
  </div>
  <div class="metric">
    <div class="item-amount">
      <div class="amount-primary">{snapshot.usedValue.toIDRString()}</div>
      <div class="amount-secondary">
        Used ({snapshot.usedPercentage.toFixed(2)}%)
      </div>
    </div>
  </div>
  <div class="status">
    <LimitStatusIndicator usedPercentage={snapshot.usedPercentage} />
  </div>
  <div class="progress-track" aria-hidden="true">
    <div class="progress-value" style={`width: ${progress}%`}></div>
  </div>
</div>

<style>
  .list-item {
    position: relative;
    padding: 1.35rem 1.5rem 1.6rem;
    border-bottom: 1px solid var(--border-color);
    display: grid;
    grid-template-columns:
      minmax(180px, 1.8fr) repeat(3, minmax(120px, 1fr))
      minmax(120px, auto);
    gap: 1rem;
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
    font-size: 1rem;
    font-weight: 650;
    color: var(--text-primary);
    margin-bottom: 0.2rem;
    letter-spacing: -0.01em;
  }

  .item-subtitle {
    font-size: 0.78rem;
    color: var(--text-hint);
  }

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

  .progress-track {
    position: absolute;
    right: 1.5rem;
    bottom: 0.75rem;
    left: 1.5rem;
    height: 3px;
    overflow: hidden;
    border-radius: 99px;
    background: var(--color-gray);
  }

  .progress-value {
    height: 100%;
    border-radius: inherit;
    background: var(--color-accent);
  }

  @media (max-width: 900px) {
    .list-item {
      grid-template-columns: 1fr 1fr;
      gap: 1rem 0.75rem;
      padding: 1.25rem 1.15rem 1.6rem;
    }

    .item-main,
    .status {
      grid-column: 1 / -1;
    }

    .status {
      justify-self: start;
    }

    .metric {
      padding: 0.8rem;
      border-radius: var(--radius-sm);
      background: var(--color-gray-light);
    }

    .progress-track {
      right: 1.15rem;
      left: 1.15rem;
    }
  }

  @media (max-width: 480px) {
    .list-item {
      grid-template-columns: 1fr;
    }

    .item-main,
    .status {
      grid-column: auto;
    }
  }
</style>
