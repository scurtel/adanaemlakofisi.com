import Link from "next/link";
import ListingsTable from "@/components/admin/ListingsTable";
import { getAllListingsAdmin } from "@/lib/queries/listings";
import adminStyles from "@/components/admin/admin.module.css";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    district?: string;
    search?: string;
  }>;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const listings = await getAllListingsAdmin({
    type: params.type as "satilik" | "kiralik" | undefined,
    district: params.district,
    search: params.search,
    publishedOnly: false,
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 className={adminStyles.pageTitle}>İlanlar</h1>
          <p className={adminStyles.pageDesc} style={{ margin: 0 }}>{listings.length} ilan</p>
        </div>
        <Link href="/admin/ilanlar/yeni" className="btn btn-primary">Yeni İlan</Link>
      </div>
      <ListingsTable listings={listings} />
    </>
  );
}
