"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Listing } from "@/types";
import { formatPrice, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/types";
import adminStyles from "./admin.module.css";

export default function ListingsTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={adminStyles.card} style={{ padding: 0, overflow: "auto" }}>
      <table className={adminStyles.table}>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Tip</th>
            <th>İlçe</th>
            <th>Fiyat</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>
                <strong>{listing.title}</strong>
                <br />
                <small style={{ color: "var(--color-gray-500)" }}>{listing.neighborhood}</small>
              </td>
              <td>
                {LISTING_TYPE_LABELS[listing.type]}
                <br />
                <small>{PROPERTY_TYPE_LABELS[listing.propertyType]}</small>
              </td>
              <td>{listing.district}</td>
              <td>{formatPrice(listing.price, listing.type)}</td>
              <td>
                {listing.isPublished ? (
                  <span className={`${adminStyles.badge} ${adminStyles.badgePublished}`}>Yayında</span>
                ) : (
                  <span className={`${adminStyles.badge} ${adminStyles.badgeDraft}`}>Taslak</span>
                )}
                {listing.featured && (
                  <>
                    <br />
                    <span className={`${adminStyles.badge} ${adminStyles.badgeFeatured}`}>Öne Çıkan</span>
                  </>
                )}
              </td>
              <td>
                <div className={adminStyles.actions}>
                  <Link href={`/admin/ilanlar/${listing.id}/duzenle`} className={adminStyles.linkBtn}>Düzenle</Link>
                  <button type="button" className={adminStyles.dangerBtn} onClick={() => handleDelete(listing.id)}>Sil</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listings.length === 0 && (
        <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-gray-500)" }}>İlan bulunamadı.</p>
      )}
    </div>
  );
}
