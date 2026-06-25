import { Transaction, FilterType, CATEGORIES } from "../types";
import { Trash2, Pencil } from "lucide-react";

interface Props {
  transactions: Transaction[];
  loading: boolean;
  filter: FilterType;
  categoryFilter: string;
  onFilterChange: (f: FilterType) => void;
  onCategoryChange: (c: string) => void;
  onDelete: (id: number) => void;
  onEdit: (tx: Transaction) => void;
}

export default function TransactionList({
  transactions,
  loading,
  filter,
  categoryFilter,
  onFilterChange,
  onCategoryChange,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Transactions</h2>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "income", "expense"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-700/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">💸</p>
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-10 rounded-full ${tx.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-medium text-sm">
                      {tx.category}
                    </span>
                    <span
                      className={
                        tx.type === "income" ? "badge-income" : "badge-expense"
                      }
                    >
                      {tx.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {tx.description || "—"} ·{" "}
                    {new Date(tx.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {tx.type === "income" ? "+" : "-"}$
                  {tx.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <button
                  onClick={() => onEdit(tx)}
                  className="opacity-0 group-hover:opacity-100 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 p-2 rounded-lg transition-all duration-200 active:scale-95"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(tx.id)}
                  className="btn-danger opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
