import ListingForm from "@/components/admin/ListingForm";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getSiteSettings } from "@/lib/queries/settings";
import adminStyles from "@/components/admin/admin.module.css";

export default async function NewListingPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <h1 className={adminStyles.pageTitle}>Yeni İlan</h1>
      <p className={adminStyles.pageDesc}>Yeni gayrimenkul ilanı ekleyin</p>
      <ListingForm
        settingsPhone={settings.phone}
        settingsWhatsapp={settings.whatsappPhone}
        cloudinaryConfigured={isCloudinaryConfigured()}
      />
    </>
  );
}
