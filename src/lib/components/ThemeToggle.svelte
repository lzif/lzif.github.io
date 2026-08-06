<script lang="ts">
  import Icon from "./Icon.svelte";
  import { getTheme, toggleTheme, type Theme } from "$lib/utils/theme";

  let theme = $state<Theme>(getTheme());

  function apply() {
    toggleTheme();
    theme = getTheme();
  }

  function handleClick() {
    // `startViewTransition` is a method on `document`; it must be called on it,
    // otherwise the brand check fails with "Illegal invocation" and the callback
    // never runs. Matches the call in `+layout.svelte`.
    if ("startViewTransition" in document) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }
</script>

<svelte:window onthemechange={() => (theme = getTheme())} />

<button
  type="button"
  onclick={handleClick}
  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
  class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
>
  <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
</button>
