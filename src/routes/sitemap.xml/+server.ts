import { site } from "$lib/config";
import { projects } from "$lib/data/projects";
import { getPosts } from "$lib/posts";
import { escapeXml } from "$lib/utils";

export const prerender = true;

const staticRoutes = ["", "/projects", "/blog", "/about", "/contact"];

export function GET(): Response {
  const projectRoutes = projects.map((p) => `/projects/${p.slug}`);
  const postRoutes = getPosts().map((p) => `/blog/${p.slug}`);
  const urls = [...staticRoutes, ...projectRoutes, ...postRoutes]
    .map(
      (route) =>
        `<url><loc>${escapeXml(`${site.url}${route}`)}</loc><changefreq>monthly</changefreq></url>`,
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
