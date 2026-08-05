<script lang="ts">
  import { profile } from "$lib/data/profile";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import SocialLinks from "$lib/components/SocialLinks.svelte";
</script>

<svelte:head>
  <title>Contact — {site.name}</title>
  <meta name="description" content={`Get in touch with ${profile.name}.`} />
  <link rel="canonical" href={`${site.url}/contact`} />
  <meta property="og:title" content={`Contact — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/contact`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">{profile.availability}</p>
    <h1 class="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
      Let's build something together.
    </h1>
    <p class="mt-8 max-w-xl text-lg leading-relaxed text-muted">
      The inbox is open. Tell me what you're working on — I usually reply within a day or two.
    </p>
  </Reveal>

  <div class="mt-16 grid gap-6 md:grid-cols-2">
    <Reveal>
      <a
        href={`mailto:${profile.email}`}
        class="group block rounded-2xl border border-line p-8 transition-colors duration-300 hover:border-accent"
      >
        <Icon name="mail" size={20} class="text-accent" />
        <p class="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">Email</p>
        <p class="mt-2 font-display text-2xl break-all transition-colors group-hover:text-accent">{profile.email}</p>
      </a>
    </Reveal>
    <Reveal delay={100}>
      <a
        href="https://github.com/lzif"
        target="_blank"
        rel="noopener noreferrer"
        class="group block rounded-2xl border border-line p-8 transition-colors duration-300 hover:border-accent"
      >
        <Icon name="github" size={20} class="text-accent" />
        <p class="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">GitHub</p>
        <p class="mt-2 font-display text-2xl transition-colors group-hover:text-accent">lzif</p>
      </a>
    </Reveal>
  </div>

  <Reveal delay={160}>
    <div class="mt-16 border-t border-line pt-12">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">Elsewhere</p>
      <SocialLinks class="mt-6" />
    </div>
  </Reveal>
</section>
