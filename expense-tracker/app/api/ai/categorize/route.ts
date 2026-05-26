import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: { responseMimeType: "application/json" },
});


const CATEGORIES = [
  "Food & Dining", "Transportation", "Shopping", "Entertainment",
  "Bills & Utilities", "Health", "Education", "Travel", "Other",
];

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();
    if (!description) {
      return Response.json({ error: "Description required" }, { status: 400 });
    }

    const prompt = `Categorize this expense: "${description}"
Choose from: ${CATEGORIES.join(", ")}
Return JSON: { "category": "one of the above", "confidence": 0.0-1.0 }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return Response.json({
      category: CATEGORIES.includes(parsed.category) ? parsed.category : "Other",
      confidence: parsed.confidence || 0.5,
    });
  } catch {
    return Response.json({ category: "Other", confidence: 0.1 });
  }
}
