<script lang="ts">
  import { spring } from "svelte/motion";
  import { profile } from "$lib/data/profile";
  import { projects } from "$lib/data/projects";
  import { skillGroups } from "$lib/data/skills";
  import { experience } from "$lib/data/experience";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import SkillBadge from "$lib/components/SkillBadge.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Picture from "$lib/components/Picture.svelte";
  import Counter from "$lib/components/Counter.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let featured = $derived(projects.filter((p) => p.featured).slice(0, 3));

  // parallax — only desktop, no reduced motion
  let drift = spring(0, { stiffness: 0.08, damping: 0.2 });
  function handleScroll() {
    if (window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const y = window.scrollY;
      if (y < window.innerHeight) drift.set(y * -0.12);
    }
  }

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: site.url,
    email: "mailto:" + profile.email,
  };
</script>

<svelte:window onscroll={handleScroll} />

<Seo title={`${profile.name} — ${profile.title}`} description={profile.bio} jsonLd={personLd} />

<!-- hero -->
<section class="relative overflow-hidden">
  <div
    class="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
    style={`transform: translate3d(0, ${$drift}px, 0)`}
    aria-hidden="true"
  >
    <div class="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"></div>
  </div>

  <div class="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        {profile.location} · {profile.availability}
      </p>
    </Reveal>
    <Reveal delay={80}>
      <h1 class="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        {profile.headline}
      </h1>
    </Reveal>
    <Reveal delay={160}>
      <p class="mt-8 max-w-xl text-lg leading-relaxed text-muted">{profile.bio}</p>
    </Reveal>
    <Reveal delay={240}>
      <div class="mt-10 flex flex-wrap items-center gap-4">
        <CTA href="/projects">View projects <Icon name="arrow-right" size={14} /></CTA>
        <CTA href="/about" variant="ghost">About me</CTA>
      </div>
    </Reveal>
    <Reveal delay={320}>
      <dl class="mt-20 grid grid-cols-3 gap-6 border-t border-line pt-8 sm:max-w-xl">
        {#each profile.stats as stat, i (stat.label)}
          <div class="flex flex-col">
            <dt class="order-2 mt-1 font-mono text-xs text-muted">{stat.label}</dt>
            <dd class="order-1 font-display text-3xl text-fg">
              <Counter value={stat.value} suffix={stat.suffix ?? ""} delay={i * 120} />
            </dd>
          </div>
        {/each}
      </dl>
    </Reveal>
  </div>
</section>

<!-- featured projects -->
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader
        eyebrow="Selected work"
        title="Featured projects"
        description="A few things I've built recently — full list on the projects page."
      />
    </Reveal>
    <div class="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-2">
      {#each featured as project, i (project.slug)}
        <Reveal delay={i * 100} class={(i % 2 === 1 ? "md:mt-16 " : "") + "group"}>
          <a href={`/projects/${project.slug}`} class="group block" aria-label={`${project.title} — view project`}>
            <!-- decorative: the generated covers carry no information, and the link already names the project -->
            <Picture src={project.cover} alt="" width={1200} height={900} class="aspect-[4/3] w-full transition-transform duration-700 ease-overshoot group-hover:scale-[1.02]" />
            <div class="mt-5 flex items-baseline justify-between gap-4">
              <h3 class="font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
              <span class="font-mono text-xs text-muted">{project.year}</span>
            </div>
            <p class="mt-2 max-w-prose text-sm leading-relaxed text-muted">{project.tagline}</p>
            <ul class="mt-4 flex flex-wrap gap-2">
              {#each project.tech as t (t)}
                <li class="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
              {/each}
            </ul>
          </a>
        </Reveal>
      {/each}
    </div>
    <div class="mt-16">
      <CTA href="/projects" variant="ghost">All projects <Icon name="arrow-right" size={14} /></CTA>
    </div>
  </div>
</section>

<!-- skills -->
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader eyebrow="Toolbox" title="Skills & technologies" description="The languages and tools I reach for most." />
    </Reveal>
    <div class="mt-14 grid gap-12 sm:grid-cols-2">
      {#each skillGroups as group (group.category)}
        <div>
          <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-accent">{group.category}</h3>
          <ul class="mt-5 flex flex-wrap gap-2">
            {#each group.skills as skill (skill)}
              <li><SkillBadge label={skill} /></li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- about excerpt -->
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">About</p>
      <blockquote class="mt-6 max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
        {profile.about[0]}
      </blockquote>
      <div class="mt-8">
        <CTA href="/about" variant="ghost">More about me <Icon name="arrow-right" size={14} /></CTA>
      </div>
    </Reveal>
  </div>
</section>

<!-- timeline -->
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader eyebrow="Timeline" title="Recent chapters" />
    </Reveal>
    <ol class="mt-14 max-w-3xl">
      {#each experience as entry, i (entry.year + entry.title)}
        <!-- The dot must stay a direct child of the <li>: Reveal's `translate` makes
             its <div> a containing block for absolutely positioned descendants, which
             would push the dot onto the year label. `group` moves up with it. -->
        <li class="group relative border-l border-line pb-12 pl-8 last:pb-0">
          <span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"></span>
          <Reveal delay={i * 80}>
            <p class="font-mono text-xs text-muted">{entry.year}</p>
            <h3 class="mt-2 font-display text-xl font-medium">{entry.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
          </Reveal>
        </li>
      {/each}
    </ol>
  </div>
</section>

<!-- contact cta -->
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24 text-center">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">Let's talk</p>
      <h2 class="mx-auto mt-6 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Have an idea worth building?
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-muted">{profile.availability}. I'd love to hear about it.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <CTA href={`mailto:${profile.email}`}>Say hello</CTA>
        <CTA href="/contact" variant="ghost">Contact page</CTA>
      </div>
    </Reveal>
  </div>
</section>
