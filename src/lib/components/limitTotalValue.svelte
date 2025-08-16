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
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
  }

  .amount-secondary {
    font-size: 13px;
    color: #718096;
  }
</style>
