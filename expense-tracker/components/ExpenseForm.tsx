"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  onAdded: () => void;
}

export default function ExpenseForm({ onAdded }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    try {
      await api.createExpense({
        description,
        amount: Number(amount),
        category: category || undefined,
        date,
      });
      setDescription("");
      setAmount("");
      setCategory("");
      onAdded();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAICategorize = async () => {
    if (!description) return;
    try {
      const result = await api.categorize(description);
      setCategory(result.category);
    } catch {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-neutral-800 rounded-xl p-5 space-y-4"
    >
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        New Expense
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="button"
            onClick={handleAICategorize}
            className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-muted hover:text-foreground transition-colors shrink-0"
            title="Auto-categorize with AI"
          >
            AI
          </button>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
