import { useEffect, useState } from "react";
import { getItems } from "@/lib/zabbix";
import { previewScore } from "@/lib/previewScore";

export const useZabbixItems = (hostid?: string) => {
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hostid) {
      setItems([]);
      return;
    }

    setLoading(true);
    getItems(hostid)
      .then(res => {
        setItems(
          res.data.result
            .map((i: any) => ({ label: i.name, value: i.key_ }))
            .sort((a: any, b: any) => previewScore(b.label) - previewScore(a.label))
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [hostid]);

  return { items, loading };
};
