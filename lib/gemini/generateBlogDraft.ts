import { generateText } from "./client";

export interface BlogDraftInput {
  topic: string;
  keywords?: string[];
  district?: string;
  notes?: string;
}

export interface BlogDraftOutput {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}

export async function generateBlogDraft(
  input: BlogDraftInput
): Promise<BlogDraftOutput> {
  const prompt = `Sen Adana merkezli bir emlak ofisi için blog yazısı taslağı hazırlıyorsun.
Konu: ${input.topic}
${input.district ? `Hedef ilçe: ${input.district}` : ""}
${input.keywords?.length ? `Anahtar kelimeler (doğal kullan): ${input.keywords.join(", ")}` : ""}
${input.notes ? `Ek not: ${input.notes}` : ""}

Kurallar:
- Türkçe, bilgilendirici ve güven veren ton
- Abartılı vaat yok: "kesin kazanç", "garantili yatırım", "en karlı bölge" kullanma
- content: ## ve ### başlıklar, içindekiler hissi, H2/H3 hiyerarşisi, sonuç ve SSS bölümü
- 700-900 kelime
- İç link önerisi metin içinde doğal geçsin (/satilik, /kiralik, /iletisim)

Yanıtı SADECE JSON ver:
{"title":"...","excerpt":"...","content":"...","metaTitle":"...","metaDescription":"...","tags":["..."]}`;

  const raw = await generateText(prompt);
  try {
    return JSON.parse(raw) as BlogDraftOutput;
  } catch {
    return {
      title: input.topic,
      excerpt: `${input.topic} hakkında bilgilendirici rehber.`,
      content: raw,
      metaTitle: input.topic.slice(0, 60),
      metaDescription: `${input.topic} — Adana emlak rehberi.`.slice(0, 155),
      tags: input.keywords || ["adana", "emlak"],
    };
  }
}
