import type { Metadata } from "next";
import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import SearchBox from "@/components/listings/SearchBox";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getListingsSafe } from "@/lib/queries/listings";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, safeSchemaData } from "@/lib/seo/schema";
import type { ListingType } from "@/types";
import styles from "./listings.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Satılık İlanlar",
  description:
    "Adana'da satılık daire, villa, arsa ve iş yeri ilanları. Seyhan, Çukurova, Yüreğir ve diğer ilçelerde güncel satılık gayrimenkul fırsatları.",
  path: "/satilik",
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

export default async function SatilikPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const listings = await getListingsSafe({
    type: "satilik",
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
            { name: "Satılık İlanlar", url: `${SITE_CONFIG.url}/satilik` },
          ]),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>Satılık İlanlar</li>
            </ol>
          </nav>
          <h1>Satılık İlanlar</h1>
          <p>Adana&apos;da satılık konut, arsa ve ticari gayrimenkul ilanları.</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.searchWrap}>
            <SearchBox defaultType="satilik" compact />
          </div>
          {listings.length > 0 ? (
            <div className="grid-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              Arama kriterlerinize uygun satılık ilan bulunamadı.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
