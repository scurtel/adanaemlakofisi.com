import { generateText } from "./client";

export interface SeoMetaInput {
  pageType: "listing" | "blog" | "district" | "page";
  title: string;
  context: string;
  keywords?: string[];
}

export interface SeoMetaOutput {
  title: string;
  description: string;
}

export async function generateSeoMeta(
  input: SeoMetaInput
): Promise<SeoMetaOutput> {
  const prompt = `Sen SEO uzmanısın. Adana emlak ofisi web sitesi için meta title ve meta description üret.
Türkçe, doğal, spam yapma. Title max 60 karakter, description max 155 karakter.

Sayfa tipi: ${input.pageType}
Başlık: ${input.title}
Bağlam: ${input.context}
${input.keywords?.length ? `Anahtar kelimeler: ${input.keywords.join(", ")}` : ""}

Yanıtı SADECE şu JSON formatında ver, başka metin ekleme:
{"title": "...", "description": "..."}`;

  const raw = await generateText(prompt);
  try {
    const parsed = JSON.parse(raw) as SeoMetaOutput;
    return parsed;
  } catch {
    return {
      title: input.title.slice(0, 60),
      description: input.context.slice(0, 155),
    };
  }
}
