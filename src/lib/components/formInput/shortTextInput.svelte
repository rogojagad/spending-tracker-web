<script lang="ts">
  interface ShortTextInputProps {
    id: string;
    name: string;
    placeholder: string;
    label: string;
    value?: string;
    isInputInvalid?: boolean;
  }

  let {
    id,
    name,
    placeholder,
    label,
    value = $bindable(""),
    isInputInvalid = $bindable(false),
  }: ShortTextInputProps = $props();

  const errorId = `${id}-error`;

  function validate(newValue: string) {
    value = newValue;
    isInputInvalid = value.trim().length === 0;
  }
</script>

<div class="form-input">
  <label for={id}>{label}</label>
  <input
    type="text"
    {name}
    {id}
    {placeholder}
    bind:value
    autocomplete="off"
    aria-invalid={isInputInvalid}
    aria-describedby={isInputInvalid ? errorId : undefined}
    oninput={(e) => {
      validate((e.target as HTMLInputElement).value);
    }}
    onblur={(e) => validate((e.target as HTMLInputElement).value)}
  />
  {#if isInputInvalid}
    <small id={errorId} class="field-error">Enter a short description.</small>
  {/if}
</div>
