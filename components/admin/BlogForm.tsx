"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { BlogPost } from "@/types";
import adminStyles from "./admin.module.css";

interface BlogFormProps {
  initial?: Partial<BlogPost> & { id?: string; isPublished?: boolean };
}

export default function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    coverImage: initial?.coverImage || "",
    category: initial?.category || "rehber",
    tags: initial?.tags?.join(", ") || "",
    metaTitle: initial?.metaTitle || "",
    metaDescription: initial?.metaDescription || "",
    isPublished: (initial as { isPublished?: boolean })?.isPublished ?? false,
    geminiTopic: initial?.title || "",
    geminiKeywords: "",
    geminiDistrict: "",
    geminiNotes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function generateDraft() {
    setGeminiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gemini/blog-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: form.geminiTopic || form.title,
          keywords: form.geminiKeywords,
          district: form.geminiDistrict || undefined,
          notes: form.geminiNotes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        excerpt: data.excerpt || prev.excerpt,
        content: data.content || prev.content,
        metaTitle: data.metaTitle || prev.metaTitle,
        metaDescription: data.metaDescription || prev.metaDescription,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : prev.tags,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Taslak üretilemedi.");
    } finally {
      setGeminiLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = initial?.id ? `/api/admin/blog/${initial.id}` : "/api/admin/blog";
      const method = initial?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/blog");
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

      <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`} style={{ marginBottom: "1rem", padding: "1rem", background: "var(--color-gray-50)", borderRadius: "var(--radius)" }}>
        <label>Gemini ile Blog Taslağı</label>
        <div className={adminStyles.formGrid} style={{ marginTop: "0.5rem" }}>
          <div className={adminStyles.formField}>
            <input placeholder="Konu / başlık" value={form.geminiTopic} onChange={(e) => update("geminiTopic", e.target.value)} />
          </div>
          <div className={adminStyles.formField}>
            <input placeholder="Anahtar kelimeler (virgülle)" value={form.geminiKeywords} onChange={(e) => update("geminiKeywords", e.target.value)} />
          </div>
          <div className={adminStyles.formField}>
            <input placeholder="Hedef ilçe (opsiyonel)" value={form.geminiDistrict} onChange={(e) => update("geminiDistrict", e.target.value)} />
          </div>
          <div className={adminStyles.formField}>
            <input placeholder="Kısa not (opsiyonel)" value={form.geminiNotes} onChange={(e) => update("geminiNotes", e.target.value)} />
          </div>
        </div>
        <button type="button" className={adminStyles.geminiBtn} onClick={generateDraft} disabled={geminiLoading} style={{ marginTop: "0.5rem" }}>
          {geminiLoading ? "Üretiliyor..." : "Gemini ile Blog Taslağı Üret"}
        </button>
      </div>

      <div className={adminStyles.formGrid}>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="title">Başlık *</label>
          <input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="excerpt">Özet *</label>
          <textarea id="excerpt" value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} required rows={2} />
        </div>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="content">İçerik *</label>
          <textarea id="content" value={form.content} onChange={(e) => update("content", e.target.value)} required rows={14} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="coverImage">Kapak Görseli URL</label>
          <input id="coverImage" value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="category">Kategori</label>
          <input id="category" value={form.category} onChange={(e) => update("category", e.target.value)} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="metaTitle">SEO Başlık</label>
          <input id="metaTitle" value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} maxLength={70} />
        </div>
        <div className={adminStyles.formField}>
          <label htmlFor="metaDescription">SEO Açıklama</label>
          <input id="metaDescription" value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} maxLength={170} />
        </div>
        <div className={`${adminStyles.formField} ${adminStyles.formFieldFull}`}>
          <label htmlFor="tags">Etiketler (virgülle)</label>
          <input id="tags" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        </div>
        <div className={adminStyles.checkboxRow}>
          <label>
            <input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
            Yayında
          </label>
        </div>
      </div>
      <div className={adminStyles.formActions}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button type="button" className="btn btn-navy" onClick={() => router.back()}>İptal</button>
      </div>
    </form>
  );
}
