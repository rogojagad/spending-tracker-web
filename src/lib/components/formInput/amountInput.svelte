<script lang="ts">
  interface AmountInputProps {
    id: string;
    name: string;
    placeholder: string;
    label: string;
    value?: number;
    isInputInvalid?: boolean;
  }

  let {
    id,
    value = $bindable(0),
    isInputInvalid = $bindable(false),
    label,
    name,
    placeholder,
  }: AmountInputProps = $props();

  const errorId = `${id}-error`;

  function validate(rawValue: string) {
    value = Number(rawValue);
    isInputInvalid = !rawValue || value < 1;
  }
</script>

<div class="form-input">
  <label for={id}>{label}</label>
  <input
    type="number"
    {name}
    {id}
    {placeholder}
    min="1"
    step="1"
    inputmode="numeric"
    value={value || ""}
    aria-invalid={isInputInvalid}
    aria-describedby={isInputInvalid ? errorId : undefined}
    oninput={(e) => {
      validate((e.target as HTMLInputElement).value);
    }}
    onblur={(e) => validate((e.target as HTMLInputElement).value)}
  />
  {#if isInputInvalid}
    <small id={errorId} class="field-error">
      Enter an amount greater than zero.
    </small>
  {/if}
</div>
