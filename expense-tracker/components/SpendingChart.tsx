"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#a78bfa", "#f472b6", "#34d399", "#fbbf24",
  "#60a5fa", "#fb923c", "#a78bfa", "#e879f9",
  "#2dd4bf",
];

interface Props {
  data: Record<string, number>;
}

export default function SpendingChart({ data }: Props) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spent"]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#71717a" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
