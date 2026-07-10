import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
        Dashboard Admin
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
        Selamat datang di panel administrasi Study Center KKN.
      </p>

      {/* Stat cards contoh */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          { label: "Total Users", value: "—", icon: "👥" },
          { label: "Mata Pelajaran", value: "—", icon: "📚" },
          { label: "Sesi Belajar", value: "—", icon: "📅" },
          { label: "Presensi Hari Ini", value: "—", icon: "✅" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>
              {stat.icon}
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
