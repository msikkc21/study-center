import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Study Center",
    default: "Admin Study Center",
  },
  description: "Panel administrasi Study Center KKN",
};

// ============================================================
// Navigasi sidebar admin
// ============================================================
const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/subjects", label: "Mata Pelajaran", icon: "📚" },
  { href: "/admin/sessions", label: "Sesi Belajar", icon: "📅" },
  { href: "/admin/attendance", label: "Presensi", icon: "✅" },
];

// ============================================================
// Layout utama admin — TIDAK meng-inherit styling root layout
// Menyediakan sidebar + topbar + area konten sendiri
// ============================================================
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-icon">📚</span>
          <span className="admin-sidebar__brand-text">Study Center</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav__item">
              <span className="admin-nav__icon">{item.icon}</span>
              <span className="admin-nav__label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-nav__item admin-nav__item--muted">
            <span className="admin-nav__icon">←</span>
            <span className="admin-nav__label">Kembali ke Beranda</span>
          </Link>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__title">Panel Admin</div>
          <div className="admin-topbar__actions">
            <span className="admin-topbar__badge">KKN Study Center</span>
          </div>
        </header>

        {/* Konten halaman */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
