import type { Metadata } from "next";
import Link from "next/link";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "./privacy.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Gizlilik Politikası",
  description:
    "Adana Emlak Ofisi gizlilik politikası. Kişisel verilerinizin korunması ve kullanımı hakkında bilgi.",
  path: "/gizlilik-politikasi",
});

export default function GizlilikPolitikasiPage() {
  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
            { name: "Ana Sayfa", url: SITE_CONFIG.url },
            {
              name: "Gizlilik Politikası",
              url: `${SITE_CONFIG.url}/gizlilik-politikasi`,
            },
          ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Gizlilik Politikası</li>
            </ol>
          </nav>
          <h1>Gizlilik Politikası</h1>
          <p>Kişisel verilerinizin korunması bizim için önemlidir.</p>
        </div>
      </header>

      <section className="section">
        <div className={`container ${styles.content}`}>
          <h2>Veri Toplama</h2>
          <p>
            İletişim formu aracılığıyla paylaştığınız ad, telefon, e-posta ve mesaj
            bilgileri yalnızca talebinize yanıt vermek amacıyla kullanılır.
          </p>

          <h2>Veri Güvenliği</h2>
          <p>
            Kişisel verileriniz yetkisiz erişime karşı korunur ve üçüncü taraflarla
            paylaşılmaz. Yasal yükümlülükler dışında verileriniz izniniz olmadan
            kullanılmaz.
          </p>

          <h2>Çerezler</h2>
          <p>
            Web sitemiz, kullanıcı deneyimini iyileştirmek için temel çerezler
            kullanabilir. Tarayıcı ayarlarınızdan çerez tercihlerinizi
            yönetebilirsiniz.
          </p>

          <h2>İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için{" "}
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> adresinden
            bize ulaşabilirsiniz.
          </p>
        </div>
      </section>
    </>
  );
}
