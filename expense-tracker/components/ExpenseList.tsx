"use client";

import { api } from "@/lib/api";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Props {
  expenses: Expense[];
  onDeleted: () => void;
}

export default function ExpenseList({ expenses, onDeleted }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.deleteExpense(id);
      onDeleted();
    } catch {}
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm mt-1">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-card border border-neutral-800 rounded-xl p-4 flex items-center justify-between hover:bg-card-hover transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-muted uppercase">
                {expense.category}
              </span>
              <span className="text-xs text-muted">
                {new Date(expense.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-foreground truncate">
              {expense.description}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm font-semibold text-foreground tabular-nums">
              ${expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => handleDelete(expense.id)}
              className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
