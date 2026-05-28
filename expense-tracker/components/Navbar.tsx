"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearToken } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null,
  );
  const { theme, toggleTheme } = useTheme();

  // Re-check user dynamically on page changes to update nav
  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  const links = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/expenses", label: "Expenses" },
        { href: "/insights", label: "Insights" },
      ]
    : [];

  return (
    <nav className="border-b border-neutral-800 bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push("/")}
            className="text-accent font-bold text-lg mr-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Trackered
          </button>

          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "bg-neutral-850 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-neutral-850/50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-neutral-850/50 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground bg-neutral-850 px-3 py-1 rounded-full border border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-muted hover:text-foreground px-3 py-1.5 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="text-sm bg-foreground text-background font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
