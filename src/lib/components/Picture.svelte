<script lang="ts">
  let { src, alt, width, height, class: className = "", priority = false }: {
    src: string; alt: string; width: number; height: number; class?: string; priority?: boolean;
  } = $props();

  let small = $derived(src.replace(/-1200\.webp$/, "-600.webp"));
</script>

<img
  {src}
  srcset="{small} 600w, {src} 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  {alt}
  {width}
  {height}
  loading={priority ? "eager" : "lazy"}
  fetchpriority={priority ? "high" : undefined}
  decoding="async"
  class={"rounded-xl border border-line object-cover " + className}
/>
