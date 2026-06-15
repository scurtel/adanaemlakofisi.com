import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedListings from "@/components/home/FeaturedListings";
import Services from "@/components/home/Services";
import AboutSection from "@/components/home/AboutSection";
import Districts from "@/components/home/Districts";
import BlogSection from "@/components/home/BlogSection";
import ContactCTA from "@/components/ui/ContactCTA";
import { getSiteSettings } from "@/lib/queries/settings";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return createPageMetadata({
    title: settings.siteName,
    description:
      "Adana'da satılık ve kiralık konut, arsa, iş yeri ve yatırım fırsatları için güvenilir emlak danışmanlığı.",
    path: "/",
  });
}

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero />
      <FeaturedListings />
      <Services />
      <AboutSection />
      <Districts />
      <BlogSection />
      <ContactCTA settings={settings} />
    </>
  );
}
