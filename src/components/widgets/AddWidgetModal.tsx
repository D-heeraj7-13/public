import { Modal, Select, Spin } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useZabbixHostGroups, useZabbixHosts } from "@/hooks/useZabbixHosts";
import { useZabbixItems } from "@/hooks/useZabbixItems";
import { FirewallCPUChart } from "@/components/FirewallCPUChart";
import { isGraphable } from "@/lib/graphable";

type WidgetType = "graph" | "pie" | "problems" | "availability" | "cpu" | "mem" | "table" | "maps" | "clock";

interface AddWidgetModalProps {
  open: boolean;
  onAdd: (config: { hostid: string; hostGroupIds: string[]; itemKeys: string[]; title: string; type: WidgetType }) => void;
  onClose: () => void;
  editMode?: boolean;
  initialConfig?: {
    hostid?: string;
    hostGroupIds?: string[];
    itemKeys?: string[];
    title?: string;
    type?: WidgetType;
  };
}

export default function AddWidgetModal({ open, onAdd, onClose, editMode = false, initialConfig }: AddWidgetModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedHost, setSelectedHost] = useState<string>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<WidgetType>(initialConfig?.type || "graph");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewCategories, setPreviewCategories] = useState<string[]>([]);
  const [previewProblems, setPreviewProblems] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const typeOptions = [
    { value: "graph", label: "Graph" },
    { value: "pie", label: "Pie Chart" },
    { value: "table", label: "Table" },
    { value: "maps", label: "Map" },
    { value: "clock", label: "Clock" },
    { value: "problems", label: "Problems" },
    { value: "cpu", label: "CPU (quick)" },
    { value: "mem", label: "Memory (quick)" },
  ];

  const { groups, loading: loadingGroups } = useZabbixHostGroups();
  const { hosts, loading: loadingHosts } = useZabbixHosts(selectedGroups);
  const { items, loading: loadingItems } = useZabbixItems(selectedHost);

  // Load initial config for edit mode
  useEffect(() => {
    if (open && editMode && initialConfig) {
      if (initialConfig.hostGroupIds) setSelectedGroups(initialConfig.hostGroupIds);
      if (initialConfig.hostid) setSelectedHost(initialConfig.hostid);
      if (initialConfig.itemKeys) setSelectedItems(initialConfig.itemKeys);
      if (initialConfig.type) setSelectedType(initialConfig.type);
    }
  }, [open, editMode, initialConfig]);

  // Preserve state in sessionStorage (only in add mode)
  useEffect(() => {
    if (open && !editMode) {
      try {
        const saved = sessionStorage.getItem("addWidgetModalState");
        if (saved) {
          const state = JSON.parse(saved);
          if (state.selectedGroups) setSelectedGroups(state.selectedGroups);
          if (state.selectedHost) setSelectedHost(state.selectedHost);
          if (state.selectedItems) setSelectedItems(state.selectedItems);
          if (state.selectedType) setSelectedType(state.selectedType);
        }
      } catch (e) {
        console.warn("Failed to load modal state", e);
      }
    }
  }, [open, editMode]);

  useEffect(() => {
    try {
      sessionStorage.setItem("addWidgetModalState", JSON.stringify({
        selectedGroups,
        selectedHost,
        selectedItems,
        selectedType,
      }));
    } catch (e) {
      console.warn("Failed to save modal state", e);
    }
  }, [selectedGroups, selectedHost, selectedItems, selectedType]);

  // Reset metrics when type changes
  useEffect(() => {
    setSelectedItems([]);
  }, [selectedType]);

  // Filter only graphable items
  const safeItems = useMemo(
    () => items.filter(i => isGraphable(i.value, i.label)),
    [items]
  );

  const cpuItems = useMemo(() => safeItems.filter(i => /cpu/i.test(i.value) || /cpu/i.test(i.label)), [safeItems]);
  const memItems = useMemo(() => safeItems.filter(i => /(mem|memory)/i.test(i.value) || /(mem|memory)/i.test(i.label)), [safeItems]);

  const filteredItems = useMemo(() => {
    switch (selectedType) {
      case "cpu":
        return cpuItems;
      case "mem":
        return memItems;
      case "graph":
      case "pie":
      case "table":
        return safeItems;
      case "maps":
      case "problems":
      case "clock":
        return [];
      default:
        return [];
    }
  }, [selectedType, cpuItems, memItems, safeItems]);

  // Auto-select effective keys (user selection or defaults per type)
  const effectiveKeys = useMemo(() => {
    if (selectedType === "problems") return [];
    const base = filteredItems;
    if (selectedItems.length > 0) return selectedItems;
    return base.slice(0, 3).map(i => i.value);
  }, [selectedItems, filteredItems, selectedType]);

  // Fetch preview with auto-fallback
  useEffect(() => {
    // Reset preview when dependencies change
    setPreviewData([]);
    setPreviewProblems([]);
    setPreviewCategories([]);

    if (selectedType === "problems") {
      setLoadingPreview(true);
      fetch("/api/zabbix/problems", { method: "POST" })
        .then(r => r.json())
        .then(j => {
          const list = Array.isArray(j?.result) ? j.result.slice(0, 5) : [];
          setPreviewProblems(list);
        })
        .catch(() => setPreviewProblems([]))
        .finally(() => setLoadingPreview(false));
      return;
    }

    if (selectedType === "maps") {
      setLoadingPreview(true);
      fetch("/api/zabbix/maps", { method: "POST" })
        .then(r => r.json())
        .then(j => {
          const list = Array.isArray(j?.result) ? j.result.slice(0, 5) : [];
          setPreviewProblems(list); // Reuse for map list display
        })
        .catch(() => setPreviewProblems([]))
        .finally(() => setLoadingPreview(false));
      return;
    }

    if (selectedType === "clock") {
      // Clock doesn't need preview data
      setLoadingPreview(false);
      return;
    }

    if (!selectedHost || !filteredItems.length) {
      return;
    }

    const keys = effectiveKeys;
    if (!keys.length) return;

    setLoadingPreview(true);
    fetch("/api/zabbix/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostid: selectedHost,
        itemKeys: keys,
        
      }),
    })
      .then(r => r.json())
      .then(j => {
        const list = Array.isArray(j?.result?.history) ? j.result.history : [];
        if (!list.length) {
          setPreviewData([]);
          setPreviewCategories([]);
          return;
        }

        // Merge multiple series into rows keyed by time label
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
        setPreviewData(rows);
        setPreviewCategories(cats);
      })
      .catch(() => setPreviewData([]))
      .finally(() => setLoadingPreview(false));
  }, [selectedHost, selectedType, effectiveKeys, filteredItems]);

  const handleAdd = () => {
    // Maps and Problems only need hostGroupIds, not hostid or items
    if (selectedType === "maps" || selectedType === "problems") {
      if (!selectedGroups.length) return;
    } else if (selectedType === "clock") {
      // Clock doesn't need anything
    } else {
      // Other types need hostid and items
      if (!selectedHost || !effectiveKeys.length) return;
    }

    const itemLabel = 
      selectedType === "problems"
        ? "Problems"
        : selectedType === "maps"
        ? "Zabbix Map"
        : selectedType === "clock"
        ? "Clock"
        : filteredItems.find(i => i.value === effectiveKeys[0])?.label || "Graph";

    onAdd({
      hostid: selectedHost || "",
      hostGroupIds: selectedGroups,
      itemKeys: (selectedType === "problems" || selectedType === "maps" || selectedType === "clock") ? [] : effectiveKeys,
      title: itemLabel,
      type: selectedType,
    });
    
    // Clear saved state after successful add
    try {
      sessionStorage.removeItem("addWidgetModalState");
    } catch (e) {
      console.warn("Failed to clear modal state", e);
    }
    
    // Reset
    setSelectedGroups([]);
    setSelectedHost(undefined);
    setSelectedItems([]);
    setPreviewData([]);
    setPreviewProblems([]);
    setSelectedType("graph");
  };

  return (
    <Modal 
      title={editMode ? "Edit Widget" : "Add Widget"}
      open={open} 
      onOk={handleAdd} 
      onCancel={onClose}
      okText={editMode ? "Save" : "Add"}
      width={800}
    >
      <div className="space-y-4">
        <div>
          <div className="text-sm mb-1 font-semibold">Type</div>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-semibold">Host groups</div>
            {groups.length > 0 && (
              <button
                onClick={() => {
                  const allGroupIds = groups.map(g => g.value);
                  setSelectedGroups(selectedGroups.length === allGroupIds.length ? [] : allGroupIds);
                }}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                {selectedGroups.length === groups.length && groups.length > 0 ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
          {loadingGroups ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              placeholder="Select host groups"
              options={groups}
              onChange={setSelectedGroups}
              value={selectedGroups}
              style={{ width: "100%" }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-semibold">Hosts</div>
            {hosts.length > 0 && selectedGroups.length > 0 && (
              <div className="text-xs text-gray-500">
                {hosts.length} host{hosts.length !== 1 ? 's' : ''} available
              </div>
            )}
          </div>
          {loadingHosts ? (
            <Spin />
          ) : (
            <Select
              showSearch
              placeholder="Select host"
              options={hosts}
              onChange={setSelectedHost}
              value={selectedHost}
              disabled={!selectedGroups.length}
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          )}
        </div>

        {selectedHost && selectedType !== "problems" && selectedType !== "maps" && selectedType !== "clock" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold">Metrics</div>
              {filteredItems.length > 0 && (
                <button
                  onClick={() => {
                    const allItemKeys = filteredItems.map(i => i.value);
                    setSelectedItems(selectedItems.length === allItemKeys.length ? [] : allItemKeys);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            {loadingItems ? (
              <Spin />
            ) : (
              <Select
                mode="multiple"
                showSearch
                placeholder={filteredItems.length > 0 ? "Select metrics (auto-selected if empty)" : "No metrics found for this type"}
                options={filteredItems}
                onChange={setSelectedItems}
                value={selectedItems}
                disabled={selectedType === "cpu" || selectedType === "mem"}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            )}
            {filteredItems.length > 0 && selectedItems.length === 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Top {Math.min(3, filteredItems.length)} metrics auto-selected for preview
              </div>
            )}
            {(selectedType === "cpu" || selectedType === "mem") && filteredItems.length === 0 && (
              <div className="text-xs text-red-400 mt-1">No matching metrics found for this type on the selected host.</div>
            )}
          </div>
        )}

        {((selectedHost && selectedType !== "problems" && selectedType !== "maps" && selectedType !== "clock" && filteredItems.length > 0) || selectedType === "problems" || selectedType === "maps") && (
          <div className="mt-6 border-t pt-4">
            <div className="text-sm font-semibold mb-3">Preview</div>
            {loadingPreview ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : selectedType === "problems" ? (
              previewProblems.length > 0 ? (
                <div className="text-sm text-gray-200 space-y-2 bg-slate-800 p-3 rounded border border-slate-700">
                  {previewProblems.map((p: any) => (
                    <div key={p.triggerid || p.eventid || p.description} className="flex justify-between gap-2">
                      <span className="font-medium text-slate-100">{p.description || "Problem"}</span>
                      <span className="text-xs text-gray-400">sev {p.priority ?? "-"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No data available (try refresh or different scope)
                </div>
              )
            ) : selectedType === "maps" ? (
              previewProblems.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 mb-2">
                    {previewProblems.length} map{previewProblems.length > 1 ? 's' : ''} available:
                  </div>
                  <div className="text-sm text-gray-200 space-y-2 bg-slate-800 p-3 rounded border border-slate-700 max-h-64 overflow-y-auto">
                    {previewProblems.map((m: any) => (
                      <div key={m.mapid || m.name} className="flex justify-between gap-2 p-2 hover:bg-slate-700 rounded">
                        <span className="font-medium text-slate-100">{m.name || "Map"}</span>
                        <span className="text-xs text-gray-400">ID: {m.mapid || "-"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-green-400 mt-2">
                    ✓ Map widget will render interactively on your dashboard
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No maps available in your Zabbix instance
                </div>
              )
            ) : previewData.length > 0 ? (
              <FirewallCPUChart initialData={previewData} initialCategories={previewCategories.length ? previewCategories : ["value"]} />
            ) : (
              <div className="text-center text-gray-400 py-8">
                No data available (try different metrics)
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
