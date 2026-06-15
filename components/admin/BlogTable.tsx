"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/types";
import adminStyles from "./admin.module.css";

export default function BlogTable({ posts }: { posts: (BlogPost & { isPublished: boolean })[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={adminStyles.card} style={{ padding: 0, overflow: "auto" }}>
      <table className={adminStyles.table}>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Kategori</th>
            <th>Tarih</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td><strong>{post.title}</strong></td>
              <td>{post.category || "—"}</td>
              <td>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</td>
              <td>
                {post.isPublished ? (
                  <span className={`${adminStyles.badge} ${adminStyles.badgePublished}`}>Yayında</span>
                ) : (
                  <span className={`${adminStyles.badge} ${adminStyles.badgeDraft}`}>Taslak</span>
                )}
              </td>
              <td>
                <div className={adminStyles.actions}>
                  <Link href={`/admin/blog/${post.id}/duzenle`} className={adminStyles.linkBtn}>Düzenle</Link>
                  <button type="button" className={adminStyles.dangerBtn} onClick={() => handleDelete(post.id)}>Sil</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
