"use client";

import { useRouter, usePathname } from "next/navigation";
import { getUser, clearToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/insights", label: "Insights" },
  ];

  return (
    <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-accent font-bold text-lg mr-6">$ Trackr</span>
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "bg-neutral-800 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-neutral-800/50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
