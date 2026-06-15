import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ui/ContactForm";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import { getSiteSettings } from "@/lib/queries/settings";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "./contact.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "İletişim",
  description:
    "Adana Emlak Ofisi ile iletişime geçin. Telefon, WhatsApp veya iletişim formu ile bize ulaşın.",
  path: "/iletisim",
});

export default async function IletisimPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
            { name: "Ana Sayfa", url: SITE_CONFIG.url },
            { name: "İletişim", url: `${SITE_CONFIG.url}/iletisim` },
          ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>İletişim</li>
            </ol>
          </nav>
          <h1>İletişim</h1>
          <p>Satılık, kiralık veya danışmanlık için bize ulaşın.</p>
        </div>
      </header>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.info}>
            <h2>İletişim Bilgileri</h2>
            <dl className={styles.list}>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a
                    href={`https://wa.me/${settings.whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp ile Yazın
                  </a>
                </dd>
              </div>
              <div>
                <dt>E-posta</dt>
                <dd>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </dd>
              </div>
              <div>
                <dt>Adres</dt>
                <dd>{settings.address}</dd>
              </div>
            </dl>
          </div>
          <div className={styles.formWrap}>
            <h2>İletişim Formu</h2>
            <ContactForm source="iletisim" />
          </div>
        </div>
      </section>
    </>
  );
}
