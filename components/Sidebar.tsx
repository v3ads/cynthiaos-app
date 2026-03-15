"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",               label: "Dashboard",         icon: "◈" },
  { href: "/leases/expiring",         label: "Expiring (30d)",    icon: "⚠" },
  { href: "/leases/upcoming-renewals",label: "Renewals (90d)",    icon: "↻" },
  { href: "/leases/expirations",      label: "All Expirations",   icon: "≡" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span>Cynthia</span>OS
      </div>
      <div className="sidebar-section">Leases</div>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link${path === item.href ? " active" : ""}`}
        >
          <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
