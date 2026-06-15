import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLeadCounts } from "@/lib/queries/leads";
import adminStyles from "@/components/admin/admin.module.css";

export default async function AdminDashboardPage() {
  const [listingCount, publishedCount, blogCount, leadCounts] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    getLeadCounts(),
  ]);

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Dashboard</h1>
      <p className={adminStyles.pageDesc}>Site yönetim özeti</p>

      <div className={adminStyles.stats}>
        <div className={adminStyles.statCard}>
          <strong>{listingCount}</strong>
          <span>Toplam İlan</span>
        </div>
        <div className={adminStyles.statCard}>
          <strong>{publishedCount}</strong>
          <span>Yayındaki İlan</span>
        </div>
        <div className={adminStyles.statCard}>
          <strong>{blogCount}</strong>
          <span>Blog Yazısı</span>
        </div>
        <div className={adminStyles.statCard}>
          <strong>{leadCounts.yeni}</strong>
          <span>Yeni Lead</span>
        </div>
      </div>

      <div className={adminStyles.card}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Hızlı İşlemler</h2>
        <div className={adminStyles.actions} style={{ marginTop: "1rem" }}>
          <Link href="/admin/ilanlar/yeni" className="btn btn-primary">Yeni İlan Ekle</Link>
          <Link href="/admin/blog/yeni" className="btn btn-navy">Yeni Blog Yazısı</Link>
          <Link href="/admin/leadler" className="btn btn-navy">Leadleri Gör</Link>
        </div>
      </div>
    </>
  );
}
