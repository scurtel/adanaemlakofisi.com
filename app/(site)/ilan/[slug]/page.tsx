import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getListingBySlug } from "@/lib/queries/listings";
import {
  buildListingWhatsAppMessage,
  buildWhatsAppUrl,
  getSiteSettingsSafe,
} from "@/lib/queries/settings";
import { SITE_CONFIG } from "@/lib/constants";
import { createPageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";
import { breadcrumbSchema, listingSchema, safeSchemaData } from "@/lib/seo/schema";
import {
  formatPrice,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/types";
import styles from "./listing-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};

  return createPageMetadata({
    title: listing.metaTitle || listing.title,
    description:
      listing.metaDescription || listing.description.slice(0, 155),
    path: `/ilan/${listing.slug}`,
    ogImage: listing.images[0] || DEFAULT_OG_IMAGE,
  });
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [listing, settings] = await Promise.all([
    getListingBySlug(slug),
    getSiteSettingsSafe(),
  ]);
  if (!listing) notFound();

  const phone = listing.contactPhone || settings.phone;
  const whatsapp = listing.whatsappPhone || settings.whatsappPhone;
  const whatsappMessage = buildListingWhatsAppMessage(listing.title);
  const whatsappUrl = buildWhatsAppUrl(whatsapp, whatsappMessage);
  const listingUrl = `${SITE_CONFIG.url}/ilan/${listing.slug}`;
  const listPath = listing.type === "satilik" ? "/satilik" : "/kiralik";

  const schemaData = safeSchemaData([
    listingSchema(listing, settings.siteName),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: SITE_CONFIG.url },
      {
        name: LISTING_TYPE_LABELS[listing.type] + " İlanlar",
        url: `${SITE_CONFIG.url}${listPath}`,
      },
      { name: listing.title, url: listingUrl },
    ]),
  ]);

  return (
    <>
      {schemaData.length > 0 && <SeoJsonLd data={schemaData} />}

      <header className="page-header">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb">
              <li><Link href="/">Ana Sayfa</Link></li>
              <li>
                <Link href={listPath}>
                  {LISTING_TYPE_LABELS[listing.type]} İlanlar
                </Link>
              </li>
              <li>{listing.title}</li>
            </ol>
          </nav>
          <h1>{listing.title}</h1>
          <p>
            {listing.district}, {listing.neighborhood} —{" "}
            {PROPERTY_TYPE_LABELS[listing.propertyType]}
          </p>
        </div>
      </header>

      <article className="section">
        <div className={`container ${styles.layout}`}>
          <div className={styles.gallery}>
            {listing.images.length > 0 ? (
              listing.images.map((src, i) => (
                <div key={i} className={styles.imageWrap}>
                  <Image
                    src={src}
                    alt={`${listing.title} - görsel ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className={styles.image}
                    priority={i === 0}
                  />
                </div>
              ))
            ) : (
              <div className={styles.imagePlaceholder}>Görsel bulunmuyor</div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.priceCard}>
              <p className={styles.price}>
                {formatPrice(listing.price, listing.type)}
              </p>
              <span className={styles.badge}>
                {LISTING_TYPE_LABELS[listing.type]}
              </span>
              <div className={styles.contact}>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="btn btn-navy"
                >
                  Telefonla Ara
                </a>
                <a
                  href={whatsappUrl}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp ile Bilgi Al
                </a>
              </div>
            </div>

            <dl className={styles.details}>
              <div><dt>İlçe</dt><dd>{listing.district}</dd></div>
              <div><dt>Mahalle</dt><dd>{listing.neighborhood}</dd></div>
              <div><dt>Emlak Tipi</dt><dd>{PROPERTY_TYPE_LABELS[listing.propertyType]}</dd></div>
              <div><dt>Brüt m²</dt><dd>{listing.grossM2}</dd></div>
              {listing.netM2 && <div><dt>Net m²</dt><dd>{listing.netM2}</dd></div>}
              {listing.roomCount && <div><dt>Oda</dt><dd>{listing.roomCount}</dd></div>}
              {listing.buildingAge !== undefined && (
                <div><dt>Bina Yaşı</dt><dd>{listing.buildingAge}</dd></div>
              )}
              {listing.floor !== undefined && (
                <div>
                  <dt>Kat</dt>
                  <dd>{listing.floor}{listing.totalFloors ? ` / ${listing.totalFloors}` : ""}</dd>
                </div>
              )}
              {listing.heating && <div><dt>Isıtma</dt><dd>{listing.heating}</dd></div>}
            </dl>
          </aside>

          <div className={styles.content}>
            <h2>İlan Açıklaması</h2>
            <p>{listing.description}</p>

            {listing.features.length > 0 && (
              <>
                <h2>Özellikler</h2>
                <ul className={styles.features}>
                  {listing.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <div className={styles.leadForm}>
              <h2>İlan İçin Mesaj Bırak</h2>
              <ContactForm source="ilan-detay" listingId={listing.id} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
