"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/SpendingChart"), { ssr: false });

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await api.getExpenses();
      setExpenses(data.expenses);
      setTotal(data.expenses.reduce((s: number, e: Expense) => s + e.amount, 0));
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
    fetchExpenses();
  }, [fetchExpenses, router]);

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const byCategory = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

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
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Total Spent
            </p>
            <p className="text-2xl font-bold text-foreground">
              ${total.toFixed(2)}
            </p>
            <p className="text-xs text-muted mt-1">{currentMonth}</p>
          </div>
          <div className="bg-card border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Transactions
            </p>
            <p className="text-2xl font-bold text-foreground">
              {expenses.length}
            </p>
          </div>
          <div className="bg-card border border-neutral-800 rounded-xl p-5">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Avg per Transaction
            </p>
            <p className="text-2xl font-bold text-foreground">
              ${expenses.length > 0 ? (total / expenses.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-neutral-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Spending by Category
            </h2>
            {Object.keys(byCategory).length > 0 ? (
              <Chart data={byCategory} />
            ) : (
              <p className="text-muted text-sm py-8 text-center">
                No data to visualize yet
              </p>
            )}
          </div>
          <div>
            <ExpenseForm onAdded={fetchExpenses} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Recent Expenses
          </h2>
          <ExpenseList expenses={expenses.slice(0, 10)} onDeleted={fetchExpenses} />
        </div>
      </main>
    </div>
  );
}
