import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import {
  createListing,
  deleteListing,
  getAllListingsAdmin,
  updateListing,
  type ListingInput,
} from "@/lib/queries/listings";
import type { ListingType, PropertyType } from "@/types";

function parseListingBody(body: Record<string, unknown>): ListingInput | { error: string } {
  const title = String(body.title || "").trim();
  const district = String(body.district || "").trim();
  const neighborhood = String(body.neighborhood || "").trim();
  const price = Number(body.price);
  const grossM2 = Number(body.grossM2);

  if (!title) return { error: "Başlık gerekli." };
  if (!district || !neighborhood) return { error: "İlçe ve mahalle gerekli." };
  if (!price || price <= 0) return { error: "Geçerli fiyat girin." };
  if (!grossM2 || grossM2 <= 0) return { error: "Geçerli brüt m² girin." };

  const features = Array.isArray(body.features)
    ? body.features.map(String).filter(Boolean)
    : String(body.features || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const images = Array.isArray(body.images)
    ? body.images.map(String).filter(Boolean)
    : String(body.images || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

  return {
    title,
    type: (body.type as ListingType) || "satilik",
    propertyType: (body.propertyType as PropertyType) || "daire",
    city: String(body.city || "Adana"),
    district,
    neighborhood,
    price,
    grossM2,
    netM2: body.netM2 ? Number(body.netM2) : null,
    roomCount: body.roomCount ? String(body.roomCount) : null,
    buildingAge: body.buildingAge ? Number(body.buildingAge) : null,
    floor: body.floor ? Number(body.floor) : null,
    totalFloors: body.totalFloors ? Number(body.totalFloors) : null,
    heating: body.heating ? String(body.heating) : null,
    description: String(body.description || "").trim(),
    features,
    images,
    contactPhone: String(body.contactPhone || "").trim(),
    whatsappPhone: String(body.whatsappPhone || "").trim(),
    metaTitle: body.metaTitle ? String(body.metaTitle) : null,
    metaDescription: body.metaDescription ? String(body.metaDescription) : null,
    isFeatured: Boolean(body.isFeatured),
    isPublished: Boolean(body.isPublished),
    slug: body.slug ? String(body.slug).trim() : undefined,
  };
}

export async function GET(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { searchParams } = new URL(request.url);
  const listings = await getAllListingsAdmin({
    type: (searchParams.get("type") as ListingType) || undefined,
    district: searchParams.get("district") || undefined,
    search: searchParams.get("search") || undefined,
    publishedOnly: false,
  });
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json();
  const parsed = parseListingBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const listing = await createListing(parsed);
  return NextResponse.json(listing, { status: 201 });
}
