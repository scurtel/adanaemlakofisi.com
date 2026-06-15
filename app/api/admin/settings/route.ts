import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { getSiteSettings, updateSiteSettings } from "@/lib/queries/settings";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const body = await request.json();
  const siteName = String(body.siteName || "").trim();
  const phone = String(body.phone || "").trim();
  const whatsappPhone = String(body.whatsappPhone || "").trim();
  const email = String(body.email || "").trim();
  const address = String(body.address || "").trim();

  if (!siteName || !phone || !whatsappPhone || !email) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const settings = await updateSiteSettings({
    siteName,
    phone,
    whatsappPhone,
    email,
    address,
    googleMapsUrl: body.googleMapsUrl ? String(body.googleMapsUrl) : undefined,
    instagramUrl: body.instagramUrl ? String(body.instagramUrl) : undefined,
    facebookUrl: body.facebookUrl ? String(body.facebookUrl) : undefined,
  });

  return NextResponse.json(settings);
}
