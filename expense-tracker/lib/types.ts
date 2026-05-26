export interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface AIInsight {
  summary: string;
  topCategory: string;
  monthlyTotal: number;
  averagePerDay: number;
  suggestions: string[];
}

export interface AICategorization {
  category: string;
  confidence: number;
}

export interface AIPrediction {
  predictedNextMonth: number;
  trend: "up" | "down" | "stable";
  insight: string;
}
