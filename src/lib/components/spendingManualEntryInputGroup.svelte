<script lang="ts">
  import type {
    CreateSpendingInput,
    SpendingCategory,
    SpendingSource,
  } from "$lib/interfaces";
  import DropdownInput from "./formInput/dropdownInput.svelte";
  import AmountInput from "./formInput/amountInput.svelte";
  import ShortTextInput from "./formInput/shortTextInput.svelte";
  import { untrack } from "svelte";

  interface ManualEntryFormProps {
    id: string;
    categories: SpendingCategory[];
    sources: SpendingSource[];
    deleteButtonClickedEventHandler: (id: string) => void;
    onInputsChangeEventHandler: (
      id: string,
      isInputsValid: boolean,
      input: CreateSpendingInput,
    ) => void;
  }

  // form input value
  let selectedCategoryId: string = $state("");
  let selectedSourceId: string = $state("");
  let amount: number = $state(0);
  let description: string = $state("");

  // form input element state
  let isAmountInvalid: boolean = $state(false);
  let isDescriptionInvalid: boolean = $state(false);

  let isInputsValid: boolean = $derived(
    [isAmountInvalid, isDescriptionInvalid].every((it) => !it) &&
      selectedCategoryId !== "" &&
      selectedSourceId !== "",
  );

  let {
    categories,
    sources,
    id,
    deleteButtonClickedEventHandler,
    onInputsChangeEventHandler,
  }: ManualEntryFormProps = $props();

  function onDeleteButtonClicked(): void {
    deleteButtonClickedEventHandler(id);
  }

  $effect(() => {
    const currentInput = {
      sourceId: selectedSourceId,
      categoryId: selectedCategoryId,
      description,
      amount,
    };
    const currentIsValid = isInputsValid;

    untrack(() => {
      onInputsChangeEventHandler(id, currentIsValid, currentInput);
    });
  });
</script>

<div class="input-group" {id}>
  <AmountInput
    name="amount"
    placeholder="Amount"
    label="Amount"
    bind:value={amount}
    bind:isInputInvalid={isAmountInvalid}
  />

  <ShortTextInput
    name="description"
    placeholder="Description"
    label="Description"
    bind:value={description}
    bind:isInputInvalid={isDescriptionInvalid}
  />

  <DropdownInput
    bind:value={selectedCategoryId}
    data={{
      placeholder: "Categories",
      title: "Select Category",
      options: categories.map((category) => ({
        value: category.id,
        name: category.name,
      })),
    }}
  />

  <DropdownInput
    bind:value={selectedSourceId}
    data={{
      placeholder: "Sources",
      title: "Select Source",
      options: sources.map((source) => ({
        value: source.id,
        name: source.name,
      })),
    }}
  />

  <div class="delete-button-area">
    <button type="button" class="btn danger" onclick={onDeleteButtonClicked}
      >Delete</button
    >
  </div>
</div>

<style>
  .input-group {
    border: 2px solid var(--border-color, #e5e7eb);
    border-radius: 8px;
    padding: 12px;
  }

  .delete-button-area {
    display: flex;
    justify-content: end;
  }
</style>
