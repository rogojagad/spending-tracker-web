<script lang="ts">
  interface AmountInputProps {
    name: string;
    placeholder: string;
    value?: number;
    isInputInvalid?: boolean;
  }

  let {
    value = $bindable(1),
    isInputInvalid = $bindable(false),
    name,
    placeholder,
  }: AmountInputProps = $props();
</script>

<div class="form-input">
  <h5>Amount</h5>
  <input
    type="number"
    {name}
    id={name}
    {placeholder}
    class:isInputInvalid
    oninput={(e) => {
      const eventValue = Number((e.target as HTMLInputElement).value);

      value = eventValue;
      isInputInvalid = value < 1 ? true : false;
    }}
  />
  {#if isInputInvalid}
    <small style="color: red;">
      Invalid input. Value must be greater than 0, current value is {value}
    </small>
  {/if}
</div>

<style>
  .isInputInvalid {
    border-color: red;
  }
</style>
