import { error } from "@sveltejs/kit";
import { projects } from "$lib/data/projects";
import type { PageLoad } from "./$types";

export const prerender = true;

export function entries(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const load: PageLoad = ({ params }) => {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) error(404, "Project not found");
  return { project };
};
