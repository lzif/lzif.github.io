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

<div class="container">
  <div class="intro-grid">
    <h1>Hello, World!!</h1>
    <Hello/>
  </div>
  <p>
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

	.container {
		padding-block: var(--size-9);
	}

	.intro-grid {
		display: flex;
		align-items: center;
		gap: var(--size-3);
	}

	h1 {
		font-size: var(--font-size-fluid-3);
		font-weight: var(--font-weight-9);
		color: var(--brand);
	}

	p {
		font-size: var(--font-size-fluid-1);
	}

	@media (max-width: 768px) {
		.intro-grid {
			flex-direction: column;
		}

		h1 {
			text-align: center;
		}
	}
</style>
