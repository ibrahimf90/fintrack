import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CategoryTotal } from "../types";

interface Props {
  data: CategoryTotal[];
  loading: boolean;
}

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F43F5E",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export default function SpendingChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Spending by Category
        </h2>
        <div className="h-64 bg-slate-700/50 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-48">
        <p className="text-slate-400">No expense data yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">
        Spending by Category
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            }
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#F1F5F9",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#94A3B8", fontSize: "13px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
