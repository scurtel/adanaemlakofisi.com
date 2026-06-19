import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogContent from "@/components/blog/BlogContent";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { parseFaqsFromContent } from "@/lib/blog/parseFaqs";
import { getBlogBySlug, getRelatedBlogPosts } from "@/lib/queries/blog";
import { getSiteSettingsSafe } from "@/lib/queries/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";
import { blogPostingSchema, breadcrumbSchema, faqSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "./blog-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return createPageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage || DEFAULT_OG_IMAGE,
    ogType: "article",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getBlogBySlug(slug),
    getSiteSettingsSafe(),
  ]);
  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(post.slug, post.tags, 3);
  const faqs = parseFaqsFromContent(post.content);
  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const date = new Date(post.publishedAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const schemaData = safeSchemaData([
    blogPostingSchema(post, settings.siteName),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: SITE_CONFIG.url },
      { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
      { name: post.title, url: postUrl },
    ]),
    faqs.length > 0 ? faqSchema(faqs) : null,
  ]);

  return (
    <>
      {schemaData.length > 0 && <SeoJsonLd data={schemaData} />}

      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li>{post.title}</li>
            </ol>
          </nav>
          <h1>{post.title}</h1>
          <p className={styles.meta}>
            <time dateTime={post.publishedAt}>{date}</time>
            {" · "}
            {post.author}
          </p>
        </div>
      </header>

      <article className="section">
        <div className={`container ${styles.content}`}>
          <BlogContent content={post.content} />
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <aside className={styles.relatedPosts} aria-label="İlgili yazılar">
              <h2>İlgili Yazılar</h2>
              <ul className={styles.relatedList}>
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
