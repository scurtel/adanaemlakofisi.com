import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import {
  formatPrice,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/types";
import styles from "./ListingCard.module.css";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/ilan/${listing.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.image}
          />
          <span className={styles.badge}>{LISTING_TYPE_LABELS[listing.type]}</span>
        </div>
      </Link>
      <div className={styles.body}>
        <span className={styles.type}>{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
        <h3 className={styles.title}>
          <Link href={`/ilan/${listing.slug}`}>{listing.title}</Link>
        </h3>
        <p className={styles.location}>
          {listing.district}, {listing.neighborhood}
        </p>
        <p className={styles.price}>{formatPrice(listing.price, listing.type)}</p>
        <ul className={styles.meta}>
          {listing.roomCount && <li>{listing.roomCount}</li>}
          <li>{listing.grossM2} m²</li>
        </ul>
      </div>
    </article>
  );
}
