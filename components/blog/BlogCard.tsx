import Link from "next/link";
import type { BlogPost } from "@/types";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.publishedAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <time className={styles.date} dateTime={post.publishedAt}>
          {date}
        </time>
        <h3 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Devamını Oku →
        </Link>
      </div>
    </article>
  );
}
