<script lang="ts">
  import "../app.css";

  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { onNavigate } from "$app/navigation";
  import { site } from "$lib/config";
  import { profile } from "$lib/data/profile";

  let { children } = $props();

  onNavigate(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) {
      return new Promise((resolve) => {
        document.startViewTransition(() => resolve());
      });
    }
  });
</script>

<svelte:head>
  <title>{site.name}</title>
  <meta name="description" content={site.description} />
  <link rel="canonical" href={site.url} />
  <meta property="og:site_name" content={site.name} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-black"
>
  Skip to content
</a>

<Nav />

<main id="main" class="pt-16">
  {@render children()}
</main>

<Footer />
