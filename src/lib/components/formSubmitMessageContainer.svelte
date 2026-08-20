<script lang="ts">
  import { FORM_STATE } from "$lib/constants";

  interface MessageContainerProps {
    canBeSubmitted: boolean;
    formState: string;
    spendingsCount: number;
    submitErrorDetails: string;
  }

  let {
    canBeSubmitted,
    formState,
    spendingsCount,
    submitErrorDetails,
  }: MessageContainerProps = $props();
</script>

<div class="message-container">
  {#if formState === FORM_STATE.SUBMITTING}
    {#if !canBeSubmitted}
      <div class="error-message" role="alert">
        Complete every field before saving.
      </div>
    {:else}
      <div class="status-message" role="status">Saving your records…</div>
    {/if}
  {:else if formState === FORM_STATE.SUBMIT_SUCCESS}
    <div class="success-message" role="status">
      {`${spendingsCount} ${spendingsCount === 1 ? "record" : "records"} saved.`}
    </div>
  {:else if formState === FORM_STATE.SUBMIT_ERROR}
    <div class="error-message" role="alert">
      {`We couldn’t save ${spendingsCount} ${spendingsCount === 1 ? "record" : "records"}. ${submitErrorDetails}`}
    </div>
  {/if}
</div>

<style></style>
