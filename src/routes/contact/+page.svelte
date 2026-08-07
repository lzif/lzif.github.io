<script lang="ts">
  import { profile } from "$lib/data/profile";
  import { site } from "$lib/config";
  import { socials } from "$lib/data/socials";
  import Reveal from "$lib/components/Reveal.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import SocialLinks from "$lib/components/SocialLinks.svelte";
  import Seo from "$lib/components/Seo.svelte";

  const gh = socials.find((s) => s.icon === "github");
</script>

<Seo title={`Contact — ${site.name}`} description={`Get in touch with ${profile.name}.`} path="/contact" />

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
    {#if gh}
      <Reveal delay={100}>
        <a
          href={gh.href}
          target="_blank"
          rel="noopener noreferrer"
          class="group block rounded-2xl border border-line p-8 transition-colors duration-300 hover:border-accent"
        >
          <Icon name="github" size={20} class="text-accent" />
          <p class="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">GitHub</p>
          <p class="mt-2 font-display text-2xl transition-colors group-hover:text-accent">{gh.handle}</p>
        </a>
      </Reveal>
    {/if}
  </div>

  <Reveal delay={160}>
    <div class="mt-16 border-t border-line pt-12">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">Elsewhere</p>
      <SocialLinks class="mt-6" />
    </div>
  </Reveal>
</section>
