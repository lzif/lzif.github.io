<script lang="ts">
  import type { PageData } from "./$types";
  import Picture from "$lib/components/Picture.svelte";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { site } from "$lib/config";
  import { projects } from "$lib/data/projects";

  let { data }: { data: PageData } = $props();

  let tags = $derived(["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))]);
  let active = $state("All");
  let visible = $derived(active === "All" ? projects : projects.filter((p) => p.tags.includes(active)));
</script>

<svelte:head>
  <title>Projects — {site.name}</title>
  <meta name="description" content="A selection of projects I've built — frameworks, apps, and tools." />
  <link rel="canonical" href={`${site.url}/projects`} />
  <meta property="og:title" content={`Projects — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/projects`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <SectionHeader
      eyebrow="Portfolio"
      title="Projects"
      description="A curated selection of things I've built — frameworks, apps, and tools."
    />
  </Reveal>

  <Reveal delay={120}>
    <div class="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
      {#each tags as tag (tag)}
        <button
          type="button"
          onclick={() => (active = tag)}
          aria-pressed={active === tag}
          class={active === tag
            ? "rounded-full bg-accent px-4 py-1.5 font-mono text-xs text-black"
            : "rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-fg"}
        >
          {tag}
        </button>
      {/each}
    </div>
  </Reveal>

  <div class="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
    {#each visible as project (project.slug)}
      <Reveal class="group">
        <a href={`/projects/${project.slug}`} class="group block" aria-label={`${project.title} — view project`}>
          <Picture src={project.cover} alt={`${project.title} cover`} width={1200} height={900} class="aspect-[4/3] w-full transition-transform duration-700 ease-overshoot group-hover:scale-[1.02]" />
          <div class="mt-5 flex items-baseline justify-between gap-4">
            <h2 class="font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h2>
            <span class="flex items-center gap-2">
              {#if project.featured}
                <span class="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] text-black">featured</span>
              {/if}
              <span class="font-mono text-xs text-muted">{project.year}</span>
            </span>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            {#each project.tech as t (t)}
              <li class="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
            {/each}
          </ul>
        </a>
      </Reveal>
    {/each}
  </div>
</section>
