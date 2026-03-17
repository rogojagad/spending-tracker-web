<script lang="ts">
  import { getAllCategories, getAllSources } from "$lib/api";
  import type {
    CreateSpendingInput,
    SpendingCategory,
    SpendingSource,
  } from "$lib/interfaces";
  import { onMount } from "svelte";
  import ManualEntryInputGroup from "$lib/components/spendingManualEntryInputGroup.svelte";

  let categories: SpendingCategory[] = $state([]);
  let sources: SpendingSource[] = $state([]);
  let isLoading = $derived(categories.length === 0 || sources.length === 0);

  let initialInputGroupId = crypto.randomUUID();
  let inputGroupIds = $state([initialInputGroupId]);
  let canSubmitById = $state(
    new Map<string, boolean>([[initialInputGroupId, false]]),
  );
  let inputById = $state(
    new Map<string, CreateSpendingInput>([
      [
        initialInputGroupId,
        { sourceId: "", categoryId: "", amount: 0, description: "" },
      ],
    ]),
  );
  let numberOfSpendings = $derived(inputById.entries().toArray().length);
  let isAllInputGroupsValid = $state(false);
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
    inputGroupIds = [...inputGroupIds, newInputGroupId];
    canSubmitById.set(newInputGroupId, false);
  }

  function onSpendingInputGroupDeleted(deletedId: string): void {
    inputGroupIds = inputGroupIds.filter((id) => id != deletedId);
    canSubmitById.delete(deletedId);
    inputById.delete(deletedId);
  }

  function onInputChange(
    id: string,
    isValid: boolean,
    newInput: CreateSpendingInput,
  ): void {
    canSubmitById.set(id, isValid);
    inputById.set(id, newInput);
  }

  async function handleOnSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    console.log($state.snapshot(inputById));
    isInitialLoad = false;
    isAllInputGroupsValid = canSubmitById.entries().every((entry) => entry[1]);

    if (isAllInputGroupsValid) {
      const formData = inputById
        .entries()
        .toArray()
        .map((entry) => entry[1]);

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
        {#if !isInitialLoad && !isAllInputGroupsValid}
          <div class="error-message">
            Some inputs are still invalid, please check again
          </div>
        {/if}

        {#if isSubmittedSuccessfully}
          <div class="success-message">
            {`${numberOfSpendings} spending(s) created`}
          </div>
        {/if}
      </div>

      <div class="input-area">
        {#each inputGroupIds as id}
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
