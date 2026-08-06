import { site } from "$lib/config";
import { projects } from "$lib/data/projects";
import { getPosts } from "$lib/posts";
import { escapeXml } from "$lib/utils";

export const prerender = true;

const staticRoutes = ["", "/projects", "/blog", "/about", "/contact"];

export function GET(): Response {
  const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
  const postRoutes = getPosts().map((p) => `/blog/${p.slug}`);
  // Two distinct escapes, both required, in this order. `encodeURI` makes the string a
  // *valid URL* — post slugs come from filenames, so "notes on rust.md" would otherwise
  // emit a `<loc>` containing raw spaces, which Search Console rejects outright.
  // `escapeXml` then makes that URL safe as *XML text*. Neither substitutes for the
  // other: encodeURI leaves `&` alone (it is a legal URL character), and escapeXml
  // leaves spaces alone.
  const urls = [...staticRoutes, ...projectRoutes, ...postRoutes]
    .map(
      (route) =>
        `<url><loc>${escapeXml(encodeURI(`${site.url}${route}`))}</loc><changefreq>monthly</changefreq></url>`,
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
