import { SITE_CONFIG } from "@/lib/constants";
import type { SiteSettingsData } from "@/lib/queries/settings";
import type { BlogPost, Listing } from "@/types";
import { LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "@/types";

export function realEstateAgentSchema(settings?: SiteSettingsData) {
  const name = settings?.siteName || SITE_CONFIG.name;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const email = settings?.email || SITE_CONFIG.email;
  const address = settings?.address || SITE_CONFIG.address;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    url: SITE_CONFIG.url,
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Adana",
      addressRegion: "Adana",
      addressCountry: "TR",
      streetAddress: address,
    },
    areaServed: { "@type": "City", name: "Adana" },
  };
}

export function localBusinessSchema(settings?: SiteSettingsData) {
  const name = settings?.siteName || SITE_CONFIG.name;
  const phone = settings?.phone || SITE_CONFIG.phone;
  const email = settings?.email || SITE_CONFIG.email;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name,
    url: SITE_CONFIG.url,
    telephone: phone,
    email,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Adana",
      addressRegion: "Adana",
      addressCountry: "TR",
    },
    priceRange: "₺₺",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function listingSchema(listing: Listing, siteName?: string) {
  try {
    const listingUrl = `${SITE_CONFIG.url}/ilan/${listing.slug}`;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: listing.title,
      description: listing.description,
      url: listingUrl,
      image: listing.images.length > 0 ? listing.images : undefined,
      offers: {
        "@type": "Offer",
        price: listing.price,
        priceCurrency: listing.currency,
        availability: "https://schema.org/InStock",
        url: listingUrl,
        seller: {
          "@type": "RealEstateAgent",
          name: siteName || SITE_CONFIG.name,
        },
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "İlan Tipi", value: LISTING_TYPE_LABELS[listing.type] },
        { "@type": "PropertyValue", name: "Emlak Tipi", value: PROPERTY_TYPE_LABELS[listing.propertyType] },
        { "@type": "PropertyValue", name: "İlçe", value: listing.district },
        { "@type": "PropertyValue", name: "Mahalle", value: listing.neighborhood },
      ],
    };
  } catch {
    return null;
  }
}

export function blogPostingSchema(post: BlogPost, siteName?: string) {
  try {
    const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: postUrl,
      datePublished: post.publishedAt,
      image: post.coverImage || undefined,
      author: { "@type": "Organization", name: post.author },
      publisher: {
        "@type": "Organization",
        name: siteName || SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      mainEntityOfPage: postUrl,
    };
  } catch {
    return null;
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  try {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  } catch {
    return null;
  }
}

export function safeSchemaData(
  data: (Record<string, unknown> | null)[]
): Record<string, unknown>[] {
  return data.filter((item): item is Record<string, unknown> => item !== null);
}
