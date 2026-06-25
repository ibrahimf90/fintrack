import { Summary } from "../types";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Props {
  summary: Summary;
  loading: boolean;
}

function StatCard({
  label,
  amount,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        {loading ? (
          <div className="h-7 w-32 bg-slate-700 animate-pulse rounded-lg mt-1" />
        ) : (
          <p className="text-2xl font-mono font-semibold text-slate-100">
            ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ summary, loading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Balance"
        amount={summary.balance}
        icon={Wallet}
        color="bg-indigo-500/10 text-indigo-400"
        loading={loading}
      />
      <StatCard
        label="Total Income"
        amount={summary.total_income}
        icon={TrendingUp}
        color="bg-emerald-500/10 text-emerald-400"
        loading={loading}
      />
      <StatCard
        label="Total Expenses"
        amount={summary.total_expenses}
        icon={TrendingDown}
        color="bg-rose-500/10 text-rose-400"
        loading={loading}
      />
    </div>
  );
}
