# Portfolio Rebuild — Design Spec

Date: 2026-08-04
Repo: `lzif/lzif.github.io` · Live: `https://luki.is-a.dev/`

## Purpose

Rebuild the current Svelte 4 blog template into a premium, editorial personal
portfolio for **Luki Zainur** (full-stack developer, East Java), deployed as a
fully static site on GitHub Pages. The site must be fast, accessible,
maintainable, and content-driven — editing a data file should be enough to
change any portfolio content.

## Decisions (agreed with user)

- **Full rebuild** on Svelte 5 + Tailwind CSS, replacing the Svelte 4 / open-props codebase.
- **Blog is kept**: markdown posts via mdsvex + shiki, same as today.
- **Projects**: curated static list in a data file (no live GitHub API fetching).
- **Experience timeline**: GitHub-history milestones as entries, editable in data file.
- **Theme**: dark-first, with a polished light alternate via a toggle; no FOUC.
- **Accent**: warm amber on a near-black/paper canvas.
- **Typography**: serif display (Fraunces) + sans body (Inter) + mono labels (JetBrains Mono).
- **Motion**: "liquid motion" — spring-driven, continuous, no animation libraries.
  Uses `svelte/motion` (Svelte core), the native View Transitions API, and a
  small custom IntersectionObserver reveal action.

## Technology

- SvelteKit (Svelte 5, runes)
- TypeScript strict
- Tailwind CSS v4 (CSS-first config, no config file; dark mode via custom variant)
- `@sveltejs/adapter-static` with `prerender = true`
- mdsvex + shiki (blog, unchanged behavior)
- `svelte/motion` for springs/tweened (core Svelte, no third-party dep)
- Zero animation libraries; icons inlined as tiny Svelte SVG components
- Fonts: `@fontsource` variable fonts, self-hosted, `display: swap`

## Project structure

```
src/
├─ routes/
│  ├─ +layout.svelte          # nav, footer, view-transition wrapper
│  ├─ +layout.ts              # prerender = true
│  ├─ +page.svelte            # Home
│  ├─ about/+page.svelte
│  ├─ projects/
│  │  ├─ +page.svelte         # gallery + tag filter
│  │  └─ [slug]/+page.svelte  # individual project page
│  ├─ contact/+page.svelte
│  ├─ blog/                   # kept: list + [slug] (mdsvex)
│  ├─ rss.xml/+server.ts
│  └─ sitemap.xml/+server.ts  # generated at build
├─ lib/
│  ├─ components/             # Nav, Footer, Hero, ProjectCard, SectionHeader,
│  │                          #   Timeline, SkillBadge, SkillSection, CTA,
│  │                          #   ThemeToggle, SocialLinks, Reveal, Icon
│  ├─ data/                   # profile.ts, projects.ts, skills.ts,
│  │                          #   experience.ts, socials.ts
│  ├─ types/                  # content types
│  └─ utils/                  # seo.ts, theme.ts, format.ts
├─ app.css                    # design tokens (CSS variables)
└─ app.html                   # inline theme init script (no FOUC)
static/                       # favicons, site.webmanifest, robots.txt
```

## Content model (`src/lib/data/`)

- `profile.ts` — name, title, bio, location, email, availability.
- `projects.ts` — ~8 curated projects chosen from the account at build time;
  candidates: `markupless`, `zevy-note`, `Visual-Code-Space`, `imphnen-skor`,
  `task-manager`, `google-reverse-image-api`, `personal-finance-tracker`,
  `malas`, `malas-finance` (each repo is its own project entry; final curated
  set is decided during implementation and stored in the data file).
  Each entry: slug, title, year, description, tech stack, tags, cover image,
  GitHub URL, optional live demo URL, optional detail content for the project page.
- `skills.ts` — grouped by category (languages, frontend, backend, tools).
- `experience.ts` — timeline entries derived from GitHub history milestones.
- `socials.ts` — GitHub, X, email, and any other links.

No UI component reads content from anywhere else. All fields typed in `src/lib/types/`.

## Pages

- **Home**: hero (eyebrow, serif headline, bio line, CTAs, stat counters) →
  featured projects (3) → skills → about excerpt → experience timeline → contact CTA.
- **Projects**: gallery of all projects with tag filtering (client-side, no URL
  param churn — filtered in memory), each card links to `projects/[slug]`.
- **Project page** (`projects/[slug]`): cover, description, tech, tags, GitHub
  + demo links, longer detail content.
- **About**: biography, design & development philosophy, workflow, tech stack.
- **Contact**: contact methods, social links, CTA.
- **Blog**: kept as-is in behavior (list + posts), restyled to the new system.

## Visual design system

### Typography
- Display: Fraunces variable (weights 400–600, italic), fluid `clamp()` sizing for headings.
- Body: Inter variable.
- Mono: JetBrains Mono for eyebrows, labels, metadata, code.
- All self-hosted via `@fontsource`; preload only hero-critical faces.

### Palette (dark-first; CSS variables power both themes)

| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#0A0908` | `#FAF9F7` | canvas |
| `fg` | `#F2EFEA` | `#1A1815` | primary text |
| `muted` | `#A8A29A` | `#6B655C` | secondary text |
| `line` | `#2A2722` | `#E4DFD8` | hairline borders |
| `accent` | `#F59E0B` | `#B45309` | links, highlights, focus |

Body contrast ≥ 10:1 both themes (AA/AAA).

### Composition
- Max content width ~1120px; 12-col grid for hero/projects; prose ≤ 65ch.
- Fluid section rhythm (py-24/32); 4px-based spacing scale.
- Hairline 1px borders instead of shadows; accent reserved for links,
  eyebrows, focus rings, timeline dots, primary CTA.

## Motion (liquid)

- Global easing: `cubic-bezier(0.22, 1, 0.36, 1)`; overshoot variant
  `cubic-bezier(0.34, 1.56, 0.64, 1)` for springs/micro-interactions.
- Page transitions: View Transitions API via `onNavigate` — crossfade + slide,
  ~250ms; also used for theme-switch crossfade. No JS → instant navigation.
- Reveals: `reveal` Svelte action (IntersectionObserver), fade + rise 12–24px,
  ~600ms, velocity-based stagger, runs once.
- Springs (`svelte/motion`): hero stat counters (tweened, overshoot),
  hero parallax drift smoothed with spring.
- Scroll-aware: nav hairline shadow after 4px, 300ms fade; hero parallax only
  on large screens.
- Hover: underline sweep (background-size), card lift + hairline→accent border,
  button translate/fill, image scale 1.02 over ~700ms.
- Timing language: entrances 500–700ms, micro 200–300ms, ambient unbounded.
- `prefers-reduced-motion: reduce`: single global override to instant; reveal
  and parallax early-return; counters render final values; View Transitions
  become plain crossfades.

## SEO

- `seo()` helper in `lib/utils/seo.ts` per page: title, description, canonical,
  Open Graph, Twitter Cards (`summary_large_image`).
- JSON-LD: `Person` (home), `BlogPosting` (posts), `WebSite` (sitewide).
- Static `robots.txt`; `sitemap.xml` generated at build via `+server.ts`.
- `lang="en"`, unique `svelte:head` titles per route.

## Accessibility

- Semantic landmarks (`header/main/nav/footer`), single `h1` per page.
- Skip-to-content link first in tab order.
- Mobile menu as dialog: `Escape` close, focus trap, focus return.
- Visible `:focus-visible` rings (accent, 2px offset).
- All text AA+, `alt` on images, decorative images `aria-hidden`.
- External links `rel="noopener noreferrer"`; descriptive labels.

## Performance

- All images pre-generated `.webp`/AVIF in `static/`; loader component with
  `sizes`/`srcset`, `loading="lazy"`, explicit width/height (no CLS);
  `fetchpriority="high"` on hero only.
- Fonts preloaded selectively, `display: swap`.
- No runtime icon library; inline SVG components.
- App hydration payload target ≈ 40–60 kB gz; all routes prerendered.
- Target: 100/100/100/100 Lighthouse (mobile, throttled), FCP < 1s, no CLS.

## Deployment

- Existing GH Actions workflow shape: pnpm + Node 20, `BASE_PATH` env →
  `paths.base` in `svelte.config.js` (empty for `luki.is-a.dev`, works under
  any repo path), adapter-static `fallback: "404.html"`, deploy-pages.
- Remove dead Svelte 4 template remnants: `Hello.svelte`,
  `lib/components/custom/`, open-props deps, `routes/api/posts`, unused server
  routes, unused packages (`lucide-svelte`, `svelte-persisted-store` unless reused).
- Keep blog content (`src/posts/`) and the deploy workflow.

## Verification

- `pnpm check` (svelte-check, strict) — zero errors.
- `pnpm build` — static output, every route prerendered.
- `pnpm preview` + curl key routes; verify `robots.txt`, `sitemap.xml`, 404.
- Manual pass: Lighthouse (all 100s), reduced-motion, keyboard-only, both themes.

## Out of scope

- Server APIs, live repo fetching, contact form backend (contact = mailto + links).
- Image CDN; blog redesign; multi-language support.
