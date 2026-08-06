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
