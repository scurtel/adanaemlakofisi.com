const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};

export function slugify(text: string): string {
  return text
    .split("")
    .map((c) => TR_MAP[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function generateListingSlug(input: {
  district: string;
  neighborhood?: string;
  type: string;
  propertyType: string;
  roomCount?: string;
  title: string;
}): string {
  const parts = [
    "adana",
    input.district,
    input.type,
    input.roomCount?.replace("+", "-") || input.propertyType.replace("_", "-"),
    input.propertyType.replace("_", "-"),
  ];
  const base = slugify(parts.filter(Boolean).join(" "));
  return base || slugify(input.title);
}
