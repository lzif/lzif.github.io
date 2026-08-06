# luki.is-a.dev

Personal portfolio and blog for Luki Zainur — a fully static SvelteKit site, prerendered at
build time and served from GitHub Pages at <https://luki.is-a.dev>.

## Tech stack

| Layer       | Choice                                                                        |
| ----------- | ----------------------------------------------------------------------------- |
| Framework   | SvelteKit 2 with Svelte 5 (runes only — `$state` / `$derived` / `$props`)     |
| Rendering   | `@sveltejs/adapter-static`, everything prerendered, no server at runtime      |
| Styling     | Tailwind CSS 4 (`@tailwindcss/vite`), design tokens in `src/app.css`          |
| Content     | mdsvex for blog posts, Shiki (`poimandres`) for syntax highlighting           |
| Fonts       | Inter + JetBrains Mono via Fontsource, Fraunces self-hosted in `static/fonts` |
| Images      | `sharp`, used only by the offline asset generator                             |
| Package mgr | pnpm                                                                          |

## Local development

```bash
pnpm install
pnpm dev            # http://localhost:5173
```

Other scripts:

```bash
pnpm build          # production build into build/
pnpm preview        # serve build/ at http://localhost:4173
pnpm check          # svelte-check against tsconfig.json
pnpm lint           # prettier --check .
pnpm format         # prettier --write .
```

## Editing content

All portfolio facts live in data modules. Components never hardcode them, so a text change
is always a data-file change — you should not need to open a `.svelte` file to update the
site's content. (The one accepted exception is `static/robots.txt`, which cannot import
config.)

| File                         | What it controls                                                        |
| ---------------------------- | ----------------------------------------------------------------------- |
| `src/lib/config.ts`          | Site name, canonical URL, default description (feeds SEO, sitemap, RSS) |
| `src/lib/data/profile.ts`    | Name, title, location, headline, bio, about paragraphs, email, stats    |
| `src/lib/data/projects.ts`   | The project list — add, remove, reorder, mark `featured`                |
| `src/lib/data/skills.ts`     | Skill groups shown on the home and about pages                          |
| `src/lib/data/experience.ts` | Timeline entries                                                        |
| `src/lib/data/socials.ts`    | Social links (also the source of the GitHub link on the contact page)   |
| `src/posts/*.md`             | Blog posts                                                              |

Shapes for all of these are defined once in `src/lib/types.ts`; TypeScript will tell you if
an entry is missing a field.

### Adding a project

Append an entry to `src/lib/data/projects.ts`. The `slug` becomes the route
(`/projects/<slug>`) and must match the cover filenames. Set `cover` to
`/covers/<slug>-1200.webp` — `Picture` derives the 600px variant from that name, so both
sizes must exist. See "Regenerating cover images" below.

### Writing a blog post

Create `src/posts/<slug>.md`. The filename (minus `.md`) is the URL slug. Frontmatter:

```markdown
---
title: Post title
description: One-line summary, used for SEO and the RSS feed.
date: "2026-01-15"
categories:
  - sveltekit
published: true
---
```

`published` must be exactly `true` or `false` — lowercase and unquoted. Anything else
(`False`, `"false"`, a missing key, a duplicate key) is a hard build failure by design; see
the long comment in `vite.config.ts` for why. A `published: false` post is stripped before
compilation, so its body and even its title never reach the client bundle — only its
filename does, so name drafts neutrally if the title is sensitive.

Code fences are highlighted by Shiki, which must have the language preloaded. The set is
listed in `svelte.config.js` (`javascript`, `typescript`, `svelte`, `html`, `css`, `json`,
`bash`, `markdown`, plus unlabelled fences). Fencing a language outside that list fails the
build — add it to the list.

### Regenerating cover images

```bash
node scripts/generate-assets.mjs      # from the repo root
```

Two caveats:

- **Run it from the repo root.** All of its paths (`static/covers/...`, `static/og.png`) are
  relative to the current working directory, so running it from anywhere else writes the
  files into the wrong place.
- **Its slug list is hardcoded in the script.** Adding a project to
  `src/lib/data/projects.ts` is not enough — you must also add the `[slug, accentColor]`
  pair to the `slugs` array at the top of `scripts/generate-assets.mjs`, otherwise no cover
  is generated and the project card renders a broken image.

It writes `static/covers/<slug>-1200.webp`, `static/covers/<slug>-600.webp` and
`static/og.png`. The generated assets are committed, so this only needs re-running when the
slug list or the artwork changes.

## Deployment

Pushing to the repository triggers `.github/workflows/deploy.yml`: pnpm 8 + Node 20,
`pnpm install`, `pnpm run build`, then the `build/` directory is uploaded with
`actions/upload-pages-artifact` and published by `actions/deploy-pages`.

The site is served at the custom domain **`luki.is-a.dev`**, configured in the repository's
**Settings → Pages → Custom domain**. There is no `CNAME` file in `static/`; GitHub persists
the custom-domain setting itself for Actions-based deploys. `src/lib/config.ts` holds the
same origin as `site.url`, and that is what canonical URLs, `sitemap.xml`, `rss.xml` and
`robots.txt` are built from — change it there if the domain ever moves.

This is a GitHub Pages **user site**, so it is served from the root of its origin and the
app's base path is empty. `svelte.config.js` sets `paths.base` from `BASE_PATH`, which is
deliberately unset in CI and therefore resolves to `""`. Do not set it: with a non-empty
base, every root-absolute link and asset path in the site fails prerendering.

## Project structure

```
.github/workflows/deploy.yml   build + publish to GitHub Pages
scripts/generate-assets.mjs    offline cover/og image generator (sharp)
src/
  app.css                      design tokens, theme, reveal + motion, prose styles
  app.d.ts                     ambient types (App namespace, themechange event)
  app.html                     document shell
  mdsvex.svelte                layout wrapper applied to every post
  lib/
    config.ts                  site name / url / description
    types.ts                   Project, SkillGroup, ExperienceEntry, Profile, Social, Post
    posts.ts                   loads + validates + sorts src/posts/*.md
    utils.ts                   formatDate, cx, escapeXml
    utils/reveal.ts            IntersectionObserver reveal attachment
    utils/theme.ts             dark/light persistence + themechange event
    data/                      profile, projects, skills, experience, socials
    components/                CTA, Counter, Footer, Icon, Nav, Picture, Reveal,
                               SectionHeader, Seo, SkillBadge, SocialLinks, ThemeToggle
  posts/                       blog posts (.md)
  routes/
    +layout.svelte  +layout.ts  +page.svelte  +error.svelte
    about/  contact/
    projects/  projects/[slug]/
    blog/      blog/[slug]/
    rss.xml/   sitemap.xml/
static/                        favicons, fonts, generated covers, og.png, robots.txt
```
