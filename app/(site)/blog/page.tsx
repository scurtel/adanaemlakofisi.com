import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getPublishedBlogPosts } from "@/lib/queries/blog";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";

export const metadata: Metadata = createPageMetadata({
  title: "Blog & Rehber",
  description:
    "Adana'da ev alırken, kiralık konut ararken ve gayrimenkul yatırımı yaparken bilmeniz gerekenler. Uzman rehber yazıları.",
  path: "/blog",
});

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
            { name: "Ana Sayfa", url: SITE_CONFIG.url },
            { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
          ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Blog & Rehber</li>
            </ol>
          </nav>
          <h1>Blog & Rehber</h1>
          <p>Adana gayrimenkul piyasası hakkında bilgilendirici yazılar.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
