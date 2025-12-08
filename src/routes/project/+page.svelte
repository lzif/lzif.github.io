<script lang="ts">
  import * as config from "$lib/config";
  import type { PageData } from "./$types";
  import { Star } from "lucide-svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>Projects | {config.title}</title>
</svelte:head>

<section>
  <h1>My Projects</h1>
  <ul class="projects">
    {#each data.repos as repo}
      <li class="project">
        <a
          href={`https://github.com/${repo.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          class="title"
        >
          {repo.name}
        </a>
        <div class="meta">
          <span class="stars">
            <Star size={16} />
            {repo.stars}
          </span>
        </div>
        <p class="description">
          {repo.description || "No description provided."}
        </p>
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    padding-block: var(--size-9);
  }

  h1 {
    font-size: var(--font-size-fluid-3);
    font-weight: var(--font-weight-9);
    color: var(--brand);
    margin-bottom: var(--size-7);
  }

  .projects {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .project {
    border: 1px solid var(--border);
    padding: var(--size-5);
    border-radius: var(--radius-2);
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    transition: transform 0.2s ease;
  }

  .project:hover {
    transform: translateY(-2px);
  }

  .title {
    font-size: var(--font-size-fluid-2);
    font-weight: bold;
    text-transform: capitalize;
    text-decoration: none;
    color: var(--text-1);
    word-break: break-word;
  }

  .title:hover {
    text-decoration: underline;
  }

  .meta {
    display: flex;
    gap: var(--size-3);
    font-size: var(--font-size-0);
    color: var(--text-2);
  }

  .stars {
    display: flex;
    align-items: center;
    gap: var(--size-1);
  }

  .description {
    margin-top: var(--size-2);
    color: var(--text-2);
    line-height: 1.5;
  }
</style>
