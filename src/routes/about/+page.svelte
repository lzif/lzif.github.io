<script lang="ts">
  import { profile } from "$lib/data/profile";
  import { skillGroups } from "$lib/data/skills";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import SkillBadge from "$lib/components/SkillBadge.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Seo from "$lib/components/Seo.svelte";
</script>

<Seo
  title={`About — ${site.name}`}
  description={`About ${profile.name}: ${profile.title} based in ${profile.location}.`}
  path="/about"
/>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">{profile.location}</p>
    <h1 class="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
      Developer with a design eye.
    </h1>
  </Reveal>

  <div class="mt-16 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
    <Reveal>
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Biography</p>
        <div class="prose mt-6">
          {#each profile.about as paragraph (paragraph)}
            <p class="text-lg leading-relaxed text-muted">{paragraph}</p>
          {/each}
        </div>
      </div>
    </Reveal>

    <Reveal delay={100}>
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Philosophy</p>
        <div class="prose mt-6">
          <p class="text-lg leading-relaxed text-muted">
            I believe good software is felt, not noticed. Interfaces should be quiet, fast, and
            forgiving — the craft shows in the details that don't call attention to themselves.
          </p>
          <p class="text-lg leading-relaxed text-muted">
            I'd rather ship a small, honest tool than a sprawling platform. Most of my projects
            start from a personal itch and stay lean on purpose.
          </p>
        </div>

        <p class="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent">Workflow</p>
        <ol class="mt-6 space-y-6">
          {#each ["Understand the problem before choosing the stack", "Prototype the interaction, then the pixels", "Ship small, measure, iterate", "Write for the person who reads the code next"] as step, i (step)}
            <li class="flex gap-4">
              <span class="font-display text-2xl text-accent">0{i + 1}</span>
              <p class="pt-1 text-muted">{step}</p>
            </li>
          {/each}
        </ol>
      </div>
    </Reveal>
  </div>

  <div class="mt-24">
    <Reveal>
      <SectionHeader eyebrow="Stack" title="Technologies I work with" />
    </Reveal>
    <div class="mt-12 grid gap-12 sm:grid-cols-2">
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

  <div class="mt-24 border-t border-line pt-16 text-center">
    <Reveal>
      <h2 class="font-display text-3xl font-medium">Want to work together?</h2>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <CTA href={`mailto:${profile.email}`}>Email me</CTA>
        <CTA href="/projects" variant="ghost">See my work <Icon name="arrow-right" size={14} /></CTA>
      </div>
    </Reveal>
  </div>
</section>
