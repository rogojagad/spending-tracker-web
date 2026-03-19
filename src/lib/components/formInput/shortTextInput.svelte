<script lang="ts">
  interface ShortTextInputProps {
    name: string;
    placeholder: string;
    value?: string;
    isInputInvalid?: boolean;
  }

  let {
    name,
    placeholder,
    value = $bindable(""),
    isInputInvalid = $bindable(false),
  }: ShortTextInputProps = $props();
</script>

<div class="form-input">
  <h5>Amount</h5>
  <input
    type="text"
    {name}
    id={name}
    {placeholder}
    class:isInputInvalid
    oninput={(e) => {
      const eventValue = (e.target as HTMLInputElement).value;

      value = eventValue;
      isInputInvalid =
        value.length === 0 || value.replaceAll(/\s/g, "").length === 0
          ? true
          : false;
    }}
  />
  {#if isInputInvalid}
    <small style="color: red;"> Invalid input. Value cannot be empty. </small>
  {/if}
</div>

<style>
  .isInputInvalid {
    border-color: red;
  }
</style>
