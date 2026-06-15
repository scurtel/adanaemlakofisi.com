import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import { getFeaturedListings } from "@/lib/queries/listings";
import styles from "./FeaturedListings.module.css";

export default async function FeaturedListings() {
  const listings = await getFeaturedListings();

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <h2 id="featured-title" className="section-title">
          Öne Çıkan İlanlar
        </h2>
        <p className="section-subtitle">
          Adana&apos;nın farklı ilçelerinden seçilmiş güncel satılık ve kiralık ilanlar.
        </p>
        {listings.length > 0 ? (
          <div className={`grid-3 ${styles.grid}`}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Henüz öne çıkan ilan bulunmuyor.</p>
        )}
        <div className={styles.actions}>
          <Link href="/satilik" className="btn btn-navy">
            Tüm Satılık İlanlar
          </Link>
          <Link href="/kiralik" className="btn btn-primary">
            Tüm Kiralık İlanlar
          </Link>
        </div>
      </div>
    </section>
  );
}
