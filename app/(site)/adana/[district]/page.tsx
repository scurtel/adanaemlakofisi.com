import type { Metadata } from "next";
import Link from "next/link";
import DistrictPageContent, { FAQ_ITEMS } from "@/components/district/DistrictPageContent";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { DISTRICTS, SITE_CONFIG } from "@/lib/constants";
import { getDistrictStats } from "@/lib/queries/district";
import { getPublishedListings } from "@/lib/queries/listings";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, safeSchemaData } from "@/lib/seo/schema";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ district: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return DISTRICTS.map((d) => ({ district: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { district: districtSlug } = await params;
  const district = DISTRICTS.find((d) => d.slug === districtSlug);
  if (!district) return {};

  return createPageMetadata({
    title: `${district.name} Emlak İlanları — Satılık ve Kiralık`,
    description: `Adana ${district.name} ilçesinde satılık daire, kiralık konut, arsa ve iş yeri ilanları. ${district.description}`,
    path: `/adana/${district.slug}`,
  });
}

export default async function DistrictPage({ params }: PageProps) {
  const { district: districtSlug } = await params;
  const district = DISTRICTS.find((d) => d.slug === districtSlug);
  if (!district) notFound();

  const [listings, stats] = await Promise.all([
    getPublishedListings({ district: district.name }),
    getDistrictStats(district.name),
  ]);

  const pageUrl = `${SITE_CONFIG.url}/adana/${district.slug}`;

  return (
    <>
      <SeoJsonLd
        data={safeSchemaData([
          breadcrumbSchema([
            { name: "Ana Sayfa", url: SITE_CONFIG.url },
            { name: "Adana", url: SITE_CONFIG.url },
            { name: `${district.name} Emlak`, url: pageUrl },
          ]),
          faqSchema(FAQ_ITEMS),
        ])}
      />
      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li><Link href="/">Adana</Link></li>
              <li>{district.name} Emlak</li>
            </ol>
          </nav>
          <h1>{district.name} Emlak İlanları</h1>
          <p>{district.description}</p>
        </div>
      </header>

      <DistrictPageContent
        districtName={district.name}
        districtSlug={district.slug}
        description={district.description}
        listings={listings}
        stats={stats}
      />
    </>
  );
}
