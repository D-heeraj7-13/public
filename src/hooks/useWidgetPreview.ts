import { useEffect, useState } from "react";

export const useWidgetPreview = (itemKey?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemKey) {
      setData([]);
      return;
    }

    setLoading(true);
    fetch("/api/zabbix/cpu", { method: "POST" })
      .then(r => r.json())
      .then(j => {
        const h = j?.result?.history?.find((x: any) => x.key === itemKey);
        if (h?.history) {
          const formatted = h.history.map((point: any) => ({
            date: new Date(Number(point.clock) * 1000).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            value: isNaN(Number(point.value)) ? 0 : Number(point.value),
          }));
          setData(formatted);
        }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [itemKey]);

  return { data, loading };
};
