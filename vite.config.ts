import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * Keeps the bodies of `published: false` posts out of the module graph entirely.
 *
 * This cannot be done with globs alone. `import.meta.glob` patterns are static, so
 * every file matching `/src/posts/*.md` enters the build whether or not it is
 * published, and the `published` filter in `getPosts()` runs long after bundling.
 * Worse, because posts are imported both statically (metadata glob) and dynamically
 * (the `[slug]` route), Rollup hoists them into one shared chunk — so an unpublished
 * draft's full body was being served from `build/_app/immutable/chunks/*.js` and
 * preloaded by the public `/blog` page.
 *
 * Running `pre` puts this ahead of the Svelte plugin's transform (which is where
 * mdsvex renders the markdown), so nothing is dropped after compilation — it is
 * dropped before compilation happens.
 *
 * Only two frontmatter shapes are accepted, matched textually against the raw
 * frontmatter block (not parsed as YAML — see below): `published: true` and
 * `published: false`, each optionally followed by a trailing `# comment`. A `true`
 * post is left untouched and compiles normally. A `false` post is replaced by a bare
 * `published: false` stub: the body goes, and so do the title and description, which
 * would otherwise still ship (an unreleased post's title is itself the thing being
 * embargoed). `getPosts()` sees the stub, filters it out, and never emits it to the
 * list, the feed, or `entries()`.
 *
 * Any other shape — `False`, `FALSE`, `no`, `off`, a quoted `"false"`, a missing
 * `published` key, a missing frontmatter block entirely, more than one line starting
 * with `published:`, or anything else this pattern does not recognise — throws and
 * fails the build. This is deliberate, not a gap to be filled in later: a hand-rolled
 * regex is not YAML, and a previous version of this plugin used a regex that matched
 * only `published: false` while `getPosts()`/`isPublished()` (which does go through
 * mdsvex's bundled js-yaml) accepted `False`/`FALSE` too — so a draft spelled
 * `published: False` was invisible to the site's own listing/RSS/`entries()` (hidden
 * successfully, by the *other* check) while sailing straight past this plugin
 * unmodified and shipping its full body into the client bundle. The fix is not to
 * teach this plugin more YAML — that just grows the surface for the two checks to
 * disagree again — it is to shrink what this plugin accepts to two unambiguous
 * shapes and hard-fail on everything else, so nothing can leak by construction: the
 * only shape that ever reaches the compiler is canonical `true`, and every other
 * shape is either stubbed or a build error. Deliberately NOT using a YAML parser
 * here: js-yaml is bundled inside mdsvex and must stay that way rather than becoming
 * a direct, separately-versioned dependency of this repo.
 *
 * Residual exposure, by design: `import.meta.glob` generates its keys from the
 * filesystem, so the draft's *filename* still appears in the bundle. Removing that
 * too would mean abandoning globs for a generated manifest. If a filename is itself
 * sensitive, name the file neutrally.
 */
function stripUnpublishedPosts(): Plugin {
  return {
    name: "strip-unpublished-posts",
    enforce: "pre",
    transform(code, id) {
      const [filepath] = id.split("?");
      if (!/\/src\/posts\/[^/]+\.md$/.test(filepath)) return null;

      const fail = (reason: string): never => {
        throw new Error(
          `${filepath}: "published" must be exactly \`true\` or \`false\` (lowercase, unquoted) ` +
            `in the frontmatter. ${reason}`,
        );
      };

      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(code);
      if (!frontmatter) {
        return fail(
          "No frontmatter block was found, so this file cannot be safely classified as published or a draft.",
        );
      }

      // `exec` without `g` only ever returns the *first* match. If the block somehow
      // carries more than one `published:` line (a stray duplicate key, a value that
      // happens to echo the key at the start of a later line), matching only the
      // first would let a later, real `published: false` hide behind an earlier
      // `published: true` and ship. Require exactly one candidate line before
      // testing it against the canonical shape.
      const candidates = frontmatter[1].match(/^published:.*$/gm) ?? [];
      if (candidates.length !== 1) {
        return fail(
          `Found ${candidates.length} line(s) starting with "published:" in the frontmatter; ` +
            `expected exactly one, so this file cannot be safely classified as published or a draft.`,
        );
      }

      const published = /^published:\s*(true|false)\s*(?:#.*)?\s*$/.exec(candidates[0]!);
      if (!published) {
        return fail(
          `This file's value does not match either canonical shape, so it cannot be safely ` +
            `classified as published or a draft.`,
        );
      }

      if (published[1] === "true") return null;

      return { code: "---\npublished: false\n---\n", map: null };
    },
  };
}

export default defineConfig({
  plugins: [stripUnpublishedPosts(), tailwindcss(), sveltekit()],
});
