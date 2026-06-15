import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { generateListingDescription } from "@/lib/gemini";

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const neighborhood = String(body.neighborhood || "").trim();
    const type = body.type as "satilik" | "kiralik";
    const propertyType = String(body.propertyType || "").trim();
    const price = Number(body.price);
    const grossM2 = Number(body.grossM2);
    const roomCount = body.roomCount ? String(body.roomCount) : undefined;
    const features = Array.isArray(body.features) ? body.features.map(String) : [];

    if (!district || !neighborhood || !type || !propertyType) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }
    if (!price || price <= 0 || !grossM2 || grossM2 <= 0) {
      return NextResponse.json({ error: "Fiyat ve m² geçerli olmalı." }, { status: 400 });
    }

    const description = await generateListingDescription({
      title: title || `${district} ${propertyType}`,
      type,
      propertyType,
      district,
      neighborhood,
      price,
      grossM2,
      roomCount,
      features,
    });

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Gemini listing description error:", error);
    return NextResponse.json({ error: "Açıklama üretilemedi." }, { status: 500 });
  }
}
