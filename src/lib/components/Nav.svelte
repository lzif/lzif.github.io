<script lang="ts">
  import Icon from "./Icon.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import { cx } from "$lib/utils";
  import { profile } from "$lib/data/profile";

  let scrolled = $state(false);
  let open = $state(false);
  let menuButton: HTMLButtonElement | undefined = $state();
  let closeButton: HTMLButtonElement | undefined = $state();

  function handleScroll() {
    scrolled = window.scrollY > 4;
  }

  function openMenu() {
    open = true;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => closeButton?.focus());
  }

  function closeMenu() {
    open = false;
    document.documentElement.style.overflow = "";
    menuButton?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key === "Tab") {
      const focusables = Array.from(
        document.querySelectorAll<HTMLElement>("#mobile-menu a, #mobile-menu button"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
</script>

<svelte:window onscroll={handleScroll} onkeydown={handleKeydown} />

<header
  class={cx(
    "fixed inset-x-0 top-0 z-40 border-b bg-bg/80 backdrop-blur-md transition-shadow duration-300",
    scrolled ? "shadow-[0_1px_0_0_var(--line)]" : "border-transparent",
  )}
>
  <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Main">
    <a href="/" class="font-display text-lg tracking-tight transition-colors hover:text-accent">
      {profile.name.split(" ")[0].toLowerCase()}<span class="text-accent">.</span>
    </a>

    <div class="hidden items-center gap-8 sm:flex">
      {#each links as link (link.href)}
        <a href={link.href} class="text-sm text-muted transition-colors duration-300 hover:text-fg">{link.label}</a>
      {/each}
      <ThemeToggle />
    </div>

    <div class="flex items-center gap-3 sm:hidden">
      <ThemeToggle />
      <button
        bind:this={menuButton}
        type="button"
        onclick={openMenu}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg"
      >
        <Icon name="menu" size={16} />
      </button>
    </div>
  </nav>
</header>

{#if open}
  <div
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    class="fixed inset-0 z-50 flex flex-col bg-bg"
  >
    <div class="flex h-16 items-center justify-between px-6">
      <a href="/" class="font-display text-lg tracking-tight" onclick={closeMenu}>
        {profile.name.split(" ")[0].toLowerCase()}<span class="text-accent">.</span>
      </a>
      <button
        bind:this={closeButton}
        type="button"
        onclick={closeMenu}
        aria-label="Close menu"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
    <nav class="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
      {#each links as link (link.href)}
        <a
          href={link.href}
          onclick={closeMenu}
          class="border-b border-line py-5 font-display text-4xl transition-colors hover:text-accent"
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
