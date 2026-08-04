<script lang="ts">
  import Icon from "./Icon.svelte";
  import { cx } from "$lib/utils";

  let { href, children, variant = "primary", external = false, class: className = "" }: {
    href: string;
    children: import("svelte").Snippet;
    variant?: "primary" | "ghost";
    external?: boolean;
    class?: string;
  } = $props();
</script>

<a
  href={href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  class={cx(
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm transition-all duration-300 ease-overshoot",
    variant === "primary" && "bg-accent text-black hover:-translate-y-0.5 hover:bg-fg hover:text-bg",
    variant === "ghost" && "border border-line text-fg hover:-translate-y-0.5 hover:border-accent hover:text-accent",
    className,
  )}
>
  {@render children()}
  {#if external}
    <Icon name="arrow-up-right" size={14} class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  {/if}
</a>
