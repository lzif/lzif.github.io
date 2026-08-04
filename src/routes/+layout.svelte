<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>Luki Zainur</title>
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:text-accent">Skip to content</a>

<header class="border-b border-line">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="font-mono text-sm tracking-tight">luki</a>
    <nav class="hidden gap-8 text-sm sm:flex">
      <a href="/projects" class="text-muted transition-colors hover:text-fg">Projects</a>
      <a href="/blog" class="text-muted transition-colors hover:text-fg">Blog</a>
      <a href="/about" class="text-muted transition-colors hover:text-fg">About</a>
      <a href="/contact" class="text-muted transition-colors hover:text-fg">Contact</a>
    </nav>
  </div>
</header>

<main id="main">
  {@render children()}
</main>

<footer class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-8 text-center font-mono text-xs text-muted">
    © {new Date().getFullYear()} Luki Zainur
  </div>
</footer>
