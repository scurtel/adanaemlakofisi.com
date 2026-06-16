import { getListingsByDistrictSafe } from "./listings";
import type { Listing } from "@/types";

export interface DistrictStats {
  total: number;
  satilik: number;
  kiralik: number;
  daire: number;
  villa: number;
  arsa: number;
  isYeri: number;
}

export async function getDistrictStats(districtName: string): Promise<DistrictStats> {
  const listings = await getListingsByDistrictSafe(districtName);
  return summarizeListings(listings);
}

export function summarizeListings(listings: Listing[]): DistrictStats {
  return {
    total: listings.length,
    satilik: listings.filter((l) => l.type === "satilik").length,
    kiralik: listings.filter((l) => l.type === "kiralik").length,
    daire: listings.filter((l) => l.propertyType === "daire").length,
    villa: listings.filter((l) => l.propertyType === "villa").length,
    arsa: listings.filter((l) => l.propertyType === "arsa").length,
    isYeri: listings.filter((l) => l.propertyType === "is-yeri").length,
  };
}
