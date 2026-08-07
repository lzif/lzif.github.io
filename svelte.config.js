import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";

import { mdsvex, escapeSvelte } from "mdsvex";
import { getHighlighter } from "shiki";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".md"],
  layout: {
    _: path.resolve(process.cwd(), "src/mdsvex.svelte"),
  },
  highlight: {
    highlighter: async (code, lang = "text") => {
      // Languages must be preloaded: shiki throws on an unknown `lang`, which would
      // fail the build. This set covers what a post here plausibly fences; anything
      // outside it needs adding to this list. Cost is build-time only — the result is
      // inlined static HTML, so none of this reaches the client bundle.
      const highlighter = await getHighlighter({
        themes: ["poimandres"],
        langs: [
          "javascript",
          "typescript",
          "svelte",
          "html",
          "css",
          "json",
          "bash",
          "markdown",
        ],
      });
      const html = escapeSvelte(
        highlighter.codeToHtml(code, { lang, theme: "poimandres" }),
      );
      return `{@html \`${html}\` }`;
    },
  },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    paths: {
      base: process.env.BASE_PATH ?? "",
    },
  },
};

export default config;
