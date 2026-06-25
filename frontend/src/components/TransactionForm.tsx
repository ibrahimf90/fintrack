import { useState } from "react";
import { NewTransaction, CATEGORIES } from "../types";
import { PlusCircle } from "lucide-react";

interface Props {
  onAdd: (t: NewTransaction) => Promise<void>;
}

const today = new Date().toISOString().split("T")[0];

export default function TransactionForm({ onAdd }: Props) {
  const [form, setForm] = useState<NewTransaction>({
    type: "expense",
    category: "Food",
    amount: 0,
    description: "",
    date: today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await onAdd(form);
      setForm({
        type: "expense",
        category: "Food",
        amount: 0,
        description: "",
        date: today,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-100 mb-5">
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-700/50 rounded-xl">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: t }))}
              className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                form.type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount ($)"
          min="0.01"
          step="0.01"
          value={form.amount || ""}
          onChange={handleChange}
          className="input font-mono"
          required
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="input"
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="input"
          required
        />

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}
