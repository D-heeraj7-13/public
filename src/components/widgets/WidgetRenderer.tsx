"use client";

import { FirewallCPUChart } from "@/components/FirewallCPUChart";
import PieChartWidget from "./PieChartWidget";
import ClockWidget from "./ClockWidget";
import MapWidget from "./MapWidget";
import ProblemsTable, { TriggerItem } from "@/components/ProblemsTable";
import { Tag } from "antd";
import { ReactNode } from "react";

interface WidgetRendererProps {
  type: string;
  data: any[];
  loading: boolean;
  title?: string;
  categories?: string[];
  hostGroupIds?: string[];
}

export function WidgetRenderer({ type, data, loading, title, categories, hostGroupIds }: WidgetRendererProps) {
  // Helper functions for problems table
  const getSeverityTag = (priority: string) => {
    const map: Record<string, { color: string; label: string }> = {
      "5": { color: "red", label: "Disaster" },
      "4": { color: "volcano", label: "High" },
      "3": { color: "orange", label: "Average" },
      "2": { color: "gold", label: "Warning" },
      "1": { color: "blue", label: "Information" },
      "0": { color: "default", label: "Not classified" },
    };
    const entry = map[priority] ?? { color: "default", label: "Unknown" };
    return <Tag color={entry.color}>{entry.label}</Tag>;
  };

  const getStatusTag = (status: string) => {
    if (status === "0") return <Tag color="red">Problem</Tag>;
    if (status === "1") return <Tag color="green">OK</Tag>;
    return <Tag color="default">-</Tag>;
  };

  // Widget types that handle their own data fetching
  const selfManagedTypes = ["maps", "problems", "clock"];

  if (loading && !selfManagedTypes.includes(type)) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Only show "no data" for types that require external data
  if (!selfManagedTypes.includes(type) && (!data || data.length === 0)) {
    return (
      <div className="text-center text-gray-400 py-8">
        No data available
      </div>
    );
  }

  switch (type) {
    case "graph":
    case "cpu":
    case "mem":
      // For graph types, render area chart
      // If categories not provided, infer from data keys
      const inferredCats = categories && categories.length > 0
        ? categories
        : (data && data.length ? Object.keys(data[0]).filter(k => k !== "date") : ["value"]);
      return <FirewallCPUChart initialData={data || []} initialCategories={inferredCats} />;
    
    case "pie":
      // Aggregate into buckets by rounding value
      const buckets = new Map<string, number>();
      (data || []).forEach((d: any) => {
        const v = typeof d.value === "number" ? d.value : Number(d.value);
        if (isNaN(v)) return;
        const key = `${Math.round(v)}`;
        buckets.set(key, (buckets.get(key) || 0) + 1);
      });
      const pieData = Array.from(buckets.entries()).map(([label, count]) => ({ label, value: count }));
      
      if (pieData.length === 0) {
        return (
          <div className="text-center text-gray-400 py-8">
            No data available for pie chart
          </div>
        );
      }
      return <PieChartWidget data={pieData} />;

    case "problems":
      // Problems fetches its own data, just render the widget
      if (loading) {
        return (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-pulse">Loading problems...</div>
          </div>
        );
      }
      
      if (!data || data.length === 0) {
        return (
          <div className="text-center text-gray-400 py-8">
            No problems to display
          </div>
        );
      }

      // Convert data to ProblemsTable format
      const problemsData: TriggerItem[] = data.map((item: any, idx: number) => ({
        key: item.triggerid || item.eventid || String(idx),
        triggerid: item.triggerid || item.eventid || String(idx),
        timestamp: item.lastchange ? String(item.lastchange) : "",
        time_from: item.lastchange ? Number(item.lastchange) : undefined,
        time_till: undefined,
        hostname: item.hosts?.[0]?.name || item.hosts?.[0]?.host || "Unknown",
        hostid: item.hosts?.[0]?.hostid || "",
        description: item.description || "",
        priority: item.priority || "0",
        status: item.status || "0",
        depends_on: undefined,
        tags: Array.isArray(item.tags) ? item.tags : [],
      }));

      return (
        <ProblemsTable
          data={problemsData}
          hostInterfaces={{}}
          getSeverityTag={getSeverityTag}
          getStatusTag={getStatusTag}
          loading={false}
          pageSize={5}
        />
      );

    case "table":
      // Generic table for other data types
      if (!data || data.length === 0) {
        return (
          <div className="text-center text-gray-400 py-8">
            No table data available
          </div>
        );
      }

      return (
        <div className="overflow-x-auto border rounded-lg shadow border-slate-700">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {data.slice(0, 10).map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="p-3 text-slate-100">{JSON.stringify(item).substring(0, 100)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    
    case "maps":
      // Maps widget manages its own data fetching
      return <MapWidget hostGroupIds={hostGroupIds} />;
    
    case "clock":
      // Clock widget doesn't need data
      return <ClockWidget timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} />;

    default:
      return (
        <div className="text-center text-gray-400 py-8">
          Unknown widget type: {type}
        </div>
      );
  }
}
