import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { generateBlogDraft } from "@/lib/gemini";

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const topic = String(body.topic || body.title || "").trim();
    if (!topic) {
      return NextResponse.json({ error: "Başlık veya konu gerekli." }, { status: 400 });
    }

    const keywords = body.keywords
      ? String(body.keywords).split(",").map((s: string) => s.trim()).filter(Boolean)
      : undefined;

    const draft = await generateBlogDraft({
      topic,
      keywords,
      district: body.district ? String(body.district) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
    });

    return NextResponse.json(draft);
  } catch (e) {
    console.error("Gemini blog draft error:", e);
    return NextResponse.json({ error: "Blog taslağı üretilemedi." }, { status: 500 });
  }
}
