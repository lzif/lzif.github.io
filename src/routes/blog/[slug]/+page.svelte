<script lang="ts">
  import { site } from "$lib/config";
  import { formatDate } from "$lib/utils";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const meta = $derived(data.meta);
  const Content = $derived(data.content);
</script>

<svelte:head>
  <title>{meta.title} — {site.name}</title>
  <meta name="description" content={meta.description} />
  <link rel="canonical" href={`${site.url}/blog/${meta.slug}`} />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`${site.url}/blog/${meta.slug}`} />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
</svelte:head>

<article class="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
  <a
    href="/blog"
    class="font-mono text-xs text-muted transition-colors duration-300 ease-liquid hover:text-accent"
  >
    ← All posts
  </a>
  <h1 class="mt-8 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
    {meta.title}
  </h1>
  <p class="mt-4 font-mono text-xs text-muted">
    <time datetime={meta.date}>{formatDate(meta.date)}</time>
  </p>
  {#if meta.categories.length > 0}
    <ul class="mt-6 flex flex-wrap gap-2">
      {#each meta.categories as category (category)}
        <li class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
          {category}
        </li>
      {/each}
    </ul>
  {/if}

  <div class="prose mt-12">
    <Content />
  </div>
</article>
