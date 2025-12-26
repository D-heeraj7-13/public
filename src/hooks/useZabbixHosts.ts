import { useEffect, useState } from "react";
import { getHostGroups, getHosts } from "@/lib/zabbix";

export const useZabbixHostGroups = () => {
  const [groups, setGroups] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHostGroups()
      .then(res => {
        setGroups(
          res.data.result.map((g: any) => ({
            label: g.name,
            value: String(g.groupid),
          }))
        );
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return { groups, loading };
};

export const useZabbixHosts = (groupIds: string[]) => {
  const [hosts, setHosts] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupIds?.length) {
      setHosts([]);
      return;
    }

    setLoading(true);
    getHosts(groupIds)
      .then(res => {
        setHosts(
          res.data.result.map((h: any) => ({
            label: h.name,
            value: String(h.hostid),
          }))
        );
      })
      .catch(() => setHosts([]))
      .finally(() => setLoading(false));
  }, [groupIds.join(",")]);

  return { hosts, loading };
};
