"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  source?: string;
  listingId?: string;
}

export default function ContactForm({ source = "iletisim", listingId }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
          source,
          listingId,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderim başarısız.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <p>Mesajınız alındı. En kısa sürede size dönüş yapacağız.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="İletişim formu">
      {error && <div className={styles.errorMsg}>{error}</div>}
      <div className={styles.field}>
        <label htmlFor="name">Ad Soyad</label>
        <input id="name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className={styles.field}>
        <label htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>
      {!listingId && (
        <div className={styles.field}>
          <label htmlFor="subject">Konu</label>
          <select id="subject" name="subject" defaultValue="">
            <option value="">Genel Bilgi</option>
            <option value="satilik">Satılık İlan</option>
            <option value="kiralik">Kiralık İlan</option>
            <option value="yatirim">Yatırım Danışmanlığı</option>
          </select>
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor="message">Mesajınız</label>
        <textarea id="message" name="message" rows={5} required />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
