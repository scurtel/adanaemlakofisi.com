import { notFound } from "next/navigation";
import ListingForm from "@/components/admin/ListingForm";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getListingById } from "@/lib/queries/listings";
import { getSiteSettings } from "@/lib/queries/settings";
import adminStyles from "@/components/admin/admin.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const [listing, settings] = await Promise.all([
    getListingById(id),
    getSiteSettings(),
  ]);
  if (!listing) notFound();

  return (
    <>
      <h1 className={adminStyles.pageTitle}>İlan Düzenle</h1>
      <p className={adminStyles.pageDesc}>{listing.title}</p>
      <ListingForm
        initial={{ ...listing, id }}
        settingsPhone={settings.phone}
        settingsWhatsapp={settings.whatsappPhone}
        cloudinaryConfigured={isCloudinaryConfigured()}
      />
    </>
  );
}
