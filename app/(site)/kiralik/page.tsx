import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import SearchBox from "@/components/listings/SearchBox";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getPublishedListings } from "@/lib/queries/listings";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import styles from "../satilik/listings.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Kiralık İlanlar",
  description:
    "Adana'da kiralık daire, villa ve iş yeri ilanları. Farklı bütçelere uygun kiralık konut seçenekleri.",
  path: "/kiralik",
});

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    ilce?: string;
    tip?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function KiralikPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const listings = await getPublishedListings({
    type: "kiralik",
    district: params.ilce,
    propertyType: params.tip,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
  });

  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
            { name: "Ana Sayfa", url: SITE_CONFIG.url },
            { name: "Kiralık İlanlar", url: `${SITE_CONFIG.url}/kiralik` },
          ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Kiralık İlanlar</li>
            </ol>
          </nav>
          <h1>Kiralık İlanlar</h1>
          <p>Adana&apos;da kiralık konut ve iş yeri ilanları.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.searchWrap}>
            <SearchBox defaultType="kiralik" compact />
          </div>
          {listings.length > 0 ? (
            <div className="grid-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              Arama kriterlerinize uygun kiralık ilan bulunamadı.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
