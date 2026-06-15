import { prisma } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";

export interface SiteSettingsData {
  siteName: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

const DEFAULTS: SiteSettingsData = {
  siteName: SITE_CONFIG.name,
  phone: SITE_CONFIG.phone,
  whatsappPhone: SITE_CONFIG.whatsapp,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) return DEFAULTS;
  return {
    siteName: row.siteName,
    phone: row.phone,
    whatsappPhone: row.whatsappPhone,
    email: row.email,
    address: row.address,
    googleMapsUrl: row.googleMapsUrl ?? undefined,
    instagramUrl: row.instagramUrl ?? undefined,
    facebookUrl: row.facebookUrl ?? undefined,
  };
}

export async function updateSiteSettings(data: SiteSettingsData) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildListingWhatsAppMessage(title: string): string {
  return `Merhaba, adanaemlakofisi.com üzerinde gördüğüm "${title}" ilanı hakkında bilgi almak istiyorum.`;
}
