import type { Metadata } from "next";
import Link from "next/link";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "./services.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Hizmetlerimiz",
  description:
    "Satılık ve kiralık konut danışmanlığı, arsa yatırımı, ticari gayrimenkul, yabancılara danışmanlık ve ekspertiz hizmetleri.",
  path: "/hizmetler",
});

export default function HizmetlerPage() {
  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
          { name: "Ana Sayfa", url: SITE_CONFIG.url },
          { name: "Hizmetler", url: `${SITE_CONFIG.url}/hizmetler` },
        ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Hizmetlerimiz</li>
            </ol>
          </nav>
          <h1>Hizmetlerimiz</h1>
          <p>Adana ve çevresinde kapsamlı gayrimenkul danışmanlığı.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {SERVICES.map((service, i) => (
              <article key={service.title} className={styles.card}>
                <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.cta}>
            <p>Hizmetlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin.</p>
            <Link href="/iletisim" className="btn btn-primary">
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
