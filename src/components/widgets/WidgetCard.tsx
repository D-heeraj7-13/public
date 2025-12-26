import { Button } from "antd";
import { useState, useEffect } from "react";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";

interface WidgetCardProps {
  id: string;
  title: string;
  itemKeys: string[];
  hostid?: string;
  hostGroupIds?: string[];
  type?: string;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function WidgetCard({ id, title, itemKeys, hostid, hostGroupIds, type = "graph", onRemove, onEdit }: WidgetCardProps) {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData([]);

    if (type === "maps" || type === "clock") {
      // Maps and Clock widgets don't need to fetch data here
      // They handle their own data fetching internally
      return;
    }

    if (type === "problems") {
      setLoading(true);
      fetch("/api/zabbix/problems", { method: "POST" })
        .then(r => r.json())
        .then(j => {
          const list = Array.isArray(j?.result) ? j.result.slice(0, 10) : [];
          setData(list);
        })
        .catch(() => setData([]))
        .finally(() => setLoading(false));
      return;
    }

    if (!hostid || !itemKeys?.length) return;

    setLoading(true);

    // Use the same generic history endpoint as the modal preview
    fetch("/api/zabbix/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostid, itemKeys }),
    })
      .then(r => r.json())
      .then(j => {
        const list = Array.isArray(j?.result?.history) ? j.result.history : [];
        if (!list.length) {
          setData([]);
          setCategories([]);
          return;
        }
        const rowsMap = new Map<string, any>();
        const cats: string[] = [];
        list.forEach((s: any, idx: number) => {
          const seriesKey = s.name || s.key || `series_${idx + 1}`;
          if (!cats.includes(seriesKey)) cats.push(seriesKey);
          (s.history || []).forEach((p: any) => {
            const label = new Date(Number(p.clock) * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const row = rowsMap.get(label) || { date: label };
            const v = Number(p.value);
            row[seriesKey] = isNaN(v) ? 0 : v;
            rowsMap.set(label, row);
          });
        });
        const rows = Array.from(rowsMap.values()).sort((a, b) =>
          new Date(`1970-01-01T${a.date}Z`).getTime() - new Date(`1970-01-01T${b.date}Z`).getTime()
        );
        setData(rows);
        setCategories(cats);
      })
      .catch(err => {
        console.error("History fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [itemKeys, hostid, type]);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-white text-xl drag-handle cursor-move">{title}</h2>
        <div className="flex gap-2">
          {onEdit && (
            <Button size="small" onClick={() => onEdit(id)}>
              Edit
            </Button>
          )}
          <Button size="small" danger onClick={() => onRemove(id)}>
            Remove
          </Button>
        </div>
      </div>
      <div className="p-4">
        <WidgetRenderer 
          type={type} 
          data={data} 
          loading={loading} 
          title={title} 
          categories={categories}
          hostGroupIds={hostGroupIds}
        />
      </div>
    </div>
  );
}
