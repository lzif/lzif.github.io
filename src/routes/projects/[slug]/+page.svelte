<script lang="ts">
  import type { PageData } from "./$types";
  import Picture from "$lib/components/Picture.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Reveal from "$lib/components/Reveal.svelte";
  import { site } from "$lib/config";

  let { data }: { data: PageData } = $props();
  let { project } = $derived(data);
</script>

<svelte:head>
  <title>{project.title} — {site.name}</title>
  <meta name="description" content={project.tagline} />
  <link rel="canonical" href={`${site.url}/projects/${project.slug}`} />
  <meta property="og:title" content={project.title} />
  <meta property="og:description" content={project.tagline} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`${site.url}/projects/${project.slug}`} />
  <meta property="og:image" content={`${site.url}${project.cover}`} />
  <meta name="twitter:title" content={project.title} />
  <meta name="twitter:description" content={project.tagline} />
  <meta name="twitter:image" content={`${site.url}${project.cover}`} />
</svelte:head>

<article class="mx-auto max-w-4xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <a href="/projects" class="font-mono text-xs text-muted transition-colors hover:text-accent">← All projects</a>
    <p class="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">{project.year} · {project.tags.join(" / ")}</p>
    <h1 class="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">{project.title}</h1>
  </Reveal>

  <Reveal delay={120}>
    <Picture src={project.cover} alt={`${project.title} cover`} width={1200} height={900} class="mt-12 aspect-[4/3] w-full" sizes="(max-width: 896px) 100vw, 896px" priority />
  </Reveal>

  <Reveal delay={160}>
    <div class="prose mt-12">
      {#each project.description as paragraph}
        <p class="text-lg leading-relaxed text-muted">{paragraph}</p>
      {/each}
    </div>

    <div class="mt-10 border-t border-line pt-8">
      <h2 class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Stack</h2>
      <ul class="mt-4 flex flex-wrap gap-2">
        {#each project.tech as t (t)}
          <li class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
        {/each}
      </ul>
    </div>

    <div class="mt-10 flex flex-wrap gap-4">
      <CTA href={project.github} external>Source on GitHub</CTA>
      {#if project.demo}
        <CTA href={project.demo} variant="ghost" external>Live demo</CTA>
      {/if}
    </div>
  </Reveal>
</article>
