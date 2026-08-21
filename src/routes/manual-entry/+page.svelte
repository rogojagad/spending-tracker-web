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
  import LoadingState from "$lib/components/loadingState.svelte";
  import type { HTTPError } from "ky";

  let categories: SpendingCategory[] = $state([]);
  let sources: SpendingSource[] = $state([]);
  let isLoading = $state(true);

  let initialInputGroupId = crypto.randomUUID();

  let inputs = $state(
    new Map<string, { isValid: boolean; input?: CreateSpendingInput }>([
      [initialInputGroupId, { isValid: false }],
    ]),
  );
  let inputIds = $derived(Array.from(inputs.keys()));
  let spendingsCount = $state(0);
  let formState: string = $state(FORM_STATE.NOT_SUBMITTED);
  let submitErrorDetails: string = $state("");
  let canBeSubmitted = $derived(
    inputs.size > 0 &&
      Array.from(inputs.values()).every((input) => input.isValid),
  );
  let isSubmitting = $derived(formState === FORM_STATE.SUBMITTING);
  let deletedEntry = $state<
    [string, { isValid: boolean; input?: CreateSpendingInput }] | undefined
  >();
  let undoTimeout: ReturnType<typeof setTimeout> | undefined;

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
    const entry = updated.get(deletedId);
    if (!entry || updated.size === 1) return;

    deletedEntry = [deletedId, entry];
    updated.delete(deletedId);

    inputs = updated;
    if (undoTimeout) clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => (deletedEntry = undefined), 5000);
  }

  function restoreDeletedEntry(): void {
    if (!deletedEntry) return;
    const updated = new Map(inputs);
    updated.set(deletedEntry[0], deletedEntry[1]);
    inputs = updated;
    deletedEntry = undefined;
    if (undoTimeout) clearTimeout(undoTimeout);
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

    formState = FORM_STATE.SUBMITTING;
    submitErrorDetails = "";

    if (!canBeSubmitted) {
      formState = FORM_STATE.SUBMIT_ERROR;
      submitErrorDetails = "Complete every field before saving.";
      spendingsCount = inputs.size;
      return;
    }

    const formData = Array.from(inputs.values()).map(
      (value) => value.input,
    ) as CreateSpendingInput[];

    try {
      spendingsCount = formData.length;
      await bulkCreateSpending(formData);
      formState = FORM_STATE.SUBMIT_SUCCESS;
      resetForm();

      setTimeout(() => {
        formState = FORM_STATE.NOT_SUBMITTED;
      }, 3000);
    } catch (e) {
      console.log(spendingsCount);
      const error = e as HTTPError;
      formState = FORM_STATE.SUBMIT_ERROR;
      const errorResponse = await error.response.json<ErrorResponse>();

      switch (errorResponse.code) {
        case ErrorCode.INVALID_PAYLOAD:
          submitErrorDetails = `We couldn’t save ${spendingsCount} ${spendingsCount === 1 ? "record" : "records"}. ${(
            errorResponse as InvalidPayloadErrorResponse
          ).errors
            .map((error) => {
              const fullPath = error.path;

              const itemNo = parseInt(fullPath.split(".")[0]) + 1;
              const fieldName = fullPath.split(".")[1];
              const message = error.message;

              return `Item ${itemNo}'s ${fieldName}: ${message}`;
            })
            .join(" ; ")}`;
          return;

        case ErrorCode.INVALID_CATEGORY_OR_SOURCE:
        case ErrorCode.INTERNAL_SERVER_ERROR:
        default:
          submitErrorDetails = `We couldn’t save ${spendingsCount} ${spendingsCount === 1 ? "record" : "records"}. Please try again.`;
      }
    }
  }

  function resetForm() {
    inputs = new Map([[crypto.randomUUID(), { isValid: false }]]);
    deletedEntry = undefined;
    if (undoTimeout) clearTimeout(undoTimeout);
  }
</script>

<svelte:head>
  <title>My Spending Tracker - Manual Entry</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <p class="eyebrow">Add spending</p>
    <h1>Capture every purchase.</h1>
    <p class="subtitle">Add one or several records, then save them together.</p>
  </section>

  {#if isLoading}
    <div class="card">
      <LoadingState message="Preparing your categories and sources…" />
    </div>
  {:else}
    <div class="card">
      <form onsubmit={handleOnSubmit}>
        <FormSubmitMessageContainer
          {spendingsCount}
          {canBeSubmitted}
          {formState}
          {submitErrorDetails}
        />

        <div class="input-area">
          {#each inputIds as id, index (id)}
            <ManualEntryInputGroup
              {categories}
              {sources}
              {id}
              itemNumber={index + 1}
              initialInput={inputs.get(id)?.input}
              canDelete={inputIds.length > 1}
              onInputsChangeEventHandler={updateInputGroup}
              deleteButtonClickedEventHandler={onSpendingInputGroupDeleted}
            />
          {/each}
        </div>

        <div class="button-area">
          <button type="submit" class="btn primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving…"
              : `Save ${inputIds.length} ${inputIds.length === 1 ? "record" : "records"}`}
          </button>
          <button
            type="button"
            class="btn secondary"
            disabled={isSubmitting}
            onclick={onAddNewSpendingClicked}>Add another</button
          >
        </div>
      </form>
    </div>
  {/if}

  {#if deletedEntry}
    <div class="undo-toast" role="status">
      <span>Record removed.</span>
      <button type="button" onclick={restoreDeletedEntry}>Undo</button>
    </div>
  {/if}
</div>

<style>
  .eyebrow {
    margin-bottom: 0.45rem;
    color: var(--color-accent);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .button-area {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-color);
  }

  .input-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .undo-toast {
    position: fixed;
    left: 50%;
    bottom: 1.5rem;
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.75rem 0.85rem 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    background: rgba(29, 29, 31, 0.92);
    color: white;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(20px);
    transform: translateX(-50%);
  }

  .undo-toast button {
    min-height: 36px;
    padding: 0.35rem 0.75rem;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    color: white;
    font: inherit;
    font-weight: 650;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    .button-area {
      flex-direction: column;
    }

    .button-area .btn {
      width: 100%;
    }
  }
</style>
