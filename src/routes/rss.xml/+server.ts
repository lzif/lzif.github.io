import { site } from "$lib/config";
import { getPosts } from "$lib/posts";
import { escapeXml } from "$lib/utils";

export const prerender = true;

export function GET(): Response {
  const posts = getPosts();
  const headers = { "Content-Type": "application/xml" };

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${escapeXml(site.url)}</link>
    <atom:link href="${escapeXml(`${site.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${escapeXml(`${site.url}/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${site.url}/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, { headers });
}
