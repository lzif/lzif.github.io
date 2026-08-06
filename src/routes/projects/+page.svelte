<script lang="ts">
  import Picture from "$lib/components/Picture.svelte";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import { site } from "$lib/config";
  import { projects } from "$lib/data/projects";

  let tags = $derived(["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))]);
  let active = $state("All");
  let visible = $derived(active === "All" ? projects : projects.filter((p) => p.tags.includes(active)));
</script>

<Seo
  title={`Projects — ${site.name}`}
  description="A selection of projects I've built — frameworks, apps, and tools."
  path="/projects"
/>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <SectionHeader
      as="h1"
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
            ? "rounded-full bg-accent px-4 py-1.5 font-mono text-xs text-bg"
            : "rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-fg"}
        >
          {tag}
        </button>
      {/each}
    </div>
  </Reveal>

  <p role="status" class="sr-only">{visible.length} projects</p>

  <div class="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
    {#each visible as project (project.slug)}
      <Reveal>
        <a href={`/projects/${project.slug}`} class="group block" aria-label={`${project.title} — view project`}>
          <!-- decorative: the generated covers carry no information, and the link already names the project -->
          <Picture src={project.cover} alt="" width={1200} height={900} class="aspect-[4/3] w-full transition-transform duration-700 ease-overshoot group-hover:scale-[1.02]" />
          <div class="mt-5 flex items-baseline justify-between gap-4">
            <h3 class="font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h3>
            <span class="flex items-center gap-2">
              {#if project.featured}
                <span class="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] text-bg">featured</span>
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
