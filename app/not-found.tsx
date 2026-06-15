import Link from "next/link";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa bulunamadı.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <div className="container">
        <h1 style={{ fontSize: "4rem", margin: "0 0 1rem", color: "var(--color-navy)" }}>
          404
        </h1>
        <p style={{ color: "var(--color-gray-500)", marginBottom: "2rem" }}>
          Aradığınız sayfa bulunamadı veya kaldırılmış olabilir.
        </p>
        <Link href="/" className="btn btn-primary">
          Ana Sayfaya Dön
        </Link>
      </div>
    </section>
  );
}
