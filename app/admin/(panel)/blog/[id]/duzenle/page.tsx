import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { mapBlogPost } from "@/lib/mappers";
import BlogForm from "@/components/admin/BlogForm";
import adminStyles from "@/components/admin/admin.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const row = await prisma.blogPost.findUnique({ where: { id } });
  if (!row) notFound();
  const post = { ...mapBlogPost(row), id: row.id, isPublished: row.isPublished };

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Blog Düzenle</h1>
      <p className={adminStyles.pageDesc}>{post.title}</p>
      <BlogForm initial={post} />
    </>
  );
}
