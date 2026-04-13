<script lang="ts">
  import {
    bulkCreateSpending,
    getAllCategories,
    getAllSources,
  } from "$lib/api";
  import {
    ErrorCode,
    type CreateSpendingInput,
    type ErrorResponse,
    type InvalidPayloadErrorResponse,
    type SpendingCategory,
    type SpendingSource,
  } from "$lib/interfaces";
  import { onMount } from "svelte";
  import ManualEntryInputGroup from "$lib/components/spendingManualEntryInputGroup.svelte";
  import { FORM_STATE } from "$lib/constants";
  import FormSubmitMessageContainer from "$lib/components/formSubmitMessageContainer.svelte";
  import type { HTTPError } from "ky";

  let categories: SpendingCategory[] = $state([]);
  let sources: SpendingSource[] = $state([]);
  let isLoading = $derived(categories.length === 0 || sources.length === 0);

  let initialInputGroupId = crypto.randomUUID();

  let inputs = $state(
    new Map<string, { isValid: boolean; input?: CreateSpendingInput }>([
      [initialInputGroupId, { isValid: false }],
    ]),
  );
  let inputIds = $derived(inputs.keys().toArray());
  let spendingsCount = $state(0);
  let canBeSubmitted = $derived(
    inputs.entries().every((input) => input[1].isValid),
  );

  let formState: string = $state(FORM_STATE.NOT_SUBMITTED);
  let submitErrorDetails: string = $state("");

  onMount(async () => {
    [sources, categories] = await Promise.all([
      getAllSources(),
      getAllCategories(),
    ]);
    isLoading = false;
  });

  function onAddNewSpendingClicked(): void {
    const newInputGroupId = crypto.randomUUID();
    const updated = new Map(inputs);
    updated.set(newInputGroupId, { isValid: false });
    inputs = updated;
  }

  function onSpendingInputGroupDeleted(deletedId: string): void {
    const updated = new Map(inputs);
    updated.delete(deletedId);

    inputs = updated;
  }

  function updateInputGroup(
    id: string,
    isValid: boolean,
    newInput?: CreateSpendingInput,
  ): void {
    const updated = new Map(inputs);
    updated.set(id, { isValid, input: newInput });

    inputs = updated;
  }

  async function handleOnSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    if (canBeSubmitted) {
      const formData = inputs
        .entries()
        .toArray()
        .map(([_, value]) => value.input) as CreateSpendingInput[];

      try {
        spendingsCount = formData.length;
        await bulkCreateSpending(formData);
        formState = FORM_STATE.SUBMIT_SUCCESS;
        clearInputs();

        setTimeout(() => {
          formState = FORM_STATE.NOT_SUBMITTED;
          updateInputGroup(crypto.randomUUID(), false);
        }, 3000);
      } catch (e) {
        console.log(spendingsCount);
        const error = e as HTTPError;
        formState = FORM_STATE.SUBMIT_ERROR;
        const errorResponse = await error.response.json<ErrorResponse>();

        switch (errorResponse.code) {
          case ErrorCode.INVALID_PAYLOAD:
            submitErrorDetails = (
              errorResponse as InvalidPayloadErrorResponse
            ).errors
              .map((error) => {
                const fullPath = error.path;

                const itemNo = parseInt(fullPath.split(".")[0]) + 1;
                const fieldName = fullPath.split(".")[1];
                const message = error.message;

                return `Item ${itemNo}'s ${fieldName}: ${message}`;
              })
              .join(" ; ");
            return;

          case ErrorCode.INVALID_CATEGORY_OR_SOURCE:
          case ErrorCode.INTERNAL_SERVER_ERROR:
          default:
        }
      }
    }
  }

  function clearInputs() {
    inputs = new Map();
  }
</script>

<svelte:head>
  <title>My Spending Tracker - Manual Entry</title>
</svelte:head>

<div class="page-container">
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  {/if}

  <section class="page-header">
    <h2>Spending Manual Entry</h2>
    <p class="subtitle">Save your spending manually</p>
  </section>

  <div class="card">
    <form onsubmit={handleOnSubmit}>
      <FormSubmitMessageContainer
        {spendingsCount}
        {canBeSubmitted}
        {formState}
        {submitErrorDetails}
      />

      <div class="input-area">
        {#each inputIds as id}
          <ManualEntryInputGroup
            {categories}
            {sources}
            {id}
            onInputsChangeEventHandler={updateInputGroup}
            deleteButtonClickedEventHandler={onSpendingInputGroupDeleted}
          />
        {/each}
      </div>

      <div class="button-area">
        <button type="submit" class="btn primary"> Save All Spending(s)</button>
        <button
          type="button"
          class="btn secondary"
          onclick={onAddNewSpendingClicked}>Add New Spending</button
        >
      </div>
    </form>
  </div>
</div>

<style>
  .button-area {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    gap: 5px;
  }

  .input-area {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    gap: 5px;
  }
</style>
