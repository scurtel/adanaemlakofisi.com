import Link from "next/link";
import SearchBox from "@/components/listings/SearchBox";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h1 id="hero-title">Adana Emlak Ofisi</h1>
          <p className={styles.subtitle}>
            Adana&apos;da satılık ve kiralık konut, arsa, iş yeri ve yatırım fırsatları
            için güvenilir emlak danışmanlığı.
          </p>
          <div className={styles.ctas}>
            <Link href="/satilik" className="btn btn-primary">
              Satılık İlanları Gör
            </Link>
            <Link href="/kiralik" className="btn btn-outline">
              Kiralık İlanları Gör
            </Link>
            <Link href="/iletisim" className="btn btn-outline">
              İletişime Geç
            </Link>
          </div>
        </div>
        <div className={styles.search}>
          <SearchBox />
        </div>
      </div>
    </section>
  );
}
