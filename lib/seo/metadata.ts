import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

const DEFAULT_OG_IMAGE = `${SITE_CONFIG.url}/opengraph-image`;

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
}

export function createPageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
}: PageMetaInput): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const fullTitle =
    title === SITE_CONFIG.name ? title : `${title} | ${SITE_CONFIG.name}`;

  const verification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export { DEFAULT_OG_IMAGE };
