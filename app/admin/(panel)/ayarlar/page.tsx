import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/queries/settings";
import adminStyles from "@/components/admin/admin.module.css";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <h1 className={adminStyles.pageTitle}>Site Ayarları</h1>
      <p className={adminStyles.pageDesc}>İletişim bilgileri ve sosyal medya linkleri</p>
      <SettingsForm initial={settings} />
    </>
  );
}
