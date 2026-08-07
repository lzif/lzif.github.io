<script lang="ts">
  import SocialLinks from "./SocialLinks.svelte";
  import { profile } from "$lib/data/profile";
</script>

<footer class="border-t border-line">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
    <div>
      <p class="font-display text-lg tracking-tight">{profile.name}</p>
      <p class="mt-1 font-mono text-xs text-muted">© {new Date().getFullYear()} — built with SvelteKit</p>
    </div>
    <SocialLinks />
  </div>
</footer>
