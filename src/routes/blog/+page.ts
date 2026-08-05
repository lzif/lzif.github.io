import { getPosts } from "$lib/posts";
import type { Post } from "$lib/types";
import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = (): { posts: Post[] } => {
  return { posts: getPosts() };
};
