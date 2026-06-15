import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { generateSeoMeta } from "@/lib/gemini";

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const neighborhood = String(body.neighborhood || "").trim();
    const type = String(body.type || "").trim();
    const propertyType = String(body.propertyType || "").trim();
    const description = String(body.description || "").trim();

    if (!title || !district) {
      return NextResponse.json({ error: "Başlık ve ilçe gerekli." }, { status: 400 });
    }

    const context = [
      title,
      district,
      neighborhood,
      type,
      propertyType,
      description.slice(0, 200),
    ]
      .filter(Boolean)
      .join(". ");

    const meta = await generateSeoMeta({
      pageType: "listing",
      title,
      context,
      keywords: ["Adana emlak", district, type, propertyType],
    });

    return NextResponse.json(meta);
  } catch (error) {
    console.error("Gemini SEO meta error:", error);
    return NextResponse.json({ error: "SEO meta üretilemedi." }, { status: 500 });
  }
}
