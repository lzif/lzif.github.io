<script lang="ts">
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import { site } from "$lib/config";
  import { formatDate } from "$lib/utils";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blog — {site.name}</title>
  <meta name="description" content="Notes on software, tools, and the craft of building." />
  <link rel="canonical" href={`${site.url}/blog`} />
  <meta property="og:title" content={`Blog — ${site.name}`} />
  <meta property="og:description" content="Notes on software, tools, and the craft of building." />
  <meta property="og:url" content={`${site.url}/blog`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <SectionHeader
      as="h1"
      eyebrow="Writings"
      title="Blog"
      description="Notes on software, tools, and the craft of building."
    />
  </Reveal>

  <ol class="mt-14 max-w-3xl">
    {#each data.posts as post, i (post.slug)}
      <li>
        <Reveal delay={i * 60} class="group">
          <a
            href={`/blog/${post.slug}`}
            class="block border-b border-line py-8 transition-colors duration-300 ease-liquid group-hover:border-accent"
          >
            <time class="font-mono text-xs text-muted" datetime={post.date}>{formatDate(post.date)}</time>
            <h2
              class="mt-3 font-display text-2xl font-medium tracking-tight transition-colors duration-300 ease-liquid group-hover:text-accent"
            >
              {post.title}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>
          </a>
        </Reveal>
      </li>
    {/each}
  </ol>
</section>
