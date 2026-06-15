import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import type { DistrictStats } from "@/lib/queries/district";
import { DISTRICTS } from "@/lib/constants";
import type { Listing } from "@/types";
import styles from "./district-page.module.css";

const FAQ_ITEMS = [
  {
    question: "Bu ilçede satılık daire nasıl bulunur?",
    answer:
      "İlçe ve mahalle tercihinizi belirledikten sonra bütçenize uygun satılık ilanları filtreleyebilirsiniz. Lokasyon, ulaşım ve bina özelliklerini birlikte değerlendirmek süreci kolaylaştırır.",
  },
  {
    question: "Kiralık ev ararken nelere dikkat edilmeli?",
    answer:
      "Kira bedeli, depozito, aidat ve faturaların kime ait olduğunu netleştirin. Sözleşme öncesi tapu bilgisi ve yetki durumunu kontrol etmek önemlidir.",
  },
  {
    question: "Emlak danışmanı ile çalışmanın avantajı nedir?",
    answer:
      "Yerel piyasa bilgisi, ilan karşılaştırması ve süreç takibi sayesinde zaman kazanır, belgeleri daha düzenli ilerletirsiniz. Şeffaf bilgilendirme güvenli kararın temelidir.",
  },
];

interface DistrictPageContentProps {
  districtName: string;
  districtSlug: string;
  description: string;
  listings: Listing[];
  stats: DistrictStats;
}

export default function DistrictPageContent({
  districtName,
  districtSlug,
  description,
  listings,
  stats,
}: DistrictPageContentProps) {
  const otherDistricts = DISTRICTS.filter((d) => d.slug !== districtSlug).slice(0, 4);

  return (
    <>
      <section className="section">
        <div className="container">
          <div className={styles.intro}>
            <p>{description}</p>
            <p>
              {districtName} bölgesinde güncel emlak ilanlarını inceleyebilir, satılık veya
              kiralık seçenekleri bütçenize göre filtreleyebilirsiniz.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>{stats.total}</strong>
              <span>Toplam İlan</span>
            </div>
            <div className={styles.stat}>
              <strong>{stats.satilik}</strong>
              <span>Satılık</span>
            </div>
            <div className={styles.stat}>
              <strong>{stats.kiralik}</strong>
              <span>Kiralık</span>
            </div>
            <div className={styles.stat}>
              <strong>{stats.daire}</strong>
              <span>Daire</span>
            </div>
            <div className={styles.stat}>
              <strong>{stats.arsa}</strong>
              <span>Arsa</span>
            </div>
            <div className={styles.stat}>
              <strong>{stats.isYeri}</strong>
              <span>İş Yeri</span>
            </div>
          </div>

          <div className={styles.links}>
            <Link href={`/satilik?ilce=${encodeURIComponent(districtName)}`} className="btn btn-navy">
              {districtName} Satılık İlanlar
            </Link>
            <Link href={`/kiralik?ilce=${encodeURIComponent(districtName)}`} className="btn btn-primary">
              {districtName} Kiralık İlanlar
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid-3" style={{ marginTop: "2rem" }}>
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              {districtName} için şu an aktif ilan bulunmuyor.{" "}
              <Link href="/iletisim">İletişime geçerek</Link> talebinizi iletebilirsiniz.
            </p>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className={styles.sectionTitle}>Diğer Adana İlçeleri</h2>
          <div className={styles.districtLinks}>
            {otherDistricts.map((d) => (
              <Link key={d.slug} href={`/adana/${d.slug}`} className={styles.districtLink}>
                {d.name} Emlak
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Sık Sorulan Sorular</h2>
          <div className={styles.faq}>
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export { FAQ_ITEMS };
