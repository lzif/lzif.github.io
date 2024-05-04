<script lang="ts">
  import Sun from "./Sun.svelte";
  import Moon from "./Moon.svelte";
  import { browser } from "$app/environment";

  let darkMode = true;
  if (browser) {
    darkMode = document.documentElement.className === "dark" ? true : false;
  }

  const toogleDarkMode = () => {
    darkMode = !darkMode;
    window.localStorage.setItem("theme", darkMode?"dark":"light")
    window.document.documentElement.classList.toggle("dark");
  };
</script>

<button on:click={toogleDarkMode}>
  {#if darkMode}
    <Sun />
  {:else}
    <Moon />
  {/if}
</button>
