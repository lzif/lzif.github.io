import { projects } from "$lib/data/projects";
import type { Project } from "$lib/types";

export const prerender = true;

export function load(): { projects: Project[] } {
  return { projects };
}
