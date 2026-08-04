<script lang="ts">
  import { reveal } from "$lib/utils/reveal";

  let { children, delay = 0, class: className = "" }: {
    children: import("svelte").Snippet; delay?: number; class?: string;
  } = $props();
</script>

<div {@attach reveal} style:--reveal-delay="{delay}ms" class={className}>
  {@render children()}
</div>
