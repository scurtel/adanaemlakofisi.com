"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { SiteSettingsData } from "@/lib/queries/settings";
import adminStyles from "./admin.module.css";

export default function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof SiteSettingsData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={adminStyles.card}>
      {error && <div className={adminStyles.error}>{error}</div>}
      {success && <div className={adminStyles.success}>Ayarlar kaydedildi.</div>}
      <div className={adminStyles.formGrid}>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="siteName">Site Adı</label>
          <input id="siteName" value={form.siteName} onChange={(e) => update("siteName", e.target.value)} required />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="phone">Telefon</label>
          <input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="whatsappPhone">WhatsApp</label>
          <input id="whatsappPhone" value={form.whatsappPhone} onChange={(e) => update("whatsappPhone", e.target.value)} required />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="email">E-posta</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="address">Adres</label>
          <textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="googleMapsUrl">Google Maps URL</label>
          <input id="googleMapsUrl" value={form.googleMapsUrl || ""} onChange={(e) => update("googleMapsUrl", e.target.value)} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="instagramUrl">Instagram URL</label>
          <input id="instagramUrl" value={form.instagramUrl || ""} onChange={(e) => update("instagramUrl", e.target.value)} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="facebookUrl">Facebook URL</label>
          <input id="facebookUrl" value={form.facebookUrl || ""} onChange={(e) => update("facebookUrl", e.target.value)} />
        </div>
      </div>
      <div className={adminStyles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
