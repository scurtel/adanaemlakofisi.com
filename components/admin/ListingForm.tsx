"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DISTRICTS } from "@/lib/constants";
import type { Listing } from "@/types";
import ImageUpload from "./ImageUpload";
import adminStyles from "./admin.module.css";

interface ListingFormProps {
  initial?: Partial<Listing> & { id?: string };
  settingsPhone?: string;
  settingsWhatsapp?: string;
  cloudinaryConfigured?: boolean;
}

const EMPTY = {
  title: "",
  type: "satilik" as const,
  propertyType: "daire" as const,
  district: "",
  neighborhood: "",
  price: "",
  grossM2: "",
  netM2: "",
  roomCount: "",
  buildingAge: "",
  floor: "",
  totalFloors: "",
  heating: "",
  description: "",
  features: "",
  images: "",
  contactPhone: "",
  whatsappPhone: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  isPublished: false,
};

export default function ListingForm({
  initial,
  settingsPhone = "",
  settingsWhatsapp = "",
  cloudinaryConfigured = false,
}: ListingFormProps) {
  const router = useRouter();
  const [imageList, setImageList] = useState<string[]>(initial?.images || []);
  const [form, setForm] = useState({
    ...EMPTY,
    contactPhone: initial?.contactPhone || settingsPhone,
    whatsappPhone: initial?.whatsappPhone || settingsWhatsapp,
    title: initial?.title || "",
    type: initial?.type || "satilik",
    propertyType: initial?.propertyType || "daire",
    district: initial?.district || "",
    neighborhood: initial?.neighborhood || "",
    price: initial?.price?.toString() || "",
    grossM2: initial?.grossM2?.toString() || "",
    netM2: initial?.netM2?.toString() || "",
    roomCount: initial?.roomCount || "",
    buildingAge: initial?.buildingAge?.toString() || "",
    floor: initial?.floor?.toString() || "",
    totalFloors: initial?.totalFloors?.toString() || "",
    heating: initial?.heating || "",
    description: initial?.description || "",
    features: initial?.features?.join(", ") || "",
    images: initial?.images?.join("\n") || "",
    metaTitle: initial?.metaTitle || "",
    metaDescription: initial?.metaDescription || "",
    isFeatured: initial?.featured || false,
    isPublished: initial?.isPublished ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function generateDescription() {
    setGeminiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gemini/listing-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          propertyType: form.propertyType,
          district: form.district,
          neighborhood: form.neighborhood,
          price: Number(form.price),
          grossM2: Number(form.grossM2),
          roomCount: form.roomCount || undefined,
          features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update("description", data.description);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Açıklama üretilemedi.");
    } finally {
      setGeminiLoading(false);
    }
  }

  async function generateSeoMeta() {
    setGeminiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gemini/seo-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          propertyType: form.propertyType,
          district: form.district,
          neighborhood: form.neighborhood,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update("metaTitle", data.title);
      update("metaDescription", data.description);
    } catch (e) {
      setError(e instanceof Error ? e.message : "SEO meta üretilemedi.");
    } finally {
      setGeminiLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = initial?.id
        ? `/api/admin/listings/${initial.id}`
        : "/api/admin/listings";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: imageList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/ilanlar");
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

      <div className={adminStyles.formGrid}>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="title">Başlık *</label>
          <input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="type">İlan Tipi *</label>
          <select id="type" value={form.type} onChange={(e) => update("type", e.target.value)}>
            <option value="satilik">Satılık</option>
            <option value="kiralik">Kiralık</option>
          </select>
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="propertyType">Emlak Tipi *</label>
          <select id="propertyType" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
            <option value="daire">Daire</option>
            <option value="villa">Villa</option>
            <option value="arsa">Arsa</option>
            <option value="is-yeri">İş Yeri</option>
          </select>
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="district">İlçe *</label>
          <select id="district" value={form.district} onChange={(e) => update("district", e.target.value)} required>
            <option value="">Seçiniz</option>
            {DISTRICTS.map((d) => (
              <option key={d.slug} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="neighborhood">Mahalle *</label>
          <input id="neighborhood" value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} required />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="price">Fiyat (₺) *</label>
          <input id="price" type="number" min={1} value={form.price} onChange={(e) => update("price", e.target.value)} required />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="grossM2">Brüt m² *</label>
          <input id="grossM2" type="number" min={1} value={form.grossM2} onChange={(e) => update("grossM2", e.target.value)} required />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="netM2">Net m²</label>
          <input id="netM2" type="number" value={form.netM2} onChange={(e) => update("netM2", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="roomCount">Oda Sayısı</label>
          <input id="roomCount" value={form.roomCount} onChange={(e) => update("roomCount", e.target.value)} placeholder="3+1" />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="buildingAge">Bina Yaşı</label>
          <input id="buildingAge" type="number" value={form.buildingAge} onChange={(e) => update("buildingAge", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="floor">Kat</label>
          <input id="floor" type="number" value={form.floor} onChange={(e) => update("floor", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="totalFloors">Toplam Kat</label>
          <input id="totalFloors" type="number" value={form.totalFloors} onChange={(e) => update("totalFloors", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="heating">Isıtma</label>
          <input id="heating" value={form.heating} onChange={(e) => update("heating", e.target.value)} />
        </div>

        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="description">Açıklama</label>
          <textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} />
          <div className={adminStyles.geminiRow}>
            <button type="button" className={adminStyles.geminiBtn} onClick={generateDescription} disabled={geminiLoading}>
              {geminiLoading ? "Üretiliyor..." : "Gemini ile Açıklama Üret"}
            </button>
          </div>
        </div>

        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="features">Özellikler (virgülle ayırın)</label>
          <input id="features" value={form.features} onChange={(e) => update("features", e.target.value)} placeholder="Otopark, Asansör, Balkon" />
        </div>

        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label>Görseller</label>
          <ImageUpload
            images={imageList}
            onChange={setImageList}
            cloudinaryConfigured={cloudinaryConfigured}
          />
          <label htmlFor="images" style={{ marginTop: "1rem", display: "block" }}>veya URL ile ekle (her satıra bir)</label>
          <textarea
            id="images"
            rows={2}
            placeholder="https://..."
            onBlur={(e) => {
              const urls = e.target.value.split("\n").map((s) => s.trim()).filter(Boolean);
              if (urls.length) setImageList([...imageList, ...urls]);
              e.target.value = "";
            }}
          />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="contactPhone">Telefon</label>
          <input id="contactPhone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="whatsappPhone">WhatsApp</label>
          <input id="whatsappPhone" value={form.whatsappPhone} onChange={(e) => update("whatsappPhone", e.target.value)} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="metaTitle">SEO Başlık</label>
          <input id="metaTitle" value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} maxLength={70} />
        </div>

        <div className={adminStyles.formField}>
          <label htmlFor="metaDescription">SEO Açıklama</label>
          <input id="metaDescription" value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} maxLength={170} />
          <div className={adminStyles.geminiRow}>
            <button type="button" className={adminStyles.geminiBtn} onClick={generateSeoMeta} disabled={geminiLoading}>
              SEO Meta Üret
            </button>
          </div>
        </div>

        <div className={`${adminStyles.checkboxRow} ${adminStyles.formFieldFull}`}>
          <label>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
            Yayında
          </label>
          <label>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
            Öne Çıkan
          </label>
        </div>
      </div>

      <div className={adminStyles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Kaydediliyor..." : initial?.id ? "Güncelle" : "Kaydet"}
        </button>
        <button type="button" className="btn btn-navy" onClick={() => router.back()}>
          İptal
        </button>
      </div>
    </form>
  );
}
