import type { Post } from "$lib/types";

/**
 * `import: "metadata"` is load-bearing, not a micro-optimisation: without it Vite
 * emits whole module namespace objects, so every post's rendered `default` export
 * (its full body) is pulled into the client graph and cannot be tree-shaken. The
 * `published` filter below runs far too late to stop that, so unpublished drafts
 * would ship to the public bundle. Keep this narrowed to `metadata`.
 */
const frontmatter = import.meta.glob("/src/posts/*.md", {
  eager: true,
  import: "metadata",
}) as Record<string, unknown>;

function fail(slug: string, message: string): never {
  throw new Error(`Invalid frontmatter in src/posts/${slug}.md: ${message}`);
}

function requireString(value: unknown, slug: string, key: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(slug, `"${key}" must be a non-empty string, got ${JSON.stringify(value)}.`);
  }
  return value;
}

/**
 * Frontmatter dates reach us in two shapes:
 *   - quoted, possibly non-zero-padded: `date: "2023-4-14"`
 *   - unquoted YAML timestamp, which js-yaml turns into a Date and mdsvex then
 *     JSON-stringifies: `date: 2024-01-15` -> "2024-01-15T00:00:00.000Z"
 * Both normalise to a zero-padded ISO calendar date so `new Date(...)` parses
 * reliably and the value is valid in `<time datetime>` and RSS `<pubDate>`.
 * Anything genuinely unparseable throws at build time rather than silently
 * rendering the string "Invalid Date".
 */
function normalizeDate(value: unknown, slug: string): string {
  const raw = requireString(value, slug, "date").trim();

  const dateOnly = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    if (Number.isNaN(new Date(`${iso}T00:00:00Z`).getTime())) {
      fail(slug, `"date" is not a real calendar date: "${raw}".`);
    }
    return iso;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    fail(slug, `"date" could not be parsed as a date: "${raw}".`);
  }
  return parsed.toISOString().slice(0, 10);
}

function slugOf(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

/**
 * Read only the `published` flag. This runs before any other validation because
 * unpublished posts are stubbed down to a bare `published: false` by the
 * `strip-unpublished-posts` Vite plugin — they have no title or date left to check,
 * and validating them would fail the build on drafts that are working as intended.
 */
function isPublished(path: string, metadata: unknown): boolean {
  const slug = slugOf(path);
  if (typeof metadata !== "object" || metadata === null) {
    fail(slug, "frontmatter block is missing or is not a mapping.");
  }
  const published = (metadata as Record<string, unknown>).published;
  if (typeof published !== "boolean") {
    fail(slug, `"published" must be true or false, got ${JSON.stringify(published)}.`);
  }
  return published;
}

function toPost(path: string, metadata: unknown): Post {
  const slug = slugOf(path);
  const fm = metadata as Record<string, unknown>;

  if (fm.categories !== undefined) {
    if (!Array.isArray(fm.categories) || fm.categories.some((c) => typeof c !== "string")) {
      fail(slug, `"categories" must be a list of strings, got ${JSON.stringify(fm.categories)}.`);
    }
  }

  return {
    title: requireString(fm.title, slug, "title"),
    description: requireString(fm.description, slug, "description"),
    date: normalizeDate(fm.date, slug),
    categories: (fm.categories as string[] | undefined) ?? [],
    published: true,
    slug,
  };
}

export function getPosts(): Post[] {
  return Object.entries(frontmatter)
    .filter(([path, metadata]) => isPublished(path, metadata))
    .map(([path, metadata]) => toPost(path, metadata))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
