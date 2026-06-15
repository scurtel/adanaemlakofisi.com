import { generateText } from "./client";

export interface DistrictGuideInput {
  district: string;
  city?: string;
  focus?: "konut" | "yatırım" | "kiralık" | "genel";
}

export async function generateDistrictGuide(
  input: DistrictGuideInput
): Promise<string> {
  const city = input.city || "Adana";
  const prompt = `Sen yerel emlak danışmanısın. ${city} ${input.district} ilçesi için SEO uyumlu ama doğal bir mahalle/ilçe rehberi yaz.
Odak: ${input.focus || "genel"}

Kurallar:
- Türkçe, profesyonel ve güven veren ton
- "Adana emlak ofisi" ifadesini en fazla 1 kez doğal şekilde kullan
- Abartılı yatırım vaatleri kullanma
- 3-4 paragraf, toplam 250-400 kelime
- Ulaşım, konut çeşitliliği ve bölgenin genel karakteri hakkında bilgi ver`;

  return generateText(prompt);
}
