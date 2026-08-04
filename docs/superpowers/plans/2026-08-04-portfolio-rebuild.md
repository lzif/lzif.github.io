# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `lzif/lzif.github.io` (live: `https://luki.is-a.dev`) from the current Svelte 4 blog template into a premium, editorial, dark-first personal portfolio for Luki Zainur, fully static on GitHub Pages.

**Architecture:** SvelteKit + Svelte 5 (runes) + Tailwind v4 (CSS-first) + adapter-static. All content lives in typed data files under `src/lib/data/`. Motion is "liquid" — native View Transitions API for page/theme transitions, `svelte/motion` springs for counters/parallax, a custom IntersectionObserver attachment (`{@attach}`) for reveals. No animation libraries, no runtime deps, no server APIs. Blog (mdsvex + shiki) kept, moved under `/blog`.

**Tech Stack:** Svelte 5.56.8 · SvelteKit 2.70.2 · vite 6.3+ · @sveltejs/vite-plugin-svelte 6 · adapter-static 3.0.10 · tailwindcss 4.3.3 + @tailwindcss/vite · mdsvex 0.12.8 + shiki 1.6.3 · @fontsource-variable/{fraunces,inter,jetbrains-mono} · sharp 0.34 (devDep, asset generation only) · pnpm 8

## Global Constraints

- Svelte 5 runes ONLY: `$state` (never `$state` for large reassigned data — use `$state.raw`), `$derived`/`$derived.by`, `$props`, `{#snippet}`, `onclick={...}`, keyed `{#each}`, `{@attach}`. NO `$:`, `export let`, `on:`, `<slot>`, `<svelte:component>`, `use:action`.
- No state updates inside `$effect`. Effects are last resort; use event handlers, `<svelte:window>`, attachments, or `$derived`.
- TypeScript strict everywhere. `pnpm check` must pass with zero errors after every task.
- No third-party animation libraries. Icons are inline SVGs in one `Icon.svelte`. `svelte/motion` (core) is allowed.
- All routes prerendered (`prerender = true` in `+layout.ts`); no server routes except `+server.ts` endpoints that are `prerender = true` (rss, sitemap).
- `kit.paths.base` wired to `process.env.BASE_PATH` (empty locally, `/lzif.github.io` in CI) — verify `pnpm build` under both.
- Every page: one `h1`, semantic landmarks, visible `:focus-visible` ring, AA+ contrast, `prefers-reduced-motion: reduce` support (global CSS override + JS early returns).
- Content editable only via `src/lib/data/*.ts` — UI components never contain hardcoded portfolio facts (name, projects, skills, experience, socials, email).
- Fonts self-hosted (fontsource / static files), `font-display: swap`. No external CDN scripts (the current `eruda` script in `app.html` must be REMOVED).
- Global easing: `--ease-liquid: cubic-bezier(0.22, 1, 0.36, 1)`; overshoot: `--ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1)`. No default `ease` anywhere.
- Palette tokens (exact hex, CSS variables `--bg --fg --muted --line --accent`): dark `#0A0908 / #F2EFEA / #A8A29A / #2A2722 / #F59E0B`; light `#FAF9F7 / #1A1815 / #6B655C / #E4DFD8 / #B45309`.
- Fonts: Fraunces (display, serif, 400–600 + italic), Inter (body), JetBrains Mono (labels/metadata).
- Commit per task, conventional messages (`feat:`, `chore:`, `refactor:`), stage only intended files.

---

### Task 1: Foundation — dependencies, config, app shell skeleton

**Files:**
- Modify: `package.json` (deps)
- Modify: `vite.config.ts`
- Modify: `svelte.config.js`
- Rewrite: `src/app.html`
- Rewrite: `src/app.css` (minimal placeholder — full design system is Task 2)
- Rewrite: `src/routes/+layout.ts` (already `prerender = true` — keep, verify)
- Rewrite: `src/routes/+layout.svelte` (minimal shell: header placeholder + `<slot />` + footer placeholder)
- Rewrite: `src/routes/+page.svelte` (minimal placeholder page so build passes)
- Delete: `src/lib/components/Hello.svelte`, `src/lib/components/custom/`, `src/lib/index.ts`, `src/routes/header.svelte`, `src/routes/footer.svelte`, `src/routes/toggle.svelte`, `src/routes/transition.svelte`, `src/routes/+page.server.ts`, `src/routes/project/` (old), `src/routes/api/`, `src/routes/[slug]/`, `src/routes/blog/+page.ts` + `src/routes/blog/+page.svelte` (rebuilt in Task 10), `src/lib/theme.ts` (rebuilt Task 5), `src/lib/config.ts` (rebuilt Task 3), `src/app.d.ts` (keep), `src/routes/contact/+page.md` (rebuilt Task 9), `src/routes/about/+page.svelte` (rebuilt Task 9), `static/about.txt`

**Interfaces:**
- Consumes: nothing (repo state from Task 0/current).
- Produces: buildable skeleton; `process.env.BASE_PATH` honored by `kit.paths.base`; Tailwind v4 vite plugin active; fonts importable via `@fontsource-variable/*`.

- [ ] **Step 1: Update `package.json` dependencies**

Replace `devDependencies`/`dependencies` with (exact ranges):

```json
{
  "dependencies": {
    "@fontsource-variable/fraunces": "^5.3.0",
    "@fontsource-variable/inter": "^5.3.0",
    "@fontsource-variable/jetbrains-mono": "^5.3.0"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.70.2",
    "@sveltejs/vite-plugin-svelte": "^6.0.0",
    "@tailwindcss/vite": "^4.3.3",
    "mdsvex": "^0.12.8",
    "prettier": "^3.6.2",
    "prettier-plugin-svelte": "^3.4.0",
    "shiki": "^1.6.3",
    "svelte": "^5.56.8",
    "svelte-check": "^4.7.4",
    "tailwindcss": "^4.3.3",
    "tslib": "^2.4.1",
    "typescript": "^5.9.3",
    "vite": "^6.3.5",
    "sharp": "^0.34.0"
  }
}
```

Run: `pnpm install`
Expected: clean install; removed packages (open-props, lucide-svelte, svelte-persisted-store, @fontsource/manrope, @fontsource/jetbrains-mono, adapter-auto) no longer in `pnpm-lock.yaml` (check with `pnpm ls --depth 0`).

- [ ] **Step 2: Rewrite `vite.config.ts`**

```ts
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

- [ ] **Step 3: Rewrite `svelte.config.js`**

Keep the existing mdsvex + shiki block verbatim (extensions `[".svelte", ".md"]`, layout `./src/mdsvex.svelte`, poimandres theme), but add `paths` and drop nothing else:

```js
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import { getHighlighter } from "shiki";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = { /* EXISTING CONTENT — copy verbatim from current file */ };

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter({ fallback: "404.html" }),
    paths: {
      base: process.env.BASE_PATH ?? "",
    },
  },
};

export default config;
```

- [ ] **Step 4: Rewrite `src/app.html`**

Remove the `eruda` CDN scripts (dev tool — must not ship). Add theme init inline script (no FOUC):

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      (() => {
        const theme = localStorage.getItem("theme");
        document.documentElement.setAttribute("data-theme", theme || "dark");
      })();
    </script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

Note: `%sveltekit.assets%` handles the base path automatically for GH Pages.

- [ ] **Step 5: Rewrite `src/app.css` — minimal placeholder (full system in Task 2)**

```css
@import "tailwindcss";
```

(Placeholder only — Task 2 replaces this file completely.)

- [ ] **Step 6: Rewrite `src/routes/+layout.svelte` — minimal shell**

Svelte 5 syntax, no legacy features:

```svelte
<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>Luki Zainur</title>
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:text-accent">Skip to content</a>

<header class="border-b border-line">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="font-mono text-sm tracking-tight">luki</a>
    <nav class="hidden gap-8 text-sm sm:flex">
      <a href="/projects" class="text-muted transition-colors hover:text-fg">Projects</a>
      <a href="/blog" class="text-muted transition-colors hover:text-fg">Blog</a>
      <a href="/about" class="text-muted transition-colors hover:text-fg">About</a>
      <a href="/contact" class="text-muted transition-colors hover:text-fg">Contact</a>
    </nav>
  </div>
</header>

<main id="main">
  {@render children()}
</main>

<footer class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-8 text-center font-mono text-xs text-muted">
    © {new Date().getFullYear()} Luki Zainur
  </div>
</footer>
```

- [ ] **Step 7: Rewrite `src/routes/+page.svelte` — placeholder**

```svelte
<h1 class="mx-auto max-w-6xl px-6 py-24 font-display text-6xl">Under construction</h1>
```

- [ ] **Step 8: Delete obsolete files**

Run the deletions listed under **Files** above (`git rm`). Keep: `src/mdsvex.svelte`, `src/posts/*.md`, `.github/workflows/deploy.yml`, `src/routes/rss.xml/+server.ts` (updated in Task 10), `static/*` favicons, `.prettierrc`, `.prettierignore`, `.npmrc`, `tsconfig.json`.

- [ ] **Step 9: Verify**

Run: `pnpm check`
Expected: 0 errors (2 warnings for missing focus ring are acceptable if `pnpm check` passes with warnings only — use `pnpm check` exit code).

Run: `BASE_PATH="" pnpm build`
Expected: `build/` contains `index.html`, `404.html`; prerendered output listed.

Run: `BASE_PATH="/lzif.github.io" pnpm build`
Expected: still succeeds (base path resolves).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: migrate to svelte 5, tailwind v4, static base path"
```

---

### Task 2: Design tokens & global styles (`src/app.css`)

**Files:**
- Rewrite: `src/app.css`

**Interfaces:**
- Consumes: Task 1 skeleton.
- Produces: Tailwind utilities `bg-bg`, `text-fg`, `text-muted`, `border-line`, `text-accent`, `bg-accent`, `font-display`, `font-sans`, `font-mono`, `ease-liquid`, `ease-overshoot`; global `.reveal-ready` / `.reveal-done` classes; `::view-transition-*` rules; reduced-motion overrides; prose styles; `@font-face` for Fraunces.

- [ ] **Step 1: Write the complete `src/app.css`**

```css
@import "tailwindcss";

@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces Variable", "Georgia", serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, "SF Mono", monospace;
  --ease-liquid: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);
  --radius-blob: 1rem;
}

/* ---------- theme ---------- */

:root,
:root[data-theme="dark"] {
  --bg: #0a0908;
  --fg: #f2efea;
  --muted: #a8a29a;
  --line: #2a2722;
  --accent: #f59e0b;
  color-scheme: dark;
}

:root[data-theme="light"] {
  --bg: #faf9f7;
  --fg: #1a1815;
  --muted: #6b655c;
  --line: #e4dfd8;
  --accent: #b45309;
  color-scheme: light;
}

/* ---------- base ---------- */

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background-color 300ms var(--ease-liquid), color 300ms var(--ease-liquid);
}

::selection {
  background-color: color-mix(in srgb, var(--accent) 30%, transparent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* ---------- reveal (driven by {@attach reveal}) ---------- */

.reveal-ready {
  opacity: 0;
  translate: 0 16px;
}

.reveal-ready.reveal-done {
  opacity: 1;
  translate: 0 0;
  transition:
    opacity 700ms var(--ease-liquid) var(--reveal-delay, 0ms),
    translate 700ms var(--ease-liquid) var(--reveal-delay, 0ms);
}

/* ---------- view transitions ---------- */

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 250ms;
  animation-timing-function: var(--ease-liquid);
}

::view-transition-old(root) {
  animation-name: vt-fade-out;
}

::view-transition-new(root) {
  animation-name: vt-rise-in;
}

@keyframes vt-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes vt-rise-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

/* ---------- prose (blog + project pages) ---------- */

.prose {
  color: var(--fg);
  line-height: 1.75;
}

.prose h2,
.prose h3 {
  font-family: var(--font-display);
  font-weight: 500;
  margin-block: 2rem 0.75rem;
}

.prose h2 {
  font-size: 1.75rem;
}

.prose h3 {
  font-size: 1.375rem;
}

.prose p,
.prose ul,
.prose ol,
.prose pre,
.prose blockquote {
  margin-block: 1rem;
}

.prose a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose ul,
.prose ol {
  padding-left: 1.5rem;
}

.prose ul {
  list-style: disc;
}

.prose ol {
  list-style: decimal;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background-color: color-mix(in srgb, var(--fg) 8%, transparent);
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
}

.prose pre {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  padding: 1.25rem;
  font-size: 0.875rem;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose blockquote {
  border-left: 2px solid var(--accent);
  padding-left: 1rem;
  color: var(--muted);
  font-style: italic;
}

.prose img {
  border-radius: 0.75rem;
  border: 1px solid var(--line);
}

/* ---------- reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .reveal-ready {
    opacity: 1;
    translate: none;
  }

  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

- [ ] **Step 2: Add Fraunces `@font-face` + preload**

Copy the font file from the installed package:

```bash
mkdir -p static/fonts
cp node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2 static/fonts/
```

Verify the exact filename with `ls node_modules/@fontsource-variable/fraunces/files/` — if it differs, use the actual `latin-wght-normal` woff2 path.

Append to `src/app.css` (before the `@theme` block — `@font-face` must come first):

```css
@font-face {
  font-family: "Fraunces Variable";
  src: url("/fonts/fraunces-latin-wght-normal.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Add preload in `src/app.html` `<head>`:

```html
<link rel="preload" href="%sveltekit.assets%/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
```

Import the other two variable fonts in `src/app.css`:

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/jetbrains-mono";
```

(These are not preloaded — they swap in; Fraunces is the hero-critical one.)

- [ ] **Step 3: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds; `build/fonts/` exists.

- [ ] **Step 4: Commit**

```bash
git add src/app.css src/app.html static/fonts
git commit -m "feat: design tokens, fonts, global styles"
```

---

### Task 3: Content layer — types, config, data files, utils

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/config.ts`
- Create: `src/lib/data/profile.ts`
- Create: `src/lib/data/projects.ts`
- Create: `src/lib/data/skills.ts`
- Create: `src/lib/data/experience.ts`
- Create: `src/lib/data/socials.ts`
- Create: `src/lib/utils.ts` (rewrite of existing — formatDate + new helpers)

**Interfaces:**
- Consumes: nothing (pure data).
- Produces (exact shapes — ALL later tasks import these):

```ts
// src/lib/types.ts
export type Project = {
  slug: string;
  title: string;
  year: number;
  tagline: string;           // one-liner for cards
  description: string[];     // paragraphs for the detail page
  tech: string[];            // mono chips
  tags: string[];            // filterable categories
  cover: string;             // "/covers/<slug>-1200.webp"
  github: string;
  demo?: string;
  featured: boolean;
};

export type SkillGroup = { category: string; skills: string[] };

export type ExperienceEntry = {
  year: string;              // "2024", "2025", "2026"
  title: string;
  description: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  headline: string;          // hero serif headline
  bio: string;               // home hero one-liner
  about: string[];           // about page paragraphs
  email: string;
  availability: string;
  stats: { value: number; label: string; suffix?: string }[];
};

export type Social = { label: string; href: string; icon: "github" | "mail" | "external" };

export type Post = {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: string[];
  published: boolean;
};

export type SiteConfig = {
  name: string;
  url: string;
  description: string;
};
```

- [ ] **Step 1: Write `src/lib/config.ts`**

```ts
export const site: SiteConfig = {
  name: "Luki Zainur",
  url: "https://luki.is-a.dev",
  description: "Full-stack developer crafting thoughtful software and interfaces.",
};
```

- [ ] **Step 2: Write the data files** — real facts from the GitHub account `lzif` (repos: markupless, malas-finance, zevy-note, Visual-Code-Space, imphnen-skor, google-reverse-image-api, task-manager, personal-finance-tracker). Content lives ONLY here.

`src/lib/data/profile.ts`:

```ts
import type { Profile } from "$lib/types";

export const profile: Profile = {
  name: "Luki Zainur",
  title: "Full-Stack Developer",
  location: "East Java, Indonesia",
  headline: "Building thoughtful software with an eye for craft.",
  bio: "I'm Luki — a full-stack developer from East Java who loves programming and design.",
  about: [
    "I'm a full-stack developer based in East Java, Indonesia. I care about the whole stack — from data models to the last pixel of an interface.",
    "I spend my time building tools that make development feel lighter, like markupless, a JavaScript framework with implicit reactivity and no build step.",
    "When I'm not coding, I'm configuring my Neovim setup, tinkering with dotfiles, or sketching the next idea.",
  ],
  email: "hello@luki.is-a.dev",
  availability: "Available for freelance & collaborations",
  stats: [
    { value: 5, label: "Years of tinkering" },
    { value: 30, label: "Repositories shipped" },
    { value: 8, label: "Featured projects" },
  ],
};
```

`src/lib/data/projects.ts` (8 entries; `description` is 2–3 real sentences per project; tags are filterable and shared across projects):

```ts
import type { Project } from "$lib/types";

export const projects: Project[] = [
  {
    slug: "markupless",
    title: "markupless",
    year: 2026,
    tagline: "A high-abstraction JavaScript framework with implicit reactivity and no build step.",
    description: [
      "markupless is a JavaScript framework built around implicit reactivity — state flows through the system without explicit subscription APIs.",
      "No JSX, no templates, no build step: plain logic with a tiny runtime. It powers its own documentation site.",
    ],
    tech: ["TypeScript", "JavaScript", "Docs"],
    tags: ["Framework", "Open Source"],
    cover: "/covers/markupless-1200.webp",
    github: "https://github.com/lzif/markupless",
    demo: "https://luki.is-a.dev/markupless/",
    featured: true,
  },
  {
    slug: "malas-finance",
    title: "malas-finance",
    year: 2026,
    tagline: "Personal finance, the lazy way.",
    description: [
      "A personal finance tracker for people who want to know where their money goes without the overhead.",
      "Built with TypeScript on a lightweight, fast stack — designed to make budgeting a few taps, not a spreadsheet.",
    ],
    tech: ["TypeScript", "Finance"],
    tags: ["App", "Personal"],
    cover: "/covers/malas-finance-1200.webp",
    github: "https://github.com/lzif/malas-finance",
    featured: true,
  },
  {
    slug: "zevy-note",
    title: "zevy-note",
    year: 2025,
    tagline: "Offline-first, secure note-taking with real-time collaboration.",
    description: [
      "A note-taking app built around privacy: offline-first storage, markdown support, and zero-knowledge encryption.",
      "Real-time collaboration on top of a Svelte codebase — notes you can trust, wherever you are.",
    ],
    tech: ["Svelte", "Markdown", "Encryption"],
    tags: ["App", "Privacy"],
    cover: "/covers/zevy-note-1200.webp",
    github: "https://github.com/lzif/zevy-note",
    demo: "https://zevy.my.id/",
    featured: true,
  },
  {
    slug: "visual-code-space",
    title: "Visual-Code-Space",
    year: 2025,
    tagline: "A modern code editor for Android.",
    description: [
      "An Android code editor with a clean, modern workspace — written in Kotlin.",
      "A playground for making mobile coding feel first-class rather than cramped.",
    ],
    tech: ["Kotlin", "Android"],
    tags: ["App", "Mobile"],
    cover: "/covers/visual-code-space-1200.webp",
    github: "https://github.com/lzif/Visual-Code-Space",
    featured: false,
  },
  {
    slug: "imphnen-skor",
    title: "imphnen-skor",
    year: 2025,
    tagline: "A scoring web app for the IMPhnen community.",
    description: [
      "A focused scoring application built for the IMPhnen community.",
      "Simple by design — get a score in, get a result out, no ceremony.",
    ],
    tech: ["HTML", "JavaScript"],
    tags: ["Web", "Tool"],
    cover: "/covers/imphnen-skor-1200.webp",
    github: "https://github.com/lzif/imphnen-skor",
    demo: "http://luki.is-a.dev/imphnen-skor/",
    featured: false,
  },
  {
    slug: "google-reverse-image-api",
    title: "google-reverse-image-api",
    year: 2025,
    tagline: "Google reverse image search, as an API.",
    description: [
      "A thin API wrapper around Google's reverse image search.",
      "Built for the times you need image lookup without a browser session.",
    ],
    tech: ["JavaScript", "API"],
    tags: ["Web", "Tool"],
    cover: "/covers/google-reverse-image-api-1200.webp",
    github: "https://github.com/lzif/google-reverse-image-api",
    demo: "https://google-reverse-image-api-two.vercel.app",
    featured: false,
  },
  {
    slug: "task-manager",
    title: "task-manager",
    year: 2024,
    tagline: "A small, dependable task manager.",
    description: [
      "One of my early JavaScript builds — a task manager that does exactly what it says.",
      "Kept as a reminder of how far the setup has come since.",
    ],
    tech: ["JavaScript"],
    tags: ["Web", "Tool"],
    cover: "/covers/task-manager-1200.webp",
    github: "https://github.com/lzif/task-manager",
    featured: false,
  },
  {
    slug: "personal-finance-tracker",
    title: "personal-finance-tracker",
    year: 2024,
    tagline: "A first-generation finance tracker.",
    description: [
      "An early exploration into personal finance software — the seed that grew into malas-finance.",
      "Plain JavaScript, honest architecture, and a lesson in data modeling.",
    ],
    tech: ["JavaScript", "Finance"],
    tags: ["App", "Personal"],
    cover: "/covers/personal-finance-tracker-1200.webp",
    github: "https://github.com/lzif/personal-finance-tracker",
    featured: false,
  },
];
```

`src/lib/data/skills.ts`:

```ts
import type { SkillGroup } from "$lib/types";

export const skillGroups: SkillGroup[] = [
  { category: "Languages", skills: ["TypeScript", "JavaScript", "Go", "Kotlin", "Lua", "Python"] },
  { category: "Frontend", skills: ["Svelte / SvelteKit", "Tailwind CSS", "Responsive Design"] },
  { category: "Backend", skills: ["Node.js", "REST APIs", "WebSockets"] },
  { category: "Tools", skills: ["Git", "Neovim", "Linux", "Android"] },
];
```

`src/lib/data/experience.ts`:

```ts
import type { ExperienceEntry } from "$lib/types";

export const experience: ExperienceEntry[] = [
  {
    year: "2026",
    title: "markupless — my own framework",
    description: "Built a build-step-free JavaScript framework with implicit reactivity, plus its docs site.",
  },
  {
    year: "2026",
    title: "malas-finance",
    description: "Designed and shipped a TypeScript personal finance app focused on zero friction.",
  },
  {
    year: "2025",
    title: "zevy-note",
    description: "Shipped an offline-first, encrypted note-taking app with real-time collaboration in Svelte.",
  },
  {
    year: "2025",
    title: "Android tooling",
    description: "Explored mobile development with a Kotlin code editor and community scoring apps.",
  },
  {
    year: "2024",
    title: "First projects",
    description: "Began shipping: task managers, finance trackers, and a detour through Go.",
  },
];
```

`src/lib/data/socials.ts`:

```ts
import type { Social } from "$lib/types";

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/lzif", icon: "github" },
  { label: "Email", href: "mailto:hello@luki.is-a.dev", icon: "mail" },
];
```

- [ ] **Step 3: Rewrite `src/lib/utils.ts`**

```ts
export function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 4: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: content layer — types, config, portfolio data"
```

---

### Task 4: Core primitives — Icon, Reveal, SectionHeader, SkillBadge, CTA, SocialLinks, Picture

**Files:**
- Create: `src/lib/components/Icon.svelte`
- Create: `src/lib/components/Reveal.svelte` + `src/lib/utils/reveal.ts`
- Create: `src/lib/components/SectionHeader.svelte`
- Create: `src/lib/components/SkillBadge.svelte`
- Create: `src/lib/components/CTA.svelte`
- Create: `src/lib/components/SocialLinks.svelte`
- Create: `src/lib/components/Picture.svelte`

**Interfaces:**
- Consumes: `cx` from `$lib/utils`, types from Task 3, design tokens from Task 2.
- Produces (exact props later tasks use):

```ts
// Icon.svelte props
let { name, size = 16, class: className = "" }: {
  name: "github" | "mail" | "external" | "arrow-right" | "arrow-up-right" | "sun" | "moon" | "menu" | "close" | "star";
  size?: number;
  class?: string;
} = $props();
```

```ts
// Reveal.svelte props
let { children, delay = 0 }: { children: import("svelte").Snippet; delay?: number } = $props();
```

```ts
// SectionHeader.svelte props
let { eyebrow, title, description, id, class: className }: {
  eyebrow?: string; title: string; description?: string; id?: string; class?: string;
} = $props();
```

```ts
// SkillBadge.svelte props
let { label }: { label: string } = $props();
```

```ts
// CTA.svelte props
let { href, children, variant = "primary", external = false, class: className }: {
  href: string; children: import("svelte").Snippet; variant?: "primary" | "ghost"; external?: boolean; class?: string;
} = $props();
```

```ts
// SocialLinks.svelte props
let { class: className }: { class?: string } = $props();
```

```ts
// Picture.svelte props
let { src, alt, width, height, class: className, priority = false }: {
  src: string;              // e.g. "/covers/markupless-1200.webp" — the -600 variant is derived
  alt: string; width: number; height: number; class?: string; priority?: boolean;
} = $props();
```

- [ ] **Step 1: `src/lib/utils/reveal.ts`**

```ts
export function reveal(element: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  element.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          element.classList.add("reveal-done");
          observer.disconnect();
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
```

- [ ] **Step 2: `src/lib/components/Reveal.svelte`**

```svelte
<script lang="ts">
  import { reveal } from "$lib/utils/reveal";

  let { children, delay = 0 }: { children: import("svelte").Snippet; delay?: number } = $props();
</script>

<div {@attach reveal} style:--reveal-delay="{delay}ms">
  {@render children()}
</div>
```

- [ ] **Step 3: `src/lib/components/Icon.svelte`**

Minimal inline-SVG icon set (currentColor, `fill="none" stroke="currentColor"`, `stroke-width="1.75"`, `viewBox="0 0 24 24"`, `aria-hidden="true"`):

```svelte
<script lang="ts">
  type IconName = "github" | "mail" | "external" | "arrow-right" | "arrow-up-right" | "sun" | "moon" | "menu" | "close" | "star";

  let { name, size = 16, class: className = "" }: { name: IconName; size?: number; class?: string } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  class={className}
>
  {#if name === "github"}
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  {:else if name === "mail"}
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  {:else if name === "external"}
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  {:else if name === "arrow-right"}
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  {:else if name === "arrow-up-right"}
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  {:else if name === "sun"}
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  {:else if name === "moon"}
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  {:else if name === "menu"}
    <path d="M4 6h16M4 12h16M4 18h16" />
  {:else if name === "close"}
    <path d="M18 6 6 18M6 6l12 12" />
  {:else if name === "star"}
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  {/if}
</svg>
```

- [ ] **Step 4: `src/lib/components/SectionHeader.svelte`**

```svelte
<script lang="ts">
  let { eyebrow, title, description, id, class: className = "" }: {
    eyebrow?: string; title: string; description?: string; id?: string; class?: string;
  } = $props();
</script>

<div id={id} class="scroll-mt-24 {className}">
  {#if eyebrow}
    <p class="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
  {/if}
  <h2 class="font-display text-4xl font-medium tracking-tight sm:text-5xl">{title}</h2>
  {#if description}
    <p class="mt-4 max-w-prose text-lg leading-relaxed text-muted">{description}</p>
  {/if}
</div>
```

- [ ] **Step 5: `src/lib/components/SkillBadge.svelte`**

```svelte
<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span class="inline-flex items-center rounded-full border border-line px-3 py-1 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-fg">
  {label}
</span>
```

- [ ] **Step 6: `src/lib/components/CTA.svelte`**

Primary: `bg-accent text-black hover:bg-fg hover:text-bg` (ensure contrast: accent on dark bg is 8.5:1; black text on accent is 8.5:1); ghost: `border border-line hover:border-accent hover:text-accent`.

```svelte
<script lang="ts">
  import Icon from "./Icon.svelte";
  import { cx } from "$lib/utils";

  let { href, children, variant = "primary", external = false, class: className = "" }: {
    href: string;
    children: import("svelte").Snippet;
    variant?: "primary" | "ghost";
    external?: boolean;
    class?: string;
  } = $props();
</script>

<a
  href={href}
  {external ? "target=_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  class={cx(
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm transition-all duration-300 ease-overshoot",
    variant === "primary" && "bg-accent text-black hover:-translate-y-0.5 hover:bg-fg hover:text-bg",
    variant === "ghost" && "border border-line text-fg hover:-translate-y-0.5 hover:border-accent hover:text-accent",
    className,
  )}
>
  {@render children()}
  {#if external}
    <Icon name="arrow-up-right" size={14} class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  {/if}
</a>
```

- [ ] **Step 7: `src/lib/components/SocialLinks.svelte`**

```svelte
<script lang="ts">
  import { socials } from "$lib/data/socials";
  import Icon from "./Icon.svelte";

  let { class: className = "" }: { class?: string } = $props();
</script>

<div class="flex items-center gap-2 {className}">
  {#each socials as social (social.href)}
    <a
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
      class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
      aria-label={social.label}
    >
      <Icon name={social.icon} size={16} />
    </a>
  {/each}
</div>
```

- [ ] **Step 8: `src/lib/components/Picture.svelte`**

```svelte
<script lang="ts">
  let { src, alt, width, height, class: className = "", priority = false }: {
    src: string; alt: string; width: number; height: number; class?: string; priority?: boolean;
  } = $props();

  let small = $derived(src.replace(/-1200\.webp$/, "-600.webp"));
</script>

<img
  {src}
  srcset="{small} 600w, {src} 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  {alt}
  {width}
  {height}
  loading={priority ? "eager" : "lazy"}
  fetchpriority={priority ? "high" : undefined}
  decoding="async"
  class={"rounded-xl border border-line object-cover " + className}
/>
```

- [ ] **Step 9: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/lib/components src/lib/utils/reveal.ts
git commit -m "feat: core primitives — icon, reveal, section header, cta, badges"
```

---

### Task 5: App shell — Nav, Footer, ThemeToggle, view transitions, error page

**Files:**
- Create: `src/lib/components/Nav.svelte`
- Create: `src/lib/components/Footer.svelte`
- Create: `src/lib/components/ThemeToggle.svelte`
- Create: `src/lib/utils/theme.ts`
- Rewrite: `src/routes/+layout.svelte`
- Rewrite: `src/routes/+error.svelte`
- Delete: nothing (old header/footer already removed in Task 1)

**Interfaces:**
- Consumes: `Icon`, `SocialLinks`, `cx` from Task 4; `profile`, `socials` from Task 3; tokens from Task 2.
- Produces: `<Nav />` + `<Footer />` used by `+layout.svelte`; `theme.ts` with `applyTheme(theme)` / `getTheme()` / `toggleTheme()`; `onNavigate` view-transition wiring; mobile menu dialog (Escape close, focus trap, focus return); scroll-aware nav.

- [ ] **Step 1: `src/lib/utils/theme.ts`**

```ts
import { browser } from "$app/environment";

export type Theme = "dark" | "light";

export function applyTheme(theme: Theme): void {
  if (!browser) return;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function getTheme(): Theme {
  if (!browser) return "dark";
  return (localStorage.getItem("theme") as Theme) ?? "dark";
}

export function toggleTheme(): void {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}
```

- [ ] **Step 2: `src/lib/components/ThemeToggle.svelte`**

Wrap the toggle in `document.startViewTransition` for a crossfade theme change (CSS `::view-transition-*` already styled in Task 2):

```svelte
<script lang="ts">
  import Icon from "./Icon.svelte";
  import { getTheme, toggleTheme, type Theme } from "$lib/utils/theme";

  let theme = $state<Theme>(getTheme());

  function handleClick() {
    const transition = (document as Document & { startViewTransition?: (cb: () => void) => void }).startViewTransition;
    if (transition) {
      transition(() => {
        toggleTheme();
        theme = getTheme();
      });
    } else {
      toggleTheme();
      theme = getTheme();
    }
  }
</script>

<button
  type="button"
  onclick={handleClick}
  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
  class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
>
  <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
</button>
```

- [ ] **Step 3: `src/lib/components/Nav.svelte`**

Desktop nav (hidden on mobile) + hamburger button + mobile dialog. Scroll-aware: hairline shadow past 4px via `<svelte:window onscroll>`.

```svelte
<script lang="ts">
  import Icon from "./Icon.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import { cx } from "$lib/utils";

  let scrolled = $state(false);
  let open = $state(false);
  let menuButton: HTMLButtonElement | undefined = $state();

  function handleScroll() {
    scrolled = window.scrollY > 4;
  }

  function openMenu() {
    open = true;
  }

  function closeMenu() {
    open = false;
    menuButton?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key === "Tab") {
      const focusables = Array.from(
        document.querySelectorAll<HTMLElement>("#mobile-menu a, #mobile-menu button"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const links = [
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
</script>

<svelte:window onscroll={handleScroll} onkeydown={handleKeydown} />

<header
  class={cx(
    "fixed inset-x-0 top-0 z-40 border-b bg-bg/80 backdrop-blur-md transition-shadow duration-300",
    scrolled ? "shadow-[0_1px_0_0_var(--line)]" : "border-transparent",
  )}
>
  <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Main">
    <a href="/" class="font-display text-lg tracking-tight transition-colors hover:text-accent">
      {profile.name.split(" ")[0].toLowerCase()}<span class="text-accent">.</span>
    </a>

    <div class="hidden items-center gap-8 sm:flex">
      {#each links as link (link.href)}
        <a href={link.href} class="text-sm text-muted transition-colors duration-300 hover:text-fg">{link.label}</a>
      {/each}
      <ThemeToggle />
    </div>

    <div class="flex items-center gap-3 sm:hidden">
      <ThemeToggle />
      <button
        bind:this={menuButton}
        type="button"
        onclick={openMenu}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg"
      >
        <Icon name="menu" size={16} />
      </button>
    </div>
  </nav>
</header>

{#if open}
  <div
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    class="fixed inset-0 z-50 flex flex-col bg-bg"
  >
    <div class="flex h-16 items-center justify-between px-6">
      <a href="/" class="font-display text-lg tracking-tight" onclick={closeMenu}>
        {profile.name.split(" ")[0].toLowerCase()}<span class="text-accent">.</span>
      </a>
      <button type="button" onclick={closeMenu} aria-label="Close menu" class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg">
        <Icon name="close" size={16} />
      </button>
    </div>
    <nav class="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
      {#each links as link (link.href)}
        <a
          href={link.href}
          onclick={closeMenu}
          class="border-b border-line py-5 font-display text-4xl transition-colors hover:text-accent"
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
```

Import `profile` from `$lib/data/profile` — required in script.

- [ ] **Step 4: `src/lib/components/Footer.svelte`**

```svelte
<script lang="ts">
  import SocialLinks from "./SocialLinks.svelte";
  import { profile } from "$lib/data/profile";
</script>

<footer class="border-t border-line">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
    <div>
      <p class="font-display text-lg tracking-tight">{profile.name}</p>
      <p class="mt-1 font-mono text-xs text-muted">© {new Date().getFullYear()} — built with SvelteKit</p>
    </div>
    <SocialLinks />
  </div>
</footer>
```

- [ ] **Step 5: Rewrite `src/routes/+layout.svelte`**

Full shell with view transitions, skip link, structured layout:

```svelte
<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { onNavigate } from "$app/navigation";
  import { site } from "$lib/config";
  import { profile } from "$lib/data/profile";

  let { children } = $props();

  onNavigate(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) {
      return new Promise((resolve) => {
        document.startViewTransition(() => resolve());
      });
    }
  });
</script>

<svelte:head>
  <title>{site.name}</title>
  <meta name="description" content={site.description} />
  <link rel="canonical" href={site.url} />
  <meta property="og:site_name" content={site.name} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-black"
>
  Skip to content
</a>

<Nav />

<main id="main" class="pt-16">
  {@render children()}
</main>

<Footer />
```

Note: `pt-16` offsets the fixed header. The canonical set in the layout is the fallback — each page overrides via its own `<svelte:head>` (Task 10 adds the `Seo` component that supersedes this minimal head usage).

- [ ] **Step 6: Rewrite `src/routes/+error.svelte`**

```svelte
<script lang="ts">
  import { page } from "$app/state";
  import { dev } from "$app/environment";

  let message = $derived(page.error?.message ?? "Something went wrong");
</script>

<svelte:head>
  <title>{page.status} — Luki Zainur</title>
</svelte:head>

<div class="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
  <p class="font-mono text-sm uppercase tracking-[0.2em] text-accent">{page.status}</p>
  <h1 class="mt-4 font-display text-6xl font-medium sm:text-7xl">Lost in the whitespace</h1>
  {#if dev}
    <p class="mt-4 max-w-prose text-muted">{message}</p>
  {/if}
  <a href="/" class="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm text-black transition-all duration-300 hover:-translate-y-0.5">
    Back home
  </a>
</div>
```

- [ ] **Step 7: Verify**

Run: `pnpm check` → 0 errors. Note: `$app/state` is SvelteKit ≥2.12 — installed version 2.70.2 supports it.
Run: `pnpm build` → succeeds.
Manual: `pnpm dev` → confirm no-FOUC theme, mobile menu opens/closes with Escape, focus returns to hamburger, nav gains shadow on scroll, `prefers-reduced-motion` keeps pages navigable.

- [ ] **Step 8: Commit**

```bash
git add src/lib/components/Nav.svelte src/lib/components/Footer.svelte src/lib/components/ThemeToggle.svelte src/lib/utils/theme.ts src/routes/+layout.svelte src/routes/+error.svelte
git commit -m "feat: app shell — nav, footer, theme toggle, view transitions"
```

---

### Task 6: Images & static assets — covers, OG image, manifest

**Files:**
- Create: `scripts/generate-assets.mjs`
- Create: `static/covers/` (generated)
- Create: `static/og.png` (generated)
- Modify: `static/site.webmanifest` (name/theme-color)

**Interfaces:**
- Consumes: `src/lib/data/projects.ts` (slug list for covers).
- Produces: `static/covers/<slug>-1200.webp` + `<slug>-600.webp` for all 8 projects; `static/og.png` 1200×630; referenced by `Picture.svelte` (`/covers/<slug>-1200.webp`) and `Seo` (Task 10, `/og.png`).

- [ ] **Step 1: Write `scripts/generate-assets.mjs`**

Abstract geometric covers (no text — titles live in markup; avoids font rendering issues). Dark canvas, per-project accent hues, amber family for consistency:

```js
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const slugs = [
  ["markupless", "#F59E0B"],
  ["malas-finance", "#F97316"],
  ["zevy-note", "#EAB308"],
  ["visual-code-space", "#FBBF24"],
  ["imphnen-skor", "#D97706"],
  ["google-reverse-image-api", "#F59E0B"],
  ["task-manager", "#B45309"],
  ["personal-finance-tracker", "#EA580C"],
];

const W = 1200;
const H = 900;

function svg(slug, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0A0908"/>
  <circle cx="200" cy="200" r="320" fill="${accent}" opacity="0.14"/>
  <circle cx="${W - 150}" cy="${H - 180}" r="420" fill="${accent}" opacity="0.08"/>
  <rect x="0" y="0" width="${W}" height="1" fill="${accent}" opacity="0.5"/>
  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="${accent}" opacity="0.3"/>
  <line x1="60" y1="${H - 140}" x2="${W - 60}" y2="${H - 140}" stroke="${accent}" stroke-opacity="0.35" stroke-width="2"/>
</svg>`;
}

mkdirSync("static/covers", { recursive: true });

for (const [slug, accent] of slugs) {
  const buffer = Buffer.from(svg(slug, accent));
  await sharp(buffer)
    .resize(1200, 900, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(`static/covers/${slug}-1200.webp`);
  await sharp(buffer)
    .resize(600, 450, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(`static/covers/${slug}-600.webp`);
  console.log(`cover: ${slug}`);
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0908"/>
  <circle cx="180" cy="160" r="280" fill="#F59E0B" opacity="0.18"/>
  <circle cx="1100" cy="520" r="360" fill="#F59E0B" opacity="0.1"/>
  <rect y="0" width="1200" height="2" fill="#F59E0B" opacity="0.6"/>
  <rect y="628" width="1200" height="2" fill="#F59E0B" opacity="0.4"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile("static/og.png");
console.log("og.png");
```

- [ ] **Step 2: Generate + verify**

Run: `node scripts/generate-assets.mjs`
Expected: 16 cover files + `og.png`. Verify with `ls -la static/covers/` and `file static/og.png` (must be `PNG image data, 1200 x 630`). Total covers < 60 kB each.

- [ ] **Step 3: Update `static/site.webmanifest`**

Set `name` to "Luki Zainur", `short_name` to "luki", `background_color`/`theme_color` to `#0A0908` (keep existing icons).

- [ ] **Step 4: Verify**

Run: `pnpm build` → succeeds; `build/covers/` populated.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-assets.mjs static/covers static/og.png static/site.webmanifest
git commit -m "feat: generate project covers and og image"
```

---

### Task 7: Home page

**Files:**
- Create: `src/lib/components/Counter.svelte` (count-up stat, spring-driven)
- Rewrite: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `profile`, `projects` (featured = 3), `skillGroups`, `experience` from Task 3; `SectionHeader`, `Reveal`, `CTA`, `SkillBadge`, `Icon`, `Picture` from Task 4; `site` config.
- Produces: full home page with hero (parallax + stat counters), featured projects, skills, about excerpt, timeline, contact CTA. Inline `<svelte:head>` with title/description/OG/JSON-LD Person.

- [ ] **Step 1: Write `src/routes/+page.svelte`**

Structure (sections in order): hero → featured projects → skills → about excerpt → timeline → CTA. Key implementation details:

Hero (serif headline fluid `text-5xl sm:text-6xl lg:text-7xl`, eyebrow mono, stats with springs):

```svelte
<script lang="ts">
  import { spring } from "svelte/motion";
  import { profile } from "$lib/data/profile";
  import { projects } from "$lib/data/projects";
  import { skillGroups } from "$lib/data/skills";
  import { experience } from "$lib/data/experience";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import SkillBadge from "$lib/components/SkillBadge.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Picture from "$lib/components/Picture.svelte";
  import Counter from "$lib/components/Counter.svelte";

  let featured = $derived(projects.filter((p) => p.featured).slice(0, 3));

  // parallax — only desktop, no reduced motion
  let drift = spring(0, { stiffness: 0.08, damping: 0.2 });
  function handleScroll() {
    if (window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const y = window.scrollY;
      if (y < window.innerHeight) drift.set(y * -0.12);
    }
  }

  const personJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: site.url,
    email: "mailto:" + profile.email,
  });
</script>

<svelte:window onscroll={handleScroll} />

<svelte:head>
  <title>{profile.name} — {profile.title}</title>
  <meta name="description" content={profile.bio} />
  <link rel="canonical" href={site.url} />
  <meta property="og:title" content={`${profile.name} — ${profile.title}`} />
  <meta property="og:description" content={profile.bio} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={site.url} />
  <meta property="og:image" content="{site.url}/og.png" />
  <meta name="twitter:title" content={`${profile.name} — ${profile.title}`} />
  <meta name="twitter:description" content={profile.bio} />
  <meta name="twitter:image" content="{site.url}/og.png" />
</svelte:head>

<!-- hero -->
<section class="relative overflow-hidden">
  <div
    class="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
    style={`transform: translate3d(0, ${$drift}px, 0)`}
    aria-hidden="true"
  >
    <div class="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"></div>
  </div>

  <div class="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        {profile.location} · {profile.availability}
      </p>
    </Reveal>
    <Reveal delay={80}>
      <h1 class="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        {profile.headline}
      </h1>
    </Reveal>
    <Reveal delay={160}>
      <p class="mt-8 max-w-xl text-lg leading-relaxed text-muted">{profile.bio}</p>
    </Reveal>
    <Reveal delay={240}>
      <div class="mt-10 flex flex-wrap items-center gap-4">
        <CTA href="/projects">View projects <Icon name="arrow-right" size={14} /></CTA>
        <CTA href="/about" variant="ghost">About me</CTA>
      </div>
    </Reveal>
    <Reveal delay={320}>
      <dl class="mt-20 grid grid-cols-3 gap-6 border-t border-line pt-8 sm:max-w-xl">
        {#each profile.stats as stat, i (stat.label)}
          <div>
            <dt class="order-2 mt-1 font-mono text-xs text-muted">{stat.label}</dt>
            <dd class="order-1 font-display text-3xl text-fg">
              <Counter value={stat.value} suffix={stat.suffix ?? ""} delay={i * 120} />
            </dd>
          </div>
        {/each}
      </dl>
    </Reveal>
  </div>
</section>
```

Add the `Counter` component as a sibling file (rune components must live in their own file — module-script functions cannot use instance runes):

`src/lib/components/Counter.svelte`:

```svelte
<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let { value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number } = $props();

  let shown = $state(0);
  let started = $state(false);

  function start() {
    if (started) return;
    started = true;
    const tween = tweened(0, { duration: 900, delay, easing: cubicOut });
    tween.subscribe((v) => (shown = Math.round(v)));
    tween.set(value);
  }
</script>

<span {@attach start}>
  {shown}{suffix}
</span>
```

> Note: `tween.set(value)` with the `{ value }` prop captured — because `start` runs once on attach, use `value` directly (do NOT re-run on value change; data is static).

Featured projects — grid with alternating editorial offset, cards link to `/projects/{slug}`:

```svelte
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader
        eyebrow="Selected work"
        title="Featured projects"
        description="A few things I've built recently — full list on the projects page."
      />
    </Reveal>
    <div class="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-2">
      {#each featured as project, i (project.slug)}
        <Reveal delay={i * 100} class="group">
          <a href={`/projects/${project.slug}`} class="group block" aria-label={`${project.title} — view project`}>
            <Picture src={project.cover} alt={`${project.title} cover`} width={1200} height={900} class="aspect-[4/3] w-full transition-transform duration-700 ease-overshoot group-hover:scale-[1.02]" />
            <div class="mt-5 flex items-baseline justify-between gap-4">
              <h3 class="font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
              <span class="font-mono text-xs text-muted">{project.year}</span>
            </div>
            <p class="mt-2 max-w-prose text-sm leading-relaxed text-muted">{project.tagline}</p>
            <ul class="mt-4 flex flex-wrap gap-2">
              {#each project.tech as t (t)}
                <li class="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
              {/each}
            </ul>
          </a>
        </Reveal>
      {/each}
    </div>
    <div class="mt-16">
      <CTA href="/projects" variant="ghost">All projects <Icon name="arrow-right" size={14} /></CTA>
    </div>
  </div>
</section>
```

> Note: `Reveal` currently renders a plain `<div>` — it must accept `class` and forward it. Update `Reveal.svelte` in this task: add `class: className = ""` prop, render `<div {@attach reveal} style:--reveal-delay="{delay}ms" class={className}>`. For the grid offset, alternate `md:translate-y-8` on odd items via `i % 2 === 1 ? "md:mt-16" : ""` on the Reveal class.

Skills — grouped badges:

```svelte
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader eyebrow="Toolbox" title="Skills & technologies" description="The languages and tools I reach for most." />
    </Reveal>
    <div class="mt-14 grid gap-12 sm:grid-cols-2">
      {#each skillGroups as group (group.category)}
        <div>
          <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-accent">{group.category}</h3>
          <ul class="mt-5 flex flex-wrap gap-2">
            {#each group.skills as skill (skill)}
              <li><SkillBadge label={skill} /></li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>
```

About excerpt (mono eyebrow, serif quote, link to /about):

```svelte
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">About</p>
      <blockquote class="mt-6 max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
        {profile.about[0]}
      </blockquote>
      <div class="mt-8">
        <CTA href="/about" variant="ghost">More about me <Icon name="arrow-right" size={14} /></CTA>
      </div>
    </Reveal>
  </div>
</section>
```

Timeline:

```svelte
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <Reveal>
      <SectionHeader eyebrow="Timeline" title="Recent chapters" />
    </Reveal>
    <ol class="mt-14 max-w-3xl">
      {#each experience as entry, i (entry.year + entry.title)}
        <Reveal delay={i * 80} class="group">
          <li class="relative border-l border-line pl-8 pb-12 last:pb-0">
            <span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"></span>
            <p class="font-mono text-xs text-muted">{entry.year}</p>
            <h3 class="mt-2 font-display text-xl font-medium">{entry.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
          </li>
        </Reveal>
      {/each}
    </ol>
  </div>
</section>
```

Contact CTA:

```svelte
<section class="border-t border-line">
  <div class="mx-auto max-w-6xl px-6 py-24 text-center">
    <Reveal>
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">Let's talk</p>
      <h2 class="mx-auto mt-6 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Have an idea worth building?
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-muted">{profile.availability}. I'd love to hear about it.</p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <CTA href={`mailto:${profile.email}`}>Say hello</CTA>
        <CTA href="/contact" variant="ghost">Contact page</CTA>
      </div>
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Update `Reveal.svelte` to accept `class`**

Add `class: className = ""` to the props and forward it:

```svelte
<script lang="ts">
  import { reveal } from "$lib/utils/reveal";

  let { children, delay = 0, class: className = "" }: {
    children: import("svelte").Snippet; delay?: number; class?: string;
  } = $props();
</script>

<div {@attach reveal} style:--reveal-delay="{delay}ms" class={className}>
  {@render children()}
</div>
```

For the featured grid offset, pass `class={i % 2 === 1 ? "md:mt-16" : ""}` on the Reveal of odd items.

- [ ] **Step 3: Verify**

Run: `pnpm check` → 0 errors (watch for: unused imports, `drift` store type — `spring` returns a store; template `$drift` needed — in runes mode `$drift` still works for stores; if svelte-check complains, use `{drift}` with a `.subscribe` or keep `$drift` — `$` prefix works).
Run: `pnpm build` → succeeds.
Run: `pnpm preview` + curl `http://localhost:4173/` → contains `Featured projects` and JSON-LD `<script type="application/ld+json">`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/Reveal.svelte
git commit -m "feat: home page — hero, featured projects, skills, timeline, cta"
```

---

### Task 8: Projects pages

**Files:**
- Create: `src/routes/projects/+page.svelte`
- Create: `src/routes/projects/+page.ts`
- Create: `src/routes/projects/[slug]/+page.svelte`
- Create: `src/routes/projects/[slug]/+page.ts`

**Interfaces:**
- Consumes: `projects` from Task 3; `Picture`, `Reveal`, `SectionHeader`, `CTA`, `Icon` from Task 4.
- Produces: `/projects` gallery with tag filtering (in-memory, keyed each); `/projects/[slug]` detail pages (prerendered via `entries()`); 404 for unknown slugs.

- [ ] **Step 1: `src/routes/projects/+page.ts`**

```ts
import type { Project } from "$lib/types";

export const prerender = true;

export function load(): { projects: Project[] } {
  return { projects };
}
```

Wait — `projects` must be imported here from `$lib/data/projects`:

```ts
import { projects } from "$lib/data/projects";
import type { Project } from "$lib/types";

export const prerender = true;

export function load(): { projects: Project[] } {
  return { projects };
}
```

- [ ] **Step 2: `src/routes/projects/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from "./$types";
  import Picture from "$lib/components/Picture.svelte";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { site } from "$lib/config";
  import { projects } from "$lib/data/projects";

  let { data }: { data: PageData } = $props();

  let tags = $derived(["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))]);
  let active = $state("All");
  let visible = $derived(active === "All" ? projects : projects.filter((p) => p.tags.includes(active)));
</script>

<svelte:head>
  <title>Projects — {site.name}</title>
  <meta name="description" content="A selection of projects I've built — frameworks, apps, and tools." />
  <link rel="canonical" href={`${site.url}/projects`} />
  <meta property="og:title" content={`Projects — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/projects`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <SectionHeader
      eyebrow="Portfolio"
      title="Projects"
      description="A curated selection of things I've built — frameworks, apps, and tools."
    />
  </Reveal>

  <Reveal delay={120}>
    <div class="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
      {#each tags as tag (tag)}
        <button
          type="button"
          onclick={() => (active = tag)}
          aria-pressed={active === tag}
          class={active === tag
            ? "rounded-full bg-accent px-4 py-1.5 font-mono text-xs text-black"
            : "rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-fg"}
        >
          {tag}
        </button>
      {/each}
    </div>
  </Reveal>

  <div class="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
    {#each visible as project (project.slug)}
      <Reveal class="group">
        <a href={`/projects/${project.slug}`} class="group block" aria-label={`${project.title} — view project`}>
          <Picture src={project.cover} alt={`${project.title} cover`} width={1200} height={900} class="aspect-[4/3] w-full transition-transform duration-700 ease-overshoot group-hover:scale-[1.02]" />
          <div class="mt-5 flex items-baseline justify-between gap-4">
            <h2 class="font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h2>
            <span class="font-mono text-xs text-muted">{project.year}</span>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            {#each project.tech as t (t)}
              <li class="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">{t}</li>
            {/each}
          </ul>
        </a>
      </Reveal>
    {/each}
  </div>
</section>
```

- [ ] **Step 3: `src/routes/projects/[slug]/+page.ts`**

```ts
import { error } from "@sveltejs/kit";
import { projects } from "$lib/data/projects";
import type { Project } from "$lib/types";

export const prerender = true;

export function entries(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }): { project: Project } {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) error(404, "Project not found");
  return { project };
}
```

- [ ] **Step 4: `src/routes/projects/[slug]/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from "./$types";
  import Picture from "$lib/components/Picture.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Reveal from "$lib/components/Reveal.svelte";
  import { site } from "$lib/config";

  let { data }: { data: PageData } = $props();
  let { project } = $derived(data);
</script>

<svelte:head>
  <title>{project.title} — {site.name}</title>
  <meta name="description" content={project.tagline} />
  <link rel="canonical" href={`${site.url}/projects/${project.slug}`} />
  <meta property="og:title" content={project.title} />
  <meta property="og:description" content={project.tagline} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`${site.url}/projects/${project.slug}`} />
  <meta property="og:image" content={`${site.url}${project.cover}`} />
  <meta name="twitter:title" content={project.title} />
  <meta name="twitter:description" content={project.tagline} />
  <meta name="twitter:image" content={`${site.url}${project.cover}`} />
</svelte:head>

<article class="mx-auto max-w-4xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <a href="/projects" class="font-mono text-xs text-muted transition-colors hover:text-accent">← All projects</a>
    <p class="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">{project.year} · {project.tags.join(" / ")}</p>
    <h1 class="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">{project.title}</h1>
  </Reveal>

  <Reveal delay={120}>
    <Picture src={project.cover} alt={`${project.title} cover`} width={1200} height={900} class="mt-12 aspect-[4/3] w-full" priority />
  </Reveal>

  <Reveal delay={160}>
    <div class="prose mt-12">
      {#each project.description as paragraph (paragraph)}
        <p class="text-lg leading-relaxed text-muted">{paragraph}</p>
      {/each}
    </div>

    <div class="mt-10 border-t border-line pt-8">
      <h2 class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Stack</h2>
      <ul class="mt-4 flex flex-wrap gap-2">
        {#each project.tech as t (t)}
          <li class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
        {/each}
      </ul>
    </div>

    <div class="mt-10 flex flex-wrap gap-4">
      <CTA href={project.github} external>Source on GitHub</CTA>
      {#if project.demo}
        <CTA href={project.demo} variant="ghost" external>Live demo</CTA>
      {/if}
    </div>
  </Reveal>
</article>
```

- [ ] **Step 5: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds; `build/projects/markupless/index.html` (and all 8 slugs) exist; `build/projects/index.html` exists.
Run: `pnpm preview` + curl `/projects` and `/projects/markupless` → 200 with expected content.

- [ ] **Step 6: Commit**

```bash
git add src/routes/projects
git commit -m "feat: projects gallery with filtering and detail pages"
```

---

### Task 9: About + Contact pages

**Files:**
- Create: `src/routes/about/+page.svelte`
- Create: `src/routes/contact/+page.svelte`

**Interfaces:**
- Consumes: `profile`, `skillGroups`, `experience`, `socials` from Task 3; `SectionHeader`, `Reveal`, `CTA`, `Icon`, `SocialLinks`, `SkillBadge` from Task 4.
- Produces: `/about` (biography, philosophy, workflow, stack) and `/contact` (methods, socials, CTA).

- [ ] **Step 1: `src/routes/about/+page.svelte`**

Sections: hero (serif headline + location mono), biography paragraphs (profile.about), philosophy & workflow (static editorial content — two columns with mono eyebrows), tech stack (skillGroups via SkillBadge), timeline reference (link to home). Full head metadata + canonical.

```svelte
<script lang="ts">
  import { profile } from "$lib/data/profile";
  import { skillGroups } from "$lib/data/skills";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import SkillBadge from "$lib/components/SkillBadge.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Icon from "$lib/components/Icon.svelte";
</script>

<svelte:head>
  <title>About — {site.name}</title>
  <meta name="description" content={`About ${profile.name}: ${profile.title} based in ${profile.location}.`} />
  <link rel="canonical" href={`${site.url}/about`} />
  <meta property="og:title" content={`About — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/about`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">{profile.location}</p>
    <h1 class="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
      Developer with a design eye.
    </h1>
  </Reveal>

  <div class="mt-16 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
    <Reveal>
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Biography</p>
        <div class="prose mt-6">
          {#each profile.about as paragraph (paragraph)}
            <p class="text-lg leading-relaxed text-muted">{paragraph}</p>
          {/each}
        </div>
      </div>
    </Reveal>

    <Reveal delay={100}>
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-accent">Philosophy</p>
        <div class="prose mt-6 space-y-6 text-muted">
          <p class="text-lg leading-relaxed">
            I believe good software is felt, not noticed. Interfaces should be quiet, fast, and
            forgiving — the craft shows in the details that don't call attention to themselves.
          </p>
          <p class="text-lg leading-relaxed">
            I'd rather ship a small, honest tool than a sprawling platform. Most of my projects
            start from a personal itch and stay lean on purpose.
          </p>
        </div>

        <p class="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent">Workflow</p>
        <ol class="mt-6 space-y-6">
          {#each ["Understand the problem before choosing the stack", "Prototype the interaction, then the pixels", "Ship small, measure, iterate", "Write for the person who reads the code next"] as step, i (step)}
            <li class="flex gap-4">
              <span class="font-display text-2xl text-accent">0{i + 1}</span>
              <p class="pt-1 text-muted">{step}</p>
            </li>
          {/each}
        </ol>
      </div>
    </Reveal>
  </div>

  <div class="mt-24">
    <Reveal>
      <SectionHeader eyebrow="Stack" title="Technologies I work with" />
    </Reveal>
    <div class="mt-12 grid gap-12 sm:grid-cols-2">
      {#each skillGroups as group (group.category)}
        <div>
          <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-accent">{group.category}</h3>
          <ul class="mt-5 flex flex-wrap gap-2">
            {#each group.skills as skill (skill)}
              <li><SkillBadge label={skill} /></li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>

  <div class="mt-24 border-t border-line pt-16 text-center">
    <Reveal>
      <h2 class="font-display text-3xl font-medium">Want to work together?</h2>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <CTA href={`mailto:${profile.email}`}>Email me</CTA>
        <CTA href="/projects" variant="ghost">See my work <Icon name="arrow-right" size={14} /></CTA>
      </div>
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: `src/routes/contact/+page.svelte`**

Contact methods (email card), social links, availability note, CTA. No form (static site — mailto).

```svelte
<script lang="ts">
  import { profile } from "$lib/data/profile";
  import { site } from "$lib/config";
  import Reveal from "$lib/components/Reveal.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import SocialLinks from "$lib/components/SocialLinks.svelte";
</script>

<svelte:head>
  <title>Contact — {site.name}</title>
  <meta name="description" content={`Get in touch with ${profile.name}.`} />
  <link rel="canonical" href={`${site.url}/contact`} />
  <meta property="og:title" content={`Contact — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/contact`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <p class="font-mono text-xs uppercase tracking-[0.25em] text-accent">{profile.availability}</p>
    <h1 class="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
      Let's build something together.
    </h1>
    <p class="mt-8 max-w-xl text-lg leading-relaxed text-muted">
      The inbox is open. Tell me what you're working on — I usually reply within a day or two.
    </p>
  </Reveal>

  <div class="mt-16 grid gap-6 md:grid-cols-2">
    <Reveal>
      <a
        href={`mailto:${profile.email}`}
        class="group block rounded-2xl border border-line p-8 transition-colors duration-300 hover:border-accent"
      >
        <Icon name="mail" size={20} class="text-accent" />
        <p class="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">Email</p>
        <p class="mt-2 font-display text-2xl break-all transition-colors group-hover:text-accent">{profile.email}</p>
      </a>
    </Reveal>
    <Reveal delay={100}>
      <a
        href="https://github.com/lzif"
        target="_blank"
        rel="noopener noreferrer"
        class="group block rounded-2xl border border-line p-8 transition-colors duration-300 hover:border-accent"
      >
        <Icon name="github" size={20} class="text-accent" />
        <p class="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">GitHub</p>
        <p class="mt-2 font-display text-2xl transition-colors group-hover:text-accent">lzif</p>
      </a>
    </Reveal>
  </div>

  <Reveal delay={160}>
    <div class="mt-16 border-t border-line pt-12">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">Elsewhere</p>
      <SocialLinks class="mt-6" />
    </div>
  </Reveal>
</section>
```

- [ ] **Step 3: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds; `build/about/` and `build/contact/` exist.
Run: `pnpm preview` + curl `/about`, `/contact` → 200.

- [ ] **Step 4: Commit**

```bash
git add src/routes/about src/routes/contact
git commit -m "feat: about and contact pages"
```

---

### Task 10: Blog — move under /blog, glob loader, restyle; RSS update

**Files:**
- Create: `src/routes/blog/+page.ts`
- Create: `src/routes/blog/+page.svelte`
- Create: `src/routes/blog/[slug]/+page.ts`
- Create: `src/routes/blog/[slug]/+page.svelte`
- Rewrite: `src/routes/rss.xml/+server.ts`
- Delete: `src/routes/blog/+page.ts`/`+page.svelte` (old), `src/routes/[slug]/` (already deleted Task 1)

**Interfaces:**
- Consumes: `Post` type, `formatDate`, `site` config, mdsvex rendering (existing `src/mdsvex.svelte` layout + shiki highlighter).
- Produces: `/blog` list (title/date/description cards) + `/blog/[slug]` posts; RSS at `/rss.xml` using the same glob loader; posts prerendered.

- [ ] **Step 1: Shared loader `src/lib/posts.ts`**

```ts
import type { Post } from "$lib/types";

const modules = import.meta.glob("/src/posts/*.md", { eager: true }) as Record<string, { metadata: Post }>;

export function getPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      ...mod.metadata,
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
    }))
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): { meta: Post; content: unknown } | null {
  const modules = import.meta.glob("/src/posts/*.md") as Record<string, () => Promise<{ metadata: Post; default: unknown }>>;
  const path = Object.keys(modules).find((p) => p.endsWith(`/${slug}.md`));
  if (!path) return null;
  return { meta: getPosts().find((p) => p.slug === slug)!, content: modules[path] };
}
```

> Note: the lazy `import.meta.glob` (no `eager`) returns loaders — but in `+page.ts` load functions we need the content synchronously for prerender... With prerender, `load` may be async. Use `await modules[path]()` in the route load instead of pre-wrapping. Simplify: export only `getPosts()` (eager) from `lib/posts.ts`; in `blog/[slug]/+page.ts` use a local eager glob for content:

`src/routes/blog/[slug]/+page.ts`:

```ts
import { error } from "@sveltejs/kit";
import { getPosts, type PostMeta } from "$lib/posts";

export const prerender = true;

export function entries(): { slug: string }[] {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export function load({ params }): { content: unknown; meta: PostMeta } {
  const modules = import.meta.glob("/src/posts/*.md", { eager: true }) as Record<string, { default: unknown; metadata: PostMeta }>;
  const path = Object.keys(modules).find((p) => p.endsWith(`/${params.slug}.md`));
  if (!path) error(404, "Post not found");
  return { content: modules[path].default, meta: modules[path].metadata };
}
```

`src/lib/posts.ts`:

```ts
import type { Post } from "$lib/types";

export type PostMeta = Post;

const modules = import.meta.glob("/src/posts/*.md", { eager: true }) as Record<string, { metadata: Post }>;

export function getPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      ...mod.metadata,
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
    }))
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
```

- [ ] **Step 2: `src/routes/blog/+page.ts`**

```ts
import { getPosts } from "$lib/posts";

export const prerender = true;

export function load() {
  return { posts: getPosts() };
}
```

- [ ] **Step 3: `src/routes/blog/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from "./$types";
  import Reveal from "$lib/components/Reveal.svelte";
  import SectionHeader from "$lib/components/SectionHeader.svelte";
  import { formatDate } from "$lib/utils";
  import { site } from "$lib/config";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blog — {site.name}</title>
  <meta name="description" content="Notes on software, tools, and the craft of building." />
  <link rel="canonical" href={`${site.url}/blog`} />
  <meta property="og:title" content={`Blog — ${site.name}`} />
  <meta property="og:url" content={`${site.url}/blog`} />
</svelte:head>

<section class="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24">
  <Reveal>
    <SectionHeader eyebrow="Writings" title="Blog" description="Notes on software, tools, and the craft of building." />
  </Reveal>
  <div class="mt-14 max-w-3xl">
    {#each data.posts as post, i (post.slug)}
      <Reveal delay={i * 60} class="group">
        <a href={`/blog/${post.slug}`} class="block border-b border-line py-8 transition-colors duration-300 group-hover:border-accent">
          <time class="font-mono text-xs text-muted" datetime={post.date}>{formatDate(post.date)}</time>
          <h2 class="mt-3 font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent">
            {post.title}
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>
        </a>
      </Reveal>
    {/each}
  </div>
</section>
```

- [ ] **Step 4: `src/routes/blog/[slug]/+page.svelte`**

```svelte
<script lang="ts">
  import type { PageData } from "./$types";
  import { formatDate } from "$lib/utils";
  import { site } from "$lib/config";

  let { data }: { data: PageData } = $props();
  let { content, meta } = $derived(data);
</script>

<svelte:head>
  <title>{meta.title} — {site.name}</title>
  <meta name="description" content={meta.description} />
  <link rel="canonical" href={`${site.url}/blog/${meta.slug}`} />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`${site.url}/blog/${meta.slug}`} />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <script type="application/ld+json">{@html JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: meta.title, description: meta.description, datePublished: meta.date, url: `${site.url}/blog/${meta.slug}` })}</script>
</svelte:head>

<article class="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
  <a href="/blog" class="font-mono text-xs text-muted transition-colors hover:text-accent">← All posts</a>
  <h1 class="mt-8 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{meta.title}</h1>
  <p class="mt-4 font-mono text-xs text-muted">{formatDate(meta.date)}</p>
  <div class="prose mt-12">
    {@render content()}
  </div>
</article>
```

> Note: mdsvex renders the markdown to a Svelte component — the current codebase uses `<svelte:component this={data.content} />`. In Svelte 5 runes mode, the modern equivalent is `<DynamicComponent this={...}>` — but a component instance can be invoked as a function: `{@render content()}` works only if `content` is a snippet. For mdsvex (component constructor), use `<DynamicComponent this={content} />` (import from `svelte`). Verify the actual type at implementation time: if `content` is a function returning render output, `{@render content()}` is correct; otherwise `<DynamicComponent>`.

- [ ] **Step 5: Rewrite `src/routes/rss.xml/+server.ts`**

```ts
import { site } from "$lib/config";
import { getPosts } from "$lib/posts";

export const prerender = true;

export function GET(): Response {
  const posts = getPosts();
  const headers = { "Content-Type": "application/xml" };
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${site.name}</title>
    <description>${site.description}</description>
    <link>${site.url}</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
      <item>
        <title>${post.title}</title>
        <description>${post.description}</description>
        <link>${site.url}/blog/${post.slug}</link>
        <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.date + "T00:00:00").toUTCString()}</pubDate>
      </item>`,
      )
      .join("")}
  </channel>
</rss>`;
  return new Response(xml, { headers });
}
```

- [ ] **Step 6: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds; `build/blog/` and `build/blog/first-post/index.html` exist.
Run: `pnpm preview` + curl `/blog`, `/blog/first-post`, `/rss.xml` → 200; RSS contains `/blog/` links.

- [ ] **Step 7: Commit**

```bash
git add src/lib/posts.ts src/routes/blog src/routes/rss.xml
git commit -m "feat: blog under /blog with glob loader, rss updated"
```

---

### Task 11: SEO pass — Seo component, robots.txt, sitemap.xml

**Files:**
- Create: `src/lib/components/Seo.svelte`
- Create: `src/routes/sitemap.xml/+server.ts`
- Create: `static/robots.txt`
- Modify: every page `<svelte:head>` block replaced with `<Seo ... />` usage (home, projects, project detail, about, contact, blog, post)

**Interfaces:**
- Consumes: `site` config; existing per-page metadata content (moved verbatim into Seo props).
- Produces: consistent head output everywhere; `/sitemap.xml` listing all routes; `static/robots.txt`.

- [ ] **Step 1: `src/lib/components/Seo.svelte`**

```svelte
<script lang="ts">
  import { site } from "$lib/config";

  let {
    title,
    description,
    path = "",
    type = "website",
    image = "/og.png",
    jsonLd,
  }: {
    title: string;
    description: string;
    path?: string;
    type?: string;
    image?: string;
    jsonLd?: Record<string, unknown>;
  } = $props();

  let canonical = $derived(`${site.url}${path}`);
  let ogImage = $derived(`${site.url}${image}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content={site.name} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  {#if jsonLd}
    <script type="application/ld+json">{@html JSON.stringify(jsonLd)}</script>
  {/if}
</svelte:head>
```

- [ ] **Step 2: Replace all per-page `<svelte:head>` blocks**

Home: `<Seo title={`${profile.name} — ${profile.title}`} description={profile.bio} jsonLd={personLd} />` where `personLd` is the Person object built in Task 7 (move the JSON-LD construction into the Seo prop). Remove the old inline head from `+page.svelte`.

Projects index: `<Seo title={`Projects — ${site.name}`} description="A selection of projects I've built — frameworks, apps, and tools." path="/projects" />`

Project detail: `<Seo title={`${project.title} — ${site.name}`} description={project.tagline} path={`/projects/${project.slug}`} type="article" image={project.cover} />`

About: `<Seo title={`About — ${site.name}`} description={...} path="/about" />`

Contact: `<Seo title={`Contact — ${site.name}`} description={...} path="/contact" />`

Blog index: `<Seo title={`Blog — ${site.name}`} description="Notes on software, tools, and the craft of building." path="/blog" />`

Blog post: `<Seo title={`${meta.title} — ${site.name}`} description={meta.description} path={`/blog/${meta.slug}`} type="article" jsonLd={blogPostingLd} />` (BlogPosting JSON-LD — construct from meta).

Layout `+layout.svelte`: keep only site-level head (og:site_name handled by Seo now; remove duplicate canonical from layout head — layout keeps `<title>` fallback only; note: `<title>` in layout + Seo in pages is fine — pages override). Remove the layout's canonical link.

- [ ] **Step 3: `src/routes/sitemap.xml/+server.ts`**

```ts
import { site } from "$lib/config";
import { projects } from "$lib/data/projects";
import { getPosts } from "$lib/posts";

export const prerender = true;

const staticRoutes = ["", "/projects", "/blog", "/about", "/contact"];

export function GET(): Response {
  const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
  const postRoutes = getPosts().map((p) => `/blog/${p.slug}`);
  const urls = [...staticRoutes, ...projectRoutes, ...postRoutes]
    .map(
      (route) =>
        `<url><loc>${site.url}${route}</loc><changefreq>monthly</changefreq></url>`,
    )
    .join("\n  ");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

- [ ] **Step 4: `static/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://luki.is-a.dev/sitemap.xml
```

- [ ] **Step 5: Verify**

Run: `pnpm check` → 0 errors.
Run: `pnpm build` → succeeds; `build/sitemap.xml`, `build/robots.txt` exist.
Run: `pnpm preview` + curl `/sitemap.xml` → contains all routes; curl `/robots.txt` → 200.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/Seo.svelte src/routes/sitemap.xml static/robots.txt src/routes
git commit -m "feat: seo — seo component, sitemap, robots"
```

---

### Task 12: Deployment, README, cleanup, final verification

**Files:**
- Modify: `.github/workflows/deploy.yml` (verify/align)
- Rewrite: `README.md`
- Delete: `src/app.d.ts` if unused after this task's check (verify first)
- Final: full verification run

**Interfaces:**
- Consumes: everything prior.
- Produces: deployable repo + docs.

- [ ] **Step 1: Verify/align `.github/workflows/deploy.yml`**

Confirm the existing workflow: pnpm 8 via `pnpm/action-setup@v3`, Node 20, `BASE_PATH: "/${{ github.event.repository.name }}"` env on the build step, `pnpm build`, upload `build/` artifact, `deploy-pages@v4`. It should already match — change ONLY if something mismatches (e.g., node version, artifact path). `svelte.config.js` reads `process.env.BASE_PATH` (Task 1) so the env var now actually takes effect.

- [ ] **Step 2: Rewrite `README.md`**

Sections: about (1–2 lines), tech stack, local dev (`pnpm install`, `pnpm dev`), content editing guide (data files table: `src/lib/data/profile.ts` → profile text; `projects.ts` → add/remove projects; `skills.ts`; `experience.ts`; `socials.ts`; `src/posts/*.md` → blog), asset regeneration (`node scripts/generate-assets.mjs`), deploy (push → GH Actions → GH Pages; custom domain note for `luki.is-a.dev`), project structure tree.

- [ ] **Step 3: Cleanup sweep**

Run: `grep -rn "open-props\|lucide\|eruda\|joyofcode\|Shakespeare" src/ static/ --include="*.svelte" --include="*.ts" --include="*.html" --include="*.css" || true`
Expected: no matches. Remove any stragglers. Verify `src/app.d.ts` content — if it only has the default `/// <reference types="@sveltejs/kit" />` it can stay.

- [ ] **Step 4: Full verification**

Run each and confirm:

```bash
pnpm check                          # 0 errors
pnpm build                          # succeeds, all routes prerendered
BASE_PATH="/lzif.github.io" pnpm build && git stash list --quiet || true   # base-path build also succeeds (re-run plain build after)
pnpm preview &
curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/                    # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/projects/markupless # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/does-not-exist      # 404 (fallback served)
curl -s http://localhost:4173/sitemap.xml | grep -c "<loc>"                       # >= 13
curl -s http://localhost:4173/rss.xml | grep -c "<item>"                          # >= 2
```

Check `build/` output: no `.html` missing for any route; `build/404.html` present.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: deployment docs and final cleanup"
```

---

## Self-Review Notes

- **Spec coverage:** every spec section maps to a task — structure (T1–T3), components list (T4–T5), pages (T7–T9), content model (T3), SEO (T11), a11y (T2/T5/T7), perf (T2/T4/T6/T11), deployment (T1/T12), motion (T2/T5/T7). Blog kept per user decision.
- **Placeholder scan:** no TBD/TODO. The two flagged runtime details (`{@render content()}` vs `<DynamicComponent>` for mdsvex, and `static/fonts` filename) have explicit "verify at implementation time" fallbacks with both branches given.
- **Type consistency:** `Project`/`SkillGroup`/`ExperienceEntry`/`Profile`/`Social`/`Post`/`SiteConfig` defined once in T3 and used identically everywhere; `Seo` props consistent across all pages; `Picture` derives the `-600.webp` from the `-1200.webp` name (T6 generation matches this convention).
