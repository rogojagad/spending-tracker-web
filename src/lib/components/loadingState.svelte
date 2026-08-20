<script lang="ts">
  interface LoadingStateProps {
    message: string;
  }

  let { message }: LoadingStateProps = $props();
</script>

<div class="loading-state" role="status" aria-live="polite">
  <div class="loading-spinner" aria-hidden="true"></div>
  <p>{message}</p>
</div>
