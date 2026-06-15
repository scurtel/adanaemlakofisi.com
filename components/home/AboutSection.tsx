import Link from "next/link";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className="section" aria-labelledby="about-seo-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h2 id="about-seo-title">Adana&apos;da Gayrimenkul Danışmanlığı</h2>
          <p>
            Adana emlak piyasasında doğru bilgi ve şeffaf süreç yönetimi, konut alım-satım
            ve kiralama kararlarında belirleyici bir rol oynar. Adana Emlak Ofisi olarak
            Seyhan, Çukurova, Yüreğir ve çevre ilçelerde satılık daire, kiralık konut,
            arsa ve ticari gayrimenkul danışmanlığı sunuyoruz.
          </p>
          <p>
            Her ilanın lokasyon, fiyat ve teknik özelliklerini detaylı şekilde
            değerlendiriyor; alıcı ve kiracıların ihtiyaçlarına uygun seçenekler
            sunuyoruz. Yatırım amaçlı gayrimenkul arayanlar ve Türkiye&apos;de mülk
            edinmek isteyen yabancı müşteriler için de rehberlik hizmeti veriyoruz.
          </p>
          <p>
            Sürecin her aşamasında güven, şeffaflık ve doğru bilgilendirme ilkeleriyle
            hareket ediyoruz. İlanlarımızı inceleyebilir veya doğrudan ekibimizle
            iletişime geçebilirsiniz.
          </p>
          <Link href="/hakkimizda" className="btn btn-navy">
            Hakkımızda
          </Link>
        </div>
        <aside className={styles.stats} aria-label="Özet bilgiler">
          <div className={styles.stat}>
            <strong>7+</strong>
            <span>İlçe Kapsamı</span>
          </div>
          <div className={styles.stat}>
            <strong>6</strong>
            <span>Danışmanlık Alanı</span>
          </div>
          <div className={styles.stat}>
            <strong>7/24</strong>
            <span>İletişim Desteği</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
