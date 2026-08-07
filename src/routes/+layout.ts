import type { LayoutLoad } from "./$types";

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

export const load: LayoutLoad = (): Record<string, never> => {
  return {};
};
