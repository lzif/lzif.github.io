import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

type Repo = {
  id: number;
  name: string;
  repo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  stars: number;
  watchers: number;
  forks: number;
  defaultBranch: string;
};

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch("https://ungh.cc/users/lzif/repos");
    if (!response.ok) {
      throw error(response.status, "Failed to fetch repositories");
    }
    const data = await response.json();
    return {
      repos: data.repos as Repo[],
    };
  } catch (e) {
    console.error(e);
    return {
      repos: [],
    };
  }
};
