import { generateText } from "./client";

export interface ListingDescriptionInput {
  title: string;
  type: "satilik" | "kiralik";
  propertyType: string;
  district: string;
  neighborhood: string;
  price: number;
  grossM2: number;
  roomCount?: string;
  features?: string[];
  notes?: string;
}

export async function generateListingDescription(
  input: ListingDescriptionInput
): Promise<string> {
  const prompt = `Sen profesyonel bir emlak danışmanısın. Aşağıdaki bilgilere dayanarak Türkçe, doğal ve güven veren bir ilan açıklaması yaz.
Abartılı vaatler kullanma. "En iyi", "garantili kazanç" gibi ifadelerden kaçın.
2-3 paragraf, toplam 150-250 kelime.

İlan bilgileri:
- Başlık: ${input.title}
- Tip: ${input.type}
- Emlak tipi: ${input.propertyType}
- İlçe: ${input.district}
- Mahalle: ${input.neighborhood}
- Fiyat: ${input.price} TL
- Brüt m²: ${input.grossM2}
${input.roomCount ? `- Oda: ${input.roomCount}` : ""}
${input.features?.length ? `- Özellikler: ${input.features.join(", ")}` : ""}
${input.notes ? `- Ek notlar: ${input.notes}` : ""}`;

  return generateText(prompt);
}
