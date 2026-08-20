<script lang="ts">
  interface LimitTotalValueProps {
    value: number;
  }

  let { value }: LimitTotalValueProps = $props();
</script>

<div class="item-amount">
  <div class="amount-primary">{value.toIDRString()}</div>
  <div class="amount-secondary">Total Limit</div>
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
