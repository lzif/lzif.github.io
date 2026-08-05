import type { Post } from "$lib/types";

type Frontmatter = Omit<Post, "slug">;

const modules = import.meta.glob("/src/posts/*.md", { eager: true }) as Record<
  string,
  { metadata: Frontmatter }
>;

/**
 * Frontmatter dates are authored loosely (e.g. "2023-4-14"). Normalise to a
 * zero-padded ISO calendar date so `new Date(...)` parses reliably and the
 * value is valid in `<time datetime>` and RSS `<pubDate>`.
 */
function normalizeDate(date: string): string {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date.trim());
  if (!match) return date;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function getPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      ...mod.metadata,
      date: normalizeDate(mod.metadata.date),
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
    }))
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
