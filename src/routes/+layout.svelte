<script lang="ts">
import Footer from './footer.svelte'
	import Header from './header.svelte'
  import PageTransition from './transition.svelte'

  import "open-props/style";
  import "open-props/normalize";
  import "open-props/buttons";

  import "../app.css";
    import type { LayoutData } from './$types';

  export let data: LayoutData
</script>

<!-- div class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <div
    class="sticky top-0 py-3 px-6 backdrop-blur-md flex justify-between items-center bg-slate-100/20 dark:bg-slate-900/20"
  >
    <h1 class="text-2xl font-bold">
      <a href="/">Luki<span class="text-sky">Znr</span></a>
    </h1>
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
    <div>
      &copy; {new Date().getFullYear()} Luki<span class="text-sky">Znr</span>
    </div>
  </footer>
</div -->

<div class="layout">
  <!-- Header -->
	<Header />

	<main>
		<!-- Black hole for other content -->
		<PageTransition url={data.url}>
			<slot />
		</PageTransition>
	</main>

  <!-- Footer -->
	<Footer />
</div>

<style>
	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr auto;
		margin-inline: auto;
		padding-inline: var(--size-7);
	}

	main {
		padding-block: var(--size-9);
	}

	@media (min-width: 1440px) {
		.layout {
			padding-inline: 0;
		}
	}
</style>
