"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/types";
import adminStyles from "./admin.module.css";

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: string;
  listing?: { id: string; title: string; slug: string } | null;
}

export default function LeadsTable({
  leads,
  currentStatus,
}: {
  leads: LeadRow[];
  currentStatus?: string;
}) {
  const router = useRouter();

  async function updateStatus(id: string, status: LeadStatus) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu lead'i silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <div className={adminStyles.toolbar}>
        <select
          value={currentStatus || ""}
          onChange={(e) => {
            const v = e.target.value;
            router.push(v ? `/admin/leadler?status=${v}` : "/admin/leadler");
          }}
        >
          <option value="">Tüm Durumlar</option>
          {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className={adminStyles.card} style={{ padding: 0, overflow: "auto" }}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Telefon</th>
              <th>Kaynak</th>
              <th>İlan</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.name}</strong>
                  {lead.email && <><br /><small>{lead.email}</small></>}
                </td>
                <td>{lead.phone}</td>
                <td>{lead.source}</td>
                <td>
                  {lead.listing ? (
                    <Link href={`/ilan/${lead.listing.slug}`} className={adminStyles.linkBtn} target="_blank">
                      {lead.listing.title}
                    </Link>
                  ) : "—"}
                </td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                    style={{ fontSize: "0.8rem", padding: "0.25rem" }}
                  >
                    {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
                      <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString("tr-TR")}</td>
                <td>
                  <button type="button" className={adminStyles.dangerBtn} onClick={() => handleDelete(lead.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p style={{ padding: "2rem", textAlign: "center", color: "var(--color-gray-500)" }}>Lead bulunamadı.</p>
        )}
      </div>
    </>
  );
}
