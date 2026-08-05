import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import { getPosts } from "$lib/posts";
import type { Post } from "$lib/types";
import type { PageLoad } from "./$types";

export const prerender = true;

/**
 * Deliberately NOT eager. An eager glob pulls every post's rendered body into one
 * unsplittable client chunk, so unpublished drafts would ship to the public bundle
 * regardless of the `published` filter. Lazy loaders keep each post in its own
 * chunk, fetched only for the slug actually being rendered.
 */
const modules = import.meta.glob("/src/posts/*.md") as Record<
  string,
  () => Promise<{ default: Component }>
>;

export function entries(): { slug: string }[] {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export const load: PageLoad = async ({ params }): Promise<{ content: Component; meta: Post }> => {
  const meta = getPosts().find((post) => post.slug === params.slug);
  const path = Object.keys(modules).find((p) => p.endsWith(`/${params.slug}.md`));
  if (!meta || !path) error(404, "Post not found");

  const module = await modules[path]();
  return { content: module.default, meta };
};
