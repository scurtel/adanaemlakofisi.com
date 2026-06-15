import BlogForm from "@/components/admin/BlogForm";
import adminStyles from "@/components/admin/admin.module.css";

export default function NewBlogPage() {
  return (
    <>
      <h1 className={adminStyles.pageTitle}>Yeni Blog Yazısı</h1>
      <p className={adminStyles.pageDesc}>Rehber veya bilgilendirici yazı ekleyin</p>
      <BlogForm />
    </>
  );
}
