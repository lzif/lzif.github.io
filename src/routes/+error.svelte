<script lang="ts">
  import { page } from "$app/state";
  import { dev } from "$app/environment";

  let message = $derived(page.error?.message ?? "Something went wrong");
</script>

<svelte:head>
  <title>{page.status} — Luki Zainur</title>
</svelte:head>

<div class="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
  <p class="font-mono text-sm uppercase tracking-[0.2em] text-accent">{page.status}</p>
  <h1 class="mt-4 font-display text-6xl font-medium sm:text-7xl">Lost in the whitespace</h1>
  {#if dev}
    <p class="mt-4 max-w-prose text-muted">{message}</p>
  {/if}
  <a href="/" class="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm text-black transition-all duration-300 hover:-translate-y-0.5">
    Back home
  </a>
</div>
