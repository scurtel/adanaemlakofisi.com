"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminShell.module.css";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/ilanlar", label: "İlanlar" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/leadler", label: "Leadler" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Link href="/admin">Adana Emlak Ofisi</Link>
          <span>Yönetim Paneli</span>
        </div>
        <nav>
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                      ? styles.active
                      : ""
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.logout}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
