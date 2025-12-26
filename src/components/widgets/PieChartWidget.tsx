"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface PieChartWidgetProps {
  data: Array<{ label: string; value: number }>;
}

const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#22d3ee", "#fb7185", "#f59e0b"];

export default function PieChartWidget({ data }: PieChartWidgetProps) {
  const series = data && data.length > 0 ? data : [{ label: "No Data", value: 1 }];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie dataKey="value" data={series} cx="50%" cy="50%" outerRadius={80} label>
            {series.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
