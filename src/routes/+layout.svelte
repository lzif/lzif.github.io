<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "uno.css";
import DarkModeToogle from "$lib/components/DarkModeToogle.svelte";
</script>

<div class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <div class="sticky top-0 py-3 px-6 backdrop-blur-md flex justify-between items-center bg-slate-100/20 dark:bg-slate-900/20">
    <h1 class="text-2xl font-bold"><a href="/">Luki<span class="text-sky">Znr</span></h1>
    <nav class="p-2 flex gap-3 text-xl">
      <a href="/blog">Blog</a>
      <a href="/project">Project</a>
      <a href="/about">About</a>
    </nav>
  </div>

  <main>
    <slot />
  </main>

  <footer class="text-center">
    <DarkModeToogle/>
    <div>&copy; {new Date().getFullYear()} Luki<span class="text-sky">Znr</span></div>
  </footer>

</div>
