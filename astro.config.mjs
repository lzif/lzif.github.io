import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://lzif.github.io",
  integrations: [mdx(), sitemap(), svelte(), tailwind({applyBaseStyles: false,})]
});
