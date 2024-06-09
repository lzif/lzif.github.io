<script lang="ts">
import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'
    import type { PageData } from './$types';
import Hello from "$lib/components/Hello.svelte"
	export let data: PageData
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="container px-5 py-30 mx-auto">
  <div class="flex items-center">
    <h1 class="text-6xl font-black text-center text-sky-500 mr-3">
      Hello, World!!
    </h1>
    <Hello/>
  </div>
  <p class="text-2xl">
    I'm Luki Zainur(he/him), an Full-Stack Dev from East Java. I'm really into
    programming and design. Welcome, hope you enjoy your stay!
  </p>
</div>

<section>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href={post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.posts {
		display: grid;
		gap: 2rem;
	}

	.post {
		max-inline-size: var(--size-content-3);
	}

	.post:not(:last-child) {
		border-bottom: 1px solid var(--border);
		padding-bottom: var(--size-7);
	}

	.title {
		font-size: var(--font-size-fluid-3);
		text-transform: capitalize;
	}

	.date {
		color: var(--text-2);
	}

.description {
		margin-top: var(--size-3);
	}
</style>
