<script lang="ts">
  let { eyebrow, title, description, id, as = "h2", class: className = "" }: {
    eyebrow?: string; title: string; description?: string; id?: string;
    as?: "h1" | "h2"; class?: string;
  } = $props();
</script>

<div id={id} class="scroll-mt-24 {className}">
  {#if eyebrow}
    <p class="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
  {/if}
  {#if as === "h1"}
    <h1 class="font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
  {:else}
    <h2 class="font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h2>
  {/if}
  {#if description}
    <p class="mt-4 max-w-prose text-lg leading-relaxed text-muted">{description}</p>
  {/if}
</div>
