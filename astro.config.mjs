import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://lzif.github.io",
  integrations: [
    UnoCSS({
      injectReset: "./node_modules/@unocss/reset/tailwind.css",
    }),
    mdx(),
    sitemap(),
    svelte(),
  ],
});
