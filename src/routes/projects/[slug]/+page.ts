import { error } from "@sveltejs/kit";
import { projects } from "$lib/data/projects";
import type { Project } from "$lib/types";

export const prerender = true;

export function entries(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }): { project: Project } {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) error(404, "Project not found");
  return { project };
}
