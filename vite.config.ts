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
 * The draft is replaced by a bare `published: false` stub: the body goes, and so do
 * the title and description, which would otherwise still ship (an unreleased post's
 * title is itself the thing being embargoed). `getPosts()` sees the stub, filters it
 * out, and never emits it to the list, the feed, or `entries()`.
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

      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(code);
      if (!frontmatter) return null;
      if (!/^published:\s*false\s*$/m.test(frontmatter[1])) return null;

      return { code: "---\npublished: false\n---\n", map: null };
    },
  };
}

export default defineConfig({
  plugins: [stripUnpublishedPosts(), tailwindcss(), sveltekit()],
});
