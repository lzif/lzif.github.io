export const prerender = true;

import { site } from "$lib/config";
import type { Post } from "$lib/types";

export async function GET({ fetch }) {
  const response = await fetch("api/posts");
  const posts: Post[] = await response.json();

  const headers = { "Content-Type": "application/xml" };

  const xml = `
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
							<link>${site.url}/${post.slug}</link>
							<guid isPermaLink="true">${site.url}/${post.slug}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`,
          )
          .join("")}
			</channel>
		</rss>
	`.trim();

  return new Response(xml, { headers });
}
