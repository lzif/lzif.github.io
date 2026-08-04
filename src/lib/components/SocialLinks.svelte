<script lang="ts">
  import { socials } from "$lib/data/socials";
  import Icon from "./Icon.svelte";

  let { class: className = "" }: { class?: string } = $props();
</script>

<div class="flex items-center gap-2 {className}">
  {#each socials as social (social.href)}
    <a
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
      class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
      aria-label={social.label}
    >
      <Icon name={social.icon} size={16} />
    </a>
  {/each}
</div>
