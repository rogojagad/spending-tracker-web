<script lang="ts">
  import { FORM_STATE } from "$lib/constants";

  interface MessageContainerProps {
    canBeSubmitted: boolean;
    formState: string;
    spendingsCount: number;
  }

  let { canBeSubmitted, formState, spendingsCount }: MessageContainerProps =
    $props();
</script>

<div class="message-container">
  {#if formState === FORM_STATE.SUBMITTING}
    {#if !canBeSubmitted}
      <div class="error-message">
        Some inputs are still invalid, please check again
      </div>
    {/if}
  {:else if formState === FORM_STATE.SUBMIT_SUCCESS}
    <div class="success-message">
      {`${spendingsCount} spending(s) created`}
    </div>
  {:else if formState === FORM_STATE.SUBMIT_SUCCESS}
    <div class="error-message">
      {`Failed when creating ${spendingsCount} spending(s). Errors: TBA`}
    </div>
  {/if}
</div>

<style></style>
