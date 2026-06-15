import Link from "next/link";
import { DISTRICTS } from "@/lib/constants";
import type { SiteSettingsData } from "@/lib/queries/settings";
import styles from "./Footer.module.css";

interface FooterProps {
  settings: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>AE</span>
              <span>{settings.siteName}</span>
            </Link>
            <p>
              Adana&apos;da satılık ve kiralık konut, arsa, iş yeri ve yatırım fırsatları
              için güvenilir emlak danışmanlığı.
            </p>
          </div>

          <div>
            <h3 className={styles.heading}>Hızlı Bağlantılar</h3>
            <ul className={styles.links}>
              <li><Link href="/satilik">Satılık İlanlar</Link></li>
              <li><Link href="/kiralik">Kiralık İlanlar</Link></li>
              <li><Link href="/hizmetler">Hizmetlerimiz</Link></li>
              <li><Link href="/blog">Blog & Rehber</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>İlçeler</h3>
            <ul className={styles.links}>
              {DISTRICTS.slice(0, 5).map((d) => (
                <li key={d.slug}>
                  <Link href={`/adana/${d.slug}`}>{d.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>İletişim</h3>
            <ul className={styles.contact}>
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} {settings.siteName}. Tüm hakları saklıdır.</p>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
        </div>
      </div>
    </footer>
  );
}
