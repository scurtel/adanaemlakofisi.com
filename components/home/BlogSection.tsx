import BlogCard from "@/components/blog/BlogCard";
import { getPublishedBlogPosts } from "@/lib/queries/blog";
import Link from "next/link";
import styles from "./BlogSection.module.css";

export default async function BlogSection() {
  const posts = (await getPublishedBlogPosts()).slice(0, 3);

  return (
    <section className="section" aria-labelledby="blog-title">
      <div className="container">
        <h2 id="blog-title" className="section-title">
          Blog & Rehber
        </h2>
        <p className="section-subtitle">
          Adana&apos;da konut alımı, kiralama ve yatırım konularında bilgilendirici yazılar.
        </p>
        <div className={`grid-3 ${styles.grid}`}>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className={styles.action}>
          <Link href="/blog" className="btn btn-navy">
            Tüm Yazılar
          </Link>
        </div>
      </div>
    </section>
  );
}
