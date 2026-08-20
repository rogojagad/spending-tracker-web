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
    itemNumber: number;
    initialInput?: CreateSpendingInput;
    canDelete: boolean;
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
      amount > 0 &&
      description.trim().length > 0 &&
      selectedCategoryId !== "" &&
      selectedSourceId !== "",
  );

  let {
    categories,
    sources,
    id,
    itemNumber,
    initialInput,
    canDelete,
    deleteButtonClickedEventHandler,
    onInputsChangeEventHandler,
  }: ManualEntryFormProps = $props();

  let didInitialize = false;
  $effect(() => {
    if (!didInitialize && initialInput) {
      untrack(() => {
        selectedCategoryId = initialInput.categoryId;
        selectedSourceId = initialInput.sourceId;
        amount = initialInput.amount;
        description = initialInput.description;
      });
    }
    didInitialize = true;
  });

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
  <div class="input-group-header">
    <h2>Record {itemNumber}</h2>
    <button
      type="button"
      class="delete-button"
      disabled={!canDelete}
      aria-label={`Remove record ${itemNumber}`}
      title={canDelete ? "Remove this record" : "Keep at least one record"}
      onclick={onDeleteButtonClicked}>Remove</button
    >
  </div>

  <div class="fields-grid">
    <AmountInput
      id={`${id}-amount`}
      name="amount"
      placeholder="Amount"
      label="Amount"
      bind:value={amount}
      bind:isInputInvalid={isAmountInvalid}
    />

    <ShortTextInput
      id={`${id}-description`}
      name="description"
      placeholder="Description"
      label="Description"
      bind:value={description}
      bind:isInputInvalid={isDescriptionInvalid}
    />

    <DropdownInput
      bind:value={selectedCategoryId}
      data={{
        id: `${id}-category`,
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
        id: `${id}-source`,
        placeholder: "Sources",
        title: "Select Source",
        options: sources.map((source) => ({
          value: source.id,
          name: source.name,
        })),
      }}
    />
  </div>
</div>

<style>
  .input-group {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
    background: rgba(245, 245, 247, 0.55);
  }

  .input-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .input-group-header h2 {
    font-size: 1rem;
    letter-spacing: -0.01em;
  }

  .fields-grid {
    display: grid;
    grid-template-columns: minmax(150px, 0.8fr) minmax(220px, 1.5fr) 1fr 1fr;
    gap: 0.75rem;
    align-items: start;
  }

  .delete-button {
    min-height: 36px;
    padding: 0.35rem 0.7rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--color-danger);
    font: inherit;
    font-size: 0.82rem;
    font-weight: 650;
    cursor: pointer;
  }

  .delete-button:hover:not(:disabled) {
    background: var(--color-danger-soft);
  }

  .delete-button:active:not(:disabled) {
    transform: scale(0.96);
  }

  .delete-button:disabled {
    color: var(--text-hint);
    cursor: not-allowed;
    opacity: 0.45;
  }

  @media (max-width: 900px) {
    .fields-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 560px) {
    .fields-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
</style>
