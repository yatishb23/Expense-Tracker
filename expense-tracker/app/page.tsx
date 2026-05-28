"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return null; // hide flash before redirect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center pt-24 pb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Take control of your <br className="hidden md:block" />
          <span className="text-accent">financial future</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mb-10">
          Trackered is an intelligent expense tracker that helps you monitor
          spending, analyze your habits, and generate AI-powered insights to
          save you money.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => router.push("/signup")}
            className="px-8 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity text-lg"
          >
            Start Tracking Free
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-xl bg-neutral-850 border border-border text-foreground font-semibold hover:bg-neutral-750 transition-colors text-lg"
          >
            Sign In
          </button>
        </div>

        {/* Features preview section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted">
              Log your daily expenses instantly and categorise them to see where
              your money goes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
            <p className="text-muted">
              Understand your spending patterns with beautiful, interactive
              charts and dashboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-muted">
              Get smart financial advice powered by Gemini AI, tailored
              specifically to your data.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-border py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted">
          <p>© {new Date().getFullYear()} Trackered. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
