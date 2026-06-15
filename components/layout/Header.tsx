"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteSettingsData } from "@/lib/queries/settings";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/satilik", label: "Satılık" },
  { href: "/kiralik", label: "Kiralık" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

interface HeaderProps {
  settings: SiteSettingsData;
}

export default function Header({ settings }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoIcon}>AE</span>
          <span className={styles.logoText}>
            <strong>Adana</strong> Emlak Ofisi
          </span>
        </Link>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Ana menü">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className={styles.phoneBtn}>
            {settings.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
