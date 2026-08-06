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

  // `path` is built from route params (post/project slugs, which come from filenames),
  // so it can legitimately contain characters that are invalid in a URL — a space in
  // particular. A canonical/og:url carrying a raw space is ignored by crawlers, so
  // encode before emitting. Attribute values are escaped by Svelte itself, so unlike
  // the sitemap no XML escaping is needed on top.
  let canonical = $derived(encodeURI(`${site.url}${path}`));
  let ogImage = $derived(encodeURI(`${site.url}${image}`));

  // Must be emitted as ONE {@html} of the entire <script> element. Putting {@html}
  // *inside* a literal <script> tag does not compile — it renders as literal text.
  let jsonLdTag = $derived(
    jsonLd
      ? `<script type="application/ld+json">` +
          JSON.stringify(jsonLd).replace(/</g, "\\u003c") +
          `<\/script>`
      : "",
  );
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
    {@html jsonLdTag}
  {/if}
</svelte:head>
