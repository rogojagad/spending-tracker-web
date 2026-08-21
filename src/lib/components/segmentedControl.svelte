<script lang="ts">
  interface SegmentOption<T extends string> {
    id: T;
    label: string;
    panelId: string;
  }

  interface SegmentedControlProps<T extends string> {
    name: string;
    value: T;
    options: SegmentOption<T>[];
    onChange: (next: T) => void;
  }

  let { name, value, options, onChange }: SegmentedControlProps<string> =
    $props();

  function handleKeydown(event: KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + options.length) % options.length;
    onChange(options[nextIndex].id);

    const nextButton = (event.currentTarget as HTMLElement)
      .closest("[role='tablist']")
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex];
    nextButton?.focus();
  }
</script>

<div class="segmented-control" role="tablist" aria-label={name}>
  {#each options as option, index (option.id)}
    <button
      type="button"
      role="tab"
      id={`${name}-tab-${option.id}`}
      class:selected={value === option.id}
      aria-selected={value === option.id}
      aria-controls={option.panelId}
      tabindex={value === option.id ? 0 : -1}
      onclick={() => onChange(option.id)}
      onkeydown={(event) => handleKeydown(event, index)}>{option.label}</button
    >
  {/each}
</div>

<style>
  .segmented-control {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    width: min(100%, 360px);
    padding: 3px;
    border-radius: 12px;
    background: rgba(118, 118, 128, 0.12);
  }

  button {
    min-height: 36px;
    padding: 0.4rem 0.9rem;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--text-secondary);
    font: inherit;
    font-size: 0.86rem;
    font-weight: 650;
    cursor: pointer;
    transition:
      background-color 180ms var(--spring-ease),
      color 180ms ease,
      transform 80ms ease-out,
      box-shadow 180ms ease;
    -webkit-tap-highlight-color: transparent;
  }

  button:active {
    transform: scale(0.98);
  }

  button.selected {
    background: var(--background-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  @media (prefers-reduced-transparency: reduce) {
    .segmented-control {
      background: var(--color-gray);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
</style>
