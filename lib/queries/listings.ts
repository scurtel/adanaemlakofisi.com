import { prisma } from "@/lib/db";
import { dbPropertyType, mapListing } from "@/lib/mappers";
import { toJsonArray } from "@/lib/utils/json";
import { generateListingSlug } from "@/lib/utils/slug";
import type { ListingType, PropertyType } from "@/types";
import type { Listing } from "@/types";
import { isPrismaMissingTableError, logSafeQueryError } from "./safe";

export interface ListingFilters {
  type?: ListingType;
  district?: string;
  propertyType?: PropertyType | string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  publishedOnly?: boolean;
  featuredOnly?: boolean;
}

export async function getPublishedListings(filters: ListingFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.publishedOnly !== false) where.isPublished = true;
  if (filters.type) where.type = filters.type;
  if (filters.district) where.district = filters.district;
  if (filters.propertyType) {
    where.propertyType = dbPropertyType(filters.propertyType as PropertyType);
  }
  if (filters.featuredOnly) where.isFeatured = true;
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { neighborhood: { contains: filters.search } },
      { district: { contains: filters.search } },
    ];
  }

  const rows = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapListing);
}

export async function getListingsSafe(filters: ListingFilters = {}): Promise<Listing[]> {
  try {
    return await getPublishedListings(filters);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return [];
    logSafeQueryError("getListingsSafe", error);
    return [];
  }
}

export async function getListingsByDistrictSafe(district: string): Promise<Listing[]> {
  return getListingsSafe({ district });
}

export async function getFeaturedListings() {
  return getListingsSafe({ featuredOnly: true });
}

export async function getListingBySlug(slug: string, publishedOnly = true) {
  try {
    const row = await prisma.listing.findUnique({ where: { slug } });
    if (!row) return null;
    if (publishedOnly && !row.isPublished) return null;
    return mapListing(row);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return null;
    throw error;
  }
}

export async function getListingById(id: string) {
  try {
    const row = await prisma.listing.findUnique({ where: { id } });
    return row ? mapListing(row) : null;
  } catch (error) {
    if (isPrismaMissingTableError(error)) return null;
    throw error;
  }
}

export async function getAllListingsAdmin(filters: ListingFilters = {}) {
  return getPublishedListings({ ...filters, publishedOnly: false });
}

export interface ListingInput {
  title: string;
  type: ListingType;
  propertyType: PropertyType;
  city?: string;
  district: string;
  neighborhood: string;
  price: number;
  grossM2: number;
  netM2?: number | null;
  roomCount?: string | null;
  buildingAge?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  heating?: string | null;
  description: string;
  features: string[];
  images: string[];
  contactPhone: string;
  whatsappPhone: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  slug?: string;
}

export async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.listing.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

export async function createListing(input: ListingInput) {
  const baseSlug =
    input.slug ||
    generateListingSlug({
      district: input.district,
      neighborhood: input.neighborhood,
      type: input.type,
      propertyType: dbPropertyType(input.propertyType),
      roomCount: input.roomCount || undefined,
      title: input.title,
    });
  const slug = await ensureUniqueSlug(baseSlug);

  const row = await prisma.listing.create({
    data: {
      slug,
      title: input.title,
      type: input.type,
      propertyType: dbPropertyType(input.propertyType),
      city: input.city || "Adana",
      district: input.district,
      neighborhood: input.neighborhood,
      price: input.price,
      grossM2: input.grossM2,
      netM2: input.netM2 ?? null,
      roomCount: input.roomCount ?? null,
      buildingAge: input.buildingAge ?? null,
      floor: input.floor ?? null,
      totalFloors: input.totalFloors ?? null,
      heating: input.heating ?? null,
      description: input.description,
      features: toJsonArray(input.features),
      images: toJsonArray(input.images),
      contactPhone: input.contactPhone,
      whatsappPhone: input.whatsappPhone,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      isFeatured: input.isFeatured ?? false,
      isPublished: input.isPublished ?? false,
    },
  });
  return mapListing(row);
}

export async function updateListing(id: string, input: ListingInput) {
  let slug = input.slug;
  if (slug) {
    slug = await ensureUniqueSlug(slug, id);
  }

  const row = await prisma.listing.update({
    where: { id },
    data: {
      ...(slug ? { slug } : {}),
      title: input.title,
      type: input.type,
      propertyType: dbPropertyType(input.propertyType),
      city: input.city || "Adana",
      district: input.district,
      neighborhood: input.neighborhood,
      price: input.price,
      grossM2: input.grossM2,
      netM2: input.netM2 ?? null,
      roomCount: input.roomCount ?? null,
      buildingAge: input.buildingAge ?? null,
      floor: input.floor ?? null,
      totalFloors: input.totalFloors ?? null,
      heating: input.heating ?? null,
      description: input.description,
      features: toJsonArray(input.features),
      images: toJsonArray(input.images),
      contactPhone: input.contactPhone,
      whatsappPhone: input.whatsappPhone,
      metaTitle: input.metaTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      isFeatured: input.isFeatured ?? false,
      isPublished: input.isPublished ?? false,
    },
  });
  return mapListing(row);
}

export async function deleteListing(id: string) {
  await prisma.listing.delete({ where: { id } });
}

export async function getListingSlugs() {
  try {
    const rows = await prisma.listing.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch (error) {
    if (isPrismaMissingTableError(error)) return [];
    throw error;
  }
}
