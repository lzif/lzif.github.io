<script lang="ts">
  import { reveal } from "$lib/utils/reveal";

  let { children, delay = 0 }: { children: import("svelte").Snippet; delay?: number } = $props();
</script>

<div {@attach reveal} style:--reveal-delay="{delay}ms">
  {@render children()}
</div>
