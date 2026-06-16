import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getSiteSettingsSafe } from "@/lib/queries/settings";
import { localBusinessSchema, realEstateAgentSchema } from "@/lib/seo/schema";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsSafe();

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
