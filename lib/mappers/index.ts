import type { BlogPost as PrismaBlogPost, Listing as PrismaListing } from "@prisma/client";
import type { BlogPost, Listing, ListingType, PropertyType } from "@/types";
import { parseJsonArray } from "@/lib/utils/json";

function mapPropertyType(db: string): PropertyType {
  if (db === "is_yeri") return "is-yeri";
  return db as PropertyType;
}

export function dbPropertyType(type: PropertyType | string): string {
  if (type === "is-yeri") return "is_yeri";
  return type;
}

export function mapListing(row: PrismaListing): Listing {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type as ListingType,
    propertyType: mapPropertyType(row.propertyType),
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    price: row.price,
    currency: "TRY",
    grossM2: row.grossM2,
    netM2: row.netM2 ?? undefined,
    roomCount: row.roomCount ?? undefined,
    buildingAge: row.buildingAge ?? undefined,
    floor: row.floor ?? undefined,
    totalFloors: row.totalFloors ?? undefined,
    heating: row.heating ?? undefined,
    description: row.description,
    features: parseJsonArray(row.features),
    images: parseJsonArray(row.images),
    contactPhone: row.contactPhone,
    whatsappPhone: row.whatsappPhone,
    createdAt: row.createdAt.toISOString(),
    featured: row.isFeatured,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
    isPublished: row.isPublished,
  };
}

export function mapBlogPost(row: PrismaBlogPost): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.createdAt.toISOString(),
    author: "Adana Emlak Ofisi",
    tags: parseJsonArray(row.tags),
    coverImage: row.coverImage ?? undefined,
    category: row.category ?? undefined,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
  };
}
