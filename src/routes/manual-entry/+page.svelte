<script lang="ts">
  import { getAllCategories, getAllSources } from "$lib/api";
  import type {
    CreateSpendingInput,
    SpendingCategory,
    SpendingSource,
  } from "$lib/interfaces";
  import { onMount } from "svelte";
  import ManualEntryInputGroup from "$lib/components/spendingManualEntryInputGroup.svelte";
  import { keyBy } from "$lib/util/collectionFormatter";

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
  let spendingsCount = $derived(inputs.entries().toArray().length);
  let canBeSubmitted = $derived(
    inputs.entries().every((input) => input[1].isValid),
  );

  let isInitialLoad = $state(true);
  let isSubmittedSuccessfully = $state(false);

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

  function onInputChange(
    id: string,
    isValid: boolean,
    newInput: CreateSpendingInput,
  ): void {
    const updated = new Map(inputs);
    updated.set(id, { isValid, input: newInput });

    inputs = updated;
  }

  async function handleOnSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    isInitialLoad = false;

    if (canBeSubmitted) {
      const formData = inputs
        .entries()
        .toArray()
        .map(([key, value]) => value.input);

      await new Promise((res) => {
        isSubmittedSuccessfully = true;
        res(formData);
      });
    }
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
      <div class="button-area">
        <button type="submit" class="btn primary"> Save All Spending(s)</button>
        <button
          type="button"
          class="btn secondary"
          onclick={onAddNewSpendingClicked}>Add New Spending</button
        >
      </div>

      <div class="message-container">
        {#if !isInitialLoad && !canBeSubmitted}
          <div class="error-message">
            Some inputs are still invalid, please check again
          </div>
        {/if}

        {#if isSubmittedSuccessfully}
          <div class="success-message">
            {`${spendingsCount} spending(s) created`}
          </div>
        {/if}
      </div>

      <div class="input-area">
        {#each inputIds as id}
          <ManualEntryInputGroup
            {categories}
            {sources}
            {id}
            onInputsChangeEventHandler={onInputChange}
            deleteButtonClickedEventHandler={onSpendingInputGroupDeleted}
          />
        {/each}
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
