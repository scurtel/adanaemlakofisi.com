import type { Metadata } from "next";
import Link from "next/link";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "./about.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Hakkımızda",
  description:
    "Adana Emlak Ofisi hakkında bilgi. Güvenilir, şeffaf ve profesyonel gayrimenkul danışmanlığı hizmeti.",
  path: "/hakkimizda",
});

export default function HakkimizdaPage() {
  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
          { name: "Ana Sayfa", url: SITE_CONFIG.url },
          { name: "Hakkımızda", url: `${SITE_CONFIG.url}/hakkimizda` },
        ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Hakkımızda</li>
            </ol>
          </nav>
          <h1>Hakkımızda</h1>
          <p>Adana&apos;da güvenilir gayrimenkul danışmanlığı.</p>
        </div>
      </header>

      <section className="section">
        <div className={`container ${styles.content}`}>
          <p>
            Adana Emlak Ofisi, Adana ve çevre ilçelerde satılık ve kiralık gayrimenkul
            danışmanlığı sunan yerel bir emlak ofisidir. Konut, arsa, ticari gayrimenkul
            ve yatırım amaçlı mülklerde alıcı ve kiracılara rehberlik ediyoruz.
          </p>
          <p>
            Çalışma prensibimiz şeffaflık, doğru bilgilendirme ve güven üzerine
            kuruludur. Her ilanı detaylı şekilde inceliyor, müşterilerimizin bütçe ve
            lokasyon ihtiyaçlarına uygun seçenekler sunuyoruz.
          </p>
          <p>
            İlerleyen dönemde hizmet ağımızı Mersin ve yabancı müşterilere yönelik
            danışmanlık alanlarıyla genişletmeyi planlıyoruz. Süreç boyunca yanınızda
            olan bir danışman arıyorsanız, bizimle iletişime geçebilirsiniz.
          </p>

          <div className={styles.values}>
            <div>
              <h2>Güven</h2>
              <p>Her adımda şeffaf ve doğru bilgi paylaşımı.</p>
            </div>
            <div>
              <h2>Uzmanlık</h2>
              <p>Adana piyasasına hakim yerel danışmanlık.</p>
            </div>
            <div>
              <h2>Destek</h2>
              <p>İlan aramadan sözleşmeye kadar süreç takibi.</p>
            </div>
          </div>

          <Link href="/iletisim" className="btn btn-primary">
            Bize Ulaşın
          </Link>
        </div>
      </section>
    </>
  );
}
