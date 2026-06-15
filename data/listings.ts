import type { Listing } from "@/types";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
];

export const listings: Listing[] = [
  {
    id: "1",
    slug: "adana-cukurova-satilik-3-1-daire",
    title: "Çukurova'da Satılık 3+1 Daire",
    type: "satilik",
    propertyType: "daire",
    city: "Adana",
    district: "Çukurova",
    neighborhood: "Kurtuluş",
    price: 4250000,
    currency: "TRY",
    grossM2: 145,
    netM2: 128,
    roomCount: "3+1",
    buildingAge: 8,
    floor: 5,
    totalFloors: 12,
    heating: "Kombi (Doğalgaz)",
    description:
      "Çukurova Kurtuluş mahallesinde, site içerisinde güvenlikli ve bakımlı bir binada yer alan 3+1 daire. Geniş salon, balkon ve otopark imkânı sunmaktadır. Okul, market ve ulaşım noktalarına yürüme mesafesindedir.",
    features: ["Otopark", "Asansör", "Güvenlik", "Balkon", "Doğalgaz"],
    images: [PLACEHOLDER_IMAGES[0], PLACEHOLDER_IMAGES[1]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-05-10",
    featured: true,
  },
  {
    id: "2",
    slug: "adana-seyhan-kiralik-2-1-daire",
    title: "Seyhan'da Kiralık 2+1 Daire",
    type: "kiralik",
    propertyType: "daire",
    city: "Adana",
    district: "Seyhan",
    neighborhood: "Güzelyalı",
    price: 18000,
    currency: "TRY",
    grossM2: 95,
    netM2: 82,
    roomCount: "2+1",
    buildingAge: 12,
    floor: 3,
    totalFloors: 8,
    heating: "Kombi (Doğalgaz)",
    description:
      "Seyhan Güzelyalı'da merkezi konumda, ferah 2+1 kiralık daire. Eşyalı seçenek mevcuttur. Toplu taşıma ve ana arterlere yakın.",
    features: ["Asansör", "Balkon", "Doğalgaz", "Eşyalı"],
    images: [PLACEHOLDER_IMAGES[2]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-05-08",
    featured: true,
  },
  {
    id: "3",
    slug: "adana-yuregir-satilik-villa",
    title: "Yüreğir'de Satılık Müstakil Villa",
    type: "satilik",
    propertyType: "villa",
    city: "Adana",
    district: "Yüreğir",
    neighborhood: "Akıncılar",
    price: 8900000,
    currency: "TRY",
    grossM2: 280,
    netM2: 240,
    roomCount: "4+1",
    buildingAge: 5,
    heating: "Kombi (Doğalgaz)",
    description:
      "Yüreğir Akıncılar'da bahçeli, geniş yaşam alanına sahip müstakil villa. Aile yaşamı için uygun, otopark ve bahçe düzenlemesi mevcuttur.",
    features: ["Bahçe", "Otopark", "Şömine", "Doğalgaz", "Güvenlik"],
    images: [PLACEHOLDER_IMAGES[3]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-05-05",
    featured: true,
  },
  {
    id: "4",
    slug: "adana-saricam-satilik-arsa",
    title: "Sarıçam'da İmarlı Satılık Arsa",
    type: "satilik",
    propertyType: "arsa",
    city: "Adana",
    district: "Sarıçam",
    neighborhood: "Yüreklice",
    price: 2100000,
    currency: "TRY",
    grossM2: 450,
    description:
      "Sarıçam Yüreklice'de imarlı, köşe parsel konumda satılık arsa. Yatırım ve konut projesi için uygun altyapı koşulları.",
    features: ["İmarlı", "Köşe Parsel", "Yol Cepheli"],
    images: [PLACEHOLDER_IMAGES[4]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-05-01",
    featured: false,
  },
  {
    id: "5",
    slug: "adana-seyhan-kiralik-is-yeri",
    title: "Seyhan'da Kiralık İş Yeri",
    type: "kiralik",
    propertyType: "is-yeri",
    city: "Adana",
    district: "Seyhan",
    neighborhood: "Reşatbey",
    price: 35000,
    currency: "TRY",
    grossM2: 120,
    description:
      "Seyhan Reşatbey'de ana cadde üzerinde, vitrin cepheli kiralık iş yeri. Ofis veya perakende kullanımına uygundur.",
    features: ["Ana Cadde", "Vitrin Cephe", "Klima"],
    images: [PLACEHOLDER_IMAGES[5]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-04-28",
    featured: false,
  },
  {
    id: "6",
    slug: "adana-cukurova-kiralik-1-1-daire",
    title: "Çukurova'da Kiralık 1+1 Daire",
    type: "kiralik",
    propertyType: "daire",
    city: "Adana",
    district: "Çukurova",
    neighborhood: "Toros",
    price: 14000,
    currency: "TRY",
    grossM2: 65,
    netM2: 55,
    roomCount: "1+1",
    buildingAge: 3,
    floor: 7,
    totalFloors: 14,
    heating: "Merkezi Sistem",
    description:
      "Çukurova Toros'ta yeni binada, bakımlı 1+1 kiralık daire. Site içi sosyal alanlar ve güvenlik mevcuttur.",
    features: ["Site İçi", "Asansör", "Güvenlik", "Otopark"],
    images: [PLACEHOLDER_IMAGES[0]],
    contactPhone: "+90 322 000 00 00",
    whatsappPhone: "903220000000",
    createdAt: "2025-04-25",
    featured: true,
  },
];

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function getListingsByType(type: "satilik" | "kiralik"): Listing[] {
  return listings.filter((l) => l.type === type);
}

export function getFeaturedListings(): Listing[] {
  return listings.filter((l) => l.featured);
}

export function filterListings(filters: {
  district?: string;
  type?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
}): Listing[] {
  return listings.filter((listing) => {
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.propertyType && listing.propertyType !== filters.propertyType)
      return false;
    if (
      filters.district &&
      listing.district.toLowerCase() !== filters.district.toLowerCase()
    )
      return false;
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    return true;
  });
}
