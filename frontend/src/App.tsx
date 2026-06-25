import { useState, useEffect, useCallback } from "react";
import {
  Transaction,
  Summary,
  NewTransaction,
  FilterType,
  CATEGORIES,
} from "./types";
import {
  fetchTransactions,
  fetchSummary,
  addTransaction,
  deleteTransaction,
} from "./api";
import Dashboard from "./components/Dashboard";
import SpendingChart from "./components/SpendingChart";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import { BarChart2, X } from "lucide-react";

const DEFAULT_SUMMARY: Summary = {
  balance: 0,
  total_income: 0,
  total_expenses: 0,
  by_category: [],
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>(DEFAULT_SUMMARY);
  const [loadingTx, setLoadingTx] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");

  // Edit modal state
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load summary");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoadingTx(true);
    try {
      const data = await fetchTransactions(filter, categoryFilter);
      setTransactions(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
    } finally {
      setLoadingTx(false);
    }
  }, [filter, categoryFilter]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleAdd = async (data: NewTransaction) => {
    await addTransaction(data);
    await Promise.all([loadTransactions(), loadSummary()]);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      await Promise.all([loadTransactions(), loadSummary()]);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete transaction",
      );
    }
  };

  const handleEditSave = async () => {
    if (!editingTx) return;
    setEditError("");

    if (editingTx.amount <= 0) {
      setEditError("Amount must be greater than 0");
      return;
    }

    setEditLoading(true);
    try {
      // Delete old + add updated (since we have no PUT endpoint)
      await deleteTransaction(editingTx.id);
      await addTransaction({
        type: editingTx.type,
        category: editingTx.category,
        amount: editingTx.amount,
        description: editingTx.description,
        date: editingTx.date,
      });
      setEditingTx(null);
      await Promise.all([loadTransactions(), loadSummary()]);
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : "Failed to update transaction",
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <BarChart2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100">FinTrack</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personal Finance Tracker
              </p>
            </div>
          </div>
          <a
            href="https://github.com/ibrahimf90"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            by Ibrahim Fayyad
          </a>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-rose-400 hover:text-rose-300 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Dashboard summary={summary} loading={loadingSummary} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingChart
              data={summary.by_category}
              loading={loadingSummary}
            />
          </div>
          <div>
            <TransactionForm onAdd={handleAdd} />
          </div>
        </div>
        <TransactionList
          transactions={transactions}
          loading={loadingTx}
          filter={filter}
          categoryFilter={categoryFilter}
          onFilterChange={setFilter}
          onCategoryChange={setCategoryFilter}
          onDelete={handleDelete}
          onEdit={setEditingTx}
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-xs border-t border-slate-700/50 mt-6">
        FinTrack © {new Date().getFullYear()} · Built by{" "}
        <a
          href="https://github.com/ibrahimf90"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Ibrahim Fayyad
        </a>
      </footer>

      {/* Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-slate-100">
                Edit Transaction
              </h2>
              <button
                onClick={() => setEditingTx(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-700/50 rounded-xl">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setEditingTx((p) => (p ? { ...p, type: t } : p))
                    }
                    className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                      editingTx.type === t
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
                value={editingTx.category}
                onChange={(e) =>
                  setEditingTx((p) =>
                    p
                      ? {
                          ...p,
                          category: e.target.value as Transaction["category"],
                        }
                      : p,
                  )
                }
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
                min="0.01"
                step="0.01"
                value={editingTx.amount || ""}
                onChange={(e) =>
                  setEditingTx((p) =>
                    p ? { ...p, amount: parseFloat(e.target.value) || 0 } : p,
                  )
                }
                className="input font-mono"
                placeholder="Amount ($)"
              />

              {/* Description */}
              <input
                type="text"
                value={editingTx.description}
                onChange={(e) =>
                  setEditingTx((p) =>
                    p ? { ...p, description: e.target.value } : p,
                  )
                }
                className="input"
                placeholder="Description (optional)"
              />

              {/* Date */}
              <input
                type="date"
                value={editingTx.date}
                onChange={(e) =>
                  setEditingTx((p) => (p ? { ...p, date: e.target.value } : p))
                }
                className="input"
              />

              {editError && (
                <p className="text-rose-400 text-sm bg-rose-500/10 px-4 py-2 rounded-lg">
                  {editError}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setEditingTx(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2.5 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className="flex-1 btn-primary"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
