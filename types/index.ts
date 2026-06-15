export type ListingType = "satilik" | "kiralik";

export type PropertyType = "daire" | "villa" | "arsa" | "is-yeri";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  propertyType: PropertyType;
  city: string;
  district: string;
  neighborhood: string;
  price: number;
  currency: "TRY";
  grossM2: number;
  netM2?: number;
  roomCount?: string;
  buildingAge?: number;
  floor?: number;
  totalFloors?: number;
  heating?: string;
  description: string;
  features: string[];
  images: string[];
  contactPhone: string;
  whatsappPhone: string;
  createdAt: string;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type LeadStatus = "yeni" | "arandi" | "ilgileniyor" | "kapandi" | "olumsuz";

export interface District {
  slug: string;
  name: string;
  description: string;
}

export interface SearchFilters {
  district?: string;
  type?: ListingType | "";
  propertyType?: PropertyType | "";
  minPrice?: number;
  maxPrice?: number;
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  daire: "Daire",
  villa: "Villa",
  arsa: "Arsa",
  "is-yeri": "İş Yeri",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  yeni: "Yeni",
  arandi: "Arandı",
  ilgileniyor: "İlgileniyor",
  kapandi: "Kapandı",
  olumsuz: "Olumsuz",
};

export function formatPrice(price: number, type: ListingType): string {
  const formatted = new Intl.NumberFormat("tr-TR").format(price);
  return type === "kiralik" ? `${formatted} ₺/ay` : `${formatted} ₺`;
}
