import type { MetadataRoute } from "next";
import { DISTRICTS } from "@/lib/constants";
import { SITE_CONFIG } from "@/lib/constants";
import { getPublishedBlogPosts } from "@/lib/queries/blog";
import { getListingsSafe } from "@/lib/queries/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/satilik`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/kiralik`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/hizmetler`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/gizlilik-politikasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const districtPages: MetadataRoute.Sitemap = DISTRICTS.map((d) => ({
    url: `${base}/adana/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const listings = await getListingsSafe();
  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/ilan/${l.slug}`,
    lastModified: new Date(l.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const posts = await getPublishedBlogPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...districtPages, ...listingPages, ...blogPages];
}
