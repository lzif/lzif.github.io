<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span class="inline-flex items-center rounded-full border border-line px-3 py-1 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-fg">
  {label}
</span>
