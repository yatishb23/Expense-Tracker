"use client";

interface InsightCardProps {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}

export default function InsightCard({ title, children, accent }: InsightCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent
          ? "bg-accent/5 border-accent/20"
          : "bg-card border-neutral-800"
      }`}
    >
      <h3 className="text-xs text-muted uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
