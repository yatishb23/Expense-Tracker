"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import InsightCard from "@/components/InsightCard";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/SpendingChart"), { ssr: false });

interface Insights {
  summary: string;
  suggestions: string[];
  total: number;
  topCategory: string;
  averagePerDay: number;
  byCategory: Record<string, number>;
}

interface Prediction {
  predictedNextMonth: number;
  trend: "up" | "down" | "stable";
  insight: string;
}

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [insightsData, predictionData] = await Promise.all([
        api.getInsights(),
        api.getPrediction(),
      ]);
      setInsights(insightsData);
      setPrediction(predictionData);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh] text-muted">
          Loading insights...
        </div>
      </div>
    );
  }

  const trendColor =
    prediction?.trend === "up"
      ? "text-red-400"
      : prediction?.trend === "down"
      ? "text-green-400"
      : "text-yellow-400";

  const trendIcon =
    prediction?.trend === "up" ? "↑" : prediction?.trend === "down" ? "↓" : "→";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted mt-1">
            Smart analysis of your spending patterns
          </p>
        </div>

        {insights && (
          <InsightCard title="AI Summary" accent>
            <p>{insights.summary}</p>
          </InsightCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights && (
            <>
              <div className="bg-card border border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${insights.total.toFixed(2)}
                </p>
              </div>
              <div className="bg-card border border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Top Category
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {insights.topCategory}
                </p>
              </div>
              <div className="bg-card border border-neutral-800 rounded-xl p-5">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Avg per Transaction
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${insights.averagePerDay.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </div>

        {prediction && prediction.predictedNextMonth && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard title="Next Month Prediction">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ${Math.round(prediction.predictedNextMonth)}
                </span>
                <span className={trendColor}>{trendIcon}</span>
              </div>
              <p className="text-xs text-muted mt-1">{prediction.insight}</p>
            </InsightCard>

            <InsightCard title="Spending Trend">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-lg font-semibold capitalize ${trendColor}`}
                >
                  {trendIcon} {prediction.trend}
                </span>
              </div>
            </InsightCard>
          </div>
        )}

        {insights?.byCategory && Object.keys(insights.byCategory).length > 0 && (
          <div className="bg-card border border-neutral-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Spending Distribution
            </h2>
            <Chart data={insights.byCategory} />
          </div>
        )}

        {insights?.suggestions && insights.suggestions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Suggestions
            </h2>
            <div className="space-y-2">
              {insights.suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="bg-card border border-neutral-800 rounded-xl p-4 flex items-start gap-3"
                >
                  <span className="text-accent text-sm font-bold mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
