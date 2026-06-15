import Link from "next/link";
import { DISTRICTS } from "@/lib/constants";
import styles from "./Districts.module.css";

export default function Districts() {
  return (
    <section className="section section-alt" aria-labelledby="districts-title">
      <div className="container">
        <h2 id="districts-title" className="section-title">
          Adana İlçeleri ve Bölgeler
        </h2>
        <p className="section-subtitle">
          İlçe bazında satılık ve kiralık ilanları keşfedin.
        </p>
        <div className={`grid-2 ${styles.grid}`}>
          {DISTRICTS.map((district) => (
            <Link
              key={district.slug}
              href={`/adana/${district.slug}`}
              className={styles.card}
            >
              <h3>{district.name}</h3>
              <p>{district.description}</p>
              <span className={styles.link}>İlanları Gör →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
