import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { tools } from "@/lib/tools";

export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const posts = await getPublishedPosts(1000), now = new Date(); return [{ url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 }, { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: .8 }, ...["about", "contact", "privacy-policy", "terms-of-service"].map((slug) => ({ url: absoluteUrl(`/${slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: .5 })), ...tools.map((tool) => ({ url: absoluteUrl(`/tools/${tool.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: .8 })), ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: new Date(post.updated_at), changeFrequency: "monthly" as const, priority: .7 }))]; }
