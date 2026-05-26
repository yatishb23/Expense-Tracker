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
    orderBy: { date: "desc" },
    take: 100,
  });

  if (expenses.length === 0) {
    return Response.json({ insight: "No expenses yet. Start tracking to get AI insights!" });
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const avgPerDay = total / Math.max(expenses.length, 1);

  const prompt = `You are a financial advisor. Analyze these expenses and give 3 concise actionable insights:
Total: $${total.toFixed(2)}
Top category: ${topCategory}
Average per expense: $${avgPerDay.toFixed(2)}
Categories breakdown: ${JSON.stringify(byCategory)}
Return JSON: { "summary": "1 sentence", "suggestions": ["tip1", "tip2", "tip3"] }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const aiResponse = JSON.parse(text);
    return Response.json({
      summary: aiResponse.summary || "Spending pattern detected.",
      suggestions: aiResponse.suggestions || [],
      total,
      topCategory,
      averagePerDay: Math.round(avgPerDay * 100) / 100,
      byCategory,
    });
  } catch {
    return Response.json({
      summary: `You've spent $${total.toFixed(2)} across ${expenses.length} expenses. Top category: ${topCategory}.`,
      suggestions: ["Review your recurring subscriptions", "Set a monthly budget", "Track daily spending"],
      total,
      topCategory,
      averagePerDay: Math.round(avgPerDay * 100) / 100,
      byCategory,
    });
  }
}
