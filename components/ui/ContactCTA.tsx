import Link from "next/link";
import type { SiteSettingsData } from "@/lib/queries/settings";
import styles from "./ContactCTA.module.css";

interface ContactCTAProps {
  settings: SiteSettingsData;
}

export default function ContactCTA({ settings }: ContactCTAProps) {
  return (
    <section className={styles.cta} aria-labelledby="contact-cta-title">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2 id="contact-cta-title">Gayrimenkul Danışmanlığı İçin Bize Ulaşın</h2>
            <p>
              Satılık veya kiralık ilanlar, yatırım danışmanlığı ve ekspertiz hizmetleri
              için ekibimiz size yardımcı olmaya hazır.
            </p>
          </div>
          <div className={styles.actions}>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn btn-primary">
              {settings.phone}
            </a>
            <a
              href={`https://wa.me/${settings.whatsappPhone}`}
              className="btn btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <Link href="/iletisim" className="btn btn-outline">
              İletişim Formu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
