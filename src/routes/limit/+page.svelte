<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getLimitSnapshots, getSpendingLimits } from "$lib/api";
  import LimitHistoryItem from "$lib/components/limitHistoryItem.svelte";
  import LimitItem from "$lib/components/limitItem.svelte";
  import LoadingState from "$lib/components/loadingState.svelte";
  import SegmentedControl from "$lib/components/segmentedControl.svelte";
  import type { Limit, LimitHistorySnapshot } from "$lib/interfaces";
  import {
    formatJakartaMonthKey,
    formatJakartaMonthLabel,
  } from "$lib/util/jakartaDate";
  import { onMount, untrack } from "svelte";

  type LimitView = "current" | "history";

  const tabs: { id: LimitView; label: string; panelId: string }[] = [
    { id: "current", label: "Current", panelId: "limits-current-panel" },
    { id: "history", label: "History", panelId: "limits-history-panel" },
  ];

  let isLoading = $state(true);
  let limits: Limit[] = $state([]);
  let loadError = $state("");
  let snapshots: LimitHistorySnapshot[] = $state([]);
  let historyLoading = $state(false);
  let historyLoaded = $state(false);
  let historyError = $state("");
  let view = $derived<LimitView>(
    page.url.searchParams.get("view") === "history" ? "history" : "current",
  );
  let historyGroups = $derived(groupHistoryBySnapshot(snapshots));

  function groupHistoryBySnapshot(items: LimitHistorySnapshot[]) {
    const groups = new Map<string, LimitHistorySnapshot[]>();

    for (const snapshot of items) {
      const key = formatJakartaMonthKey(snapshot.createdAt);
      const existing = groups.get(key) ?? [];
      existing.push(snapshot);
      groups.set(key, existing);
    }

    return Array.from(groups.entries()).map(([takenAt, groupItems]) => ({
      takenAt,
      label: formatJakartaMonthLabel(groupItems[0].createdAt),
      items: groupItems,
    }));
  }

  async function loadHistory() {
    if (historyLoading || historyLoaded) return;

    historyLoading = true;
    historyError = "";

    try {
      snapshots = await getLimitSnapshots();
      historyLoaded = true;
    } catch {
      historyError = "We couldn’t load your limit history. Try again.";
    } finally {
      historyLoading = false;
    }
  }

  onMount(async () => {
    try {
      limits = await getSpendingLimits();
    } catch {
      loadError = "We couldn’t load your limits. Try again.";
    } finally {
      isLoading = false;
    }
  });

  $effect(() => {
    if (view === "history") {
      untrack(() => {
        void loadHistory();
      });
    }
  });

  function setView(next: string) {
    const nextView = next === "history" ? "history" : "current";
    const url = new URL(page.url);
    if (nextView === "current") url.searchParams.delete("view");
    else url.searchParams.set("view", nextView);

    goto(`${url.pathname}${url.search}`, {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  }
</script>

<svelte:head>
  <title>My Spending Tracker - Limits</title>
</svelte:head>

<div class="page-container">
  <section class="page-header">
    <p class="eyebrow">Limits</p>
    <h1>Stay ahead of your spending.</h1>
    <p class="subtitle">
      {#if view === "history"}
        Review how past periods used each limit.
      {:else}
        See what’s available before you make the next purchase.
      {/if}
    </p>

    <div class="view-switch">
      <SegmentedControl
        name="limits-view"
        value={view}
        options={tabs}
        onChange={setView}
      />
    </div>
  </section>

  {#if loadError && view === "current"}
    <div class="error-message" role="alert">{loadError}</div>
  {/if}

  {#if historyError && view === "history"}
    <div class="error-message" role="alert">{historyError}</div>
  {/if}

  {#if view === "current"}
    <div
      id="limits-current-panel"
      class="card compact-list"
      role="tabpanel"
      aria-labelledby="limits-view-tab-current"
    >
      {#if isLoading}
        <LoadingState message="Checking your limits…" />
      {:else if limits.length === 0}
        <div class="empty-state">
          <h2>No limits yet</h2>
          <p>Create a limit to track progress here.</p>
        </div>
      {:else}
        {#each limits as limit (limit.id)}
          <LimitItem {limit} />
        {/each}
      {/if}
    </div>
  {:else}
    <div
      id="limits-history-panel"
      class="history-stack"
      role="tabpanel"
      aria-labelledby="limits-view-tab-history"
    >
      {#if historyLoading}
        <div class="card compact-list">
          <LoadingState message="Loading your limit history…" />
        </div>
      {:else if snapshots.length === 0}
        <div class="card compact-list">
          <div class="empty-state">
            <h2>No snapshots yet</h2>
            <p>Past limit usage will appear here after the next snapshot.</p>
          </div>
        </div>
      {:else}
        {#each historyGroups as group (group.takenAt)}
          <section class="card compact-list">
            <h2 class="snapshot-heading">{group.label}</h2>
            {#each group.items as snapshot (snapshot.id)}
              <LimitHistoryItem {snapshot} />
            {/each}
          </section>
        {/each}
      {/if}
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

  .view-switch {
    margin-top: 1.35rem;
  }

  .history-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .compact-list {
    padding: 0;
    overflow: hidden;
  }

  .snapshot-heading {
    padding: 1rem 1.5rem 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-hint);
  }

  .empty-state {
    padding: 4rem 1.5rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .empty-state h2 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 1.3rem;
  }

  .empty-state p {
    max-width: 28rem;
    margin: 0 auto;
  }
</style>
