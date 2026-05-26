"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ExpenseList from "@/components/ExpenseList";
import ExpenseForm from "@/components/ExpenseForm";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      setExpenses(data.expenses);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh] text-muted">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">Expenses</h1>
          <p className="text-sm text-muted mt-1">
            Manage all your transactions
          </p>
        </div>

        <ExpenseForm onAdded={fetchExpenses} />
        <ExpenseList expenses={expenses} onDeleted={fetchExpenses} />
      </main>
    </div>
  );
}
