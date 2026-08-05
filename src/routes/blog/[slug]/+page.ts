import { error } from "@sveltejs/kit";
import type { Component } from "svelte";
import { getPosts } from "$lib/posts";
import type { Post } from "$lib/types";
import type { PageLoad } from "./$types";

export const prerender = true;

const modules = import.meta.glob("/src/posts/*.md", { eager: true }) as Record<
  string,
  { default: Component }
>;

export function entries(): { slug: string }[] {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export const load: PageLoad = ({ params }): { content: Component; meta: Post } => {
  const meta = getPosts().find((post) => post.slug === params.slug);
  const path = Object.keys(modules).find((p) => p.endsWith(`/${params.slug}.md`));
  if (!meta || !path) error(404, "Post not found");
  return { content: modules[path].default, meta };
};
