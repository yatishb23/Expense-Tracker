import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: { responseMimeType: "application/json" },
});

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  if (expenses.length < 3) {
    return Response.json({
      prediction: null,
      message: "Need at least 3 expenses for prediction.",
    });
  }

  const monthlyMap: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + e.amount;
  });

  const monthlyTotals = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, total]) => total);

  const recentAvg = monthlyTotals.slice(-3).reduce((s, v) => s + v, 0) / Math.min(monthlyTotals.length, 3);
  const growth = monthlyTotals.length >= 2
    ? ((monthlyTotals[monthlyTotals.length - 1] - monthlyTotals[0]) / monthlyTotals[0]) * 100
    : 0;

  const prompt = `Analyze this spending trend and predict next month:
Monthly totals (last ${monthlyTotals.length} months): [${monthlyTotals.join(", ")}]
Recent monthly avg: $${recentAvg.toFixed(2)}
Growth rate: ${growth.toFixed(1)}%
Return JSON: { "predictedNextMonth": number, "trend": "up"|"down"|"stable", "insight": "short reason" }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return Response.json({
      predictedNextMonth: parsed.predictedNextMonth || Math.round(recentAvg),
      trend: parsed.trend || "stable",
      insight: parsed.insight || "Based on your recent spending patterns.",
    });
  } catch {
    const trend = growth > 5 ? "up" : growth < -5 ? "down" : "stable";
    return Response.json({
      predictedNextMonth: Math.round(recentAvg),
      trend,
      insight: `Your spending has ${trend === "up" ? "increased" : trend === "down" ? "decreased" : "remained stable"} over the tracked period.`,
    });
  }
}
