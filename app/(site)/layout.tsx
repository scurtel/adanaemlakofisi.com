import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getSiteSettings } from "@/lib/queries/settings";
import { localBusinessSchema, realEstateAgentSchema } from "@/lib/seo/schema";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SeoJsonLd
        data={[
          realEstateAgentSchema(settings),
          localBusinessSchema(settings),
        ]}
      />
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
