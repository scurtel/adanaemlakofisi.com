import Link from "next/link";
import BlogTable from "@/components/admin/BlogTable";
import { prisma } from "@/lib/db";
import { mapBlogPost } from "@/lib/mappers";
import adminStyles from "@/components/admin/admin.module.css";

export default async function AdminBlogPage() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  const posts = rows.map((r) => ({
    ...mapBlogPost(r),
    isPublished: r.isPublished,
  }));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 className={adminStyles.pageTitle}>Blog</h1>
          <p className={adminStyles.pageDesc} style={{ margin: 0 }}>{posts.length} yazı</p>
        </div>
        <Link href="/admin/blog/yeni" className="btn btn-primary">Yeni Yazı</Link>
      </div>
      <BlogTable posts={posts} />
    </>
  );
}
