"use client";

import dynamic from "next/dynamic";
const EncryptedText = dynamic(() => import("@/components/ui/encrypted-text").then(m => m.EncryptedText), { ssr: false });
import { Card, Col, Row, Statistic, Tag, Button } from "antd";
import { SecurityScanOutlined, BugOutlined, TeamOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { FirewallCPUChart } from "@/components/FirewallCPUChart";
import { FirewallMemChart } from "@/components/FirewallMemChart";
import ProblemsTable, { TriggerItem as ProblemsTriggerItem } from "@/components/ProblemsTable";
import { Layout } from "react-grid-layout";
import WidgetGrid from "@/components/widgets/WidgetGrid";
import WidgetCard from "@/components/widgets/WidgetCard";
import AddWidgetModal from "@/components/widgets/AddWidgetModal";

interface TriggerItem {
  triggerid?: string;
  priority: string;
  hosts: { hostid: string; host: string; name: string }[];
  groups: { groupid: string; name: string }[];
  tags?: any[];
  lastchange?: string;
  description?: string;
  status?: string;
}

interface SeverityCount {
  disaster: number;
  high: number;
  average: number;
  warning: number;
  information: number;
  not_classified: number;
}

export default function DashboardPage() {
  const defaultLayout: Layout[] = [
    { i: "severity", x: 0, y: 0, w: 6, h: 14, minH: 8 },
    { i: "cpu", x: 6, y: 0, w: 6, h: 8, minH: 6 },
    { i: "mem", x: 6, y: 8, w: 6, h: 8, minH: 6 },
    { i: "problems", x: 0, y: 14, w: 12, h: 16, minH: 10 },
  ];

  const [data, setData] = useState<Record<string, SeverityCount>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);
  type WidgetType = "graph" | "pie" | "problems" | "availability" | "cpu" | "mem" | "table" | "maps" | "clock";
  type WidgetConfig = {
    id?: string;
    type: WidgetType;
    title?: string;
    label?: string;
    hostid?: string;
    hostids?: string[];
    hostGroupIds?: string[];
    itemKeys?: string[];
    itemKey?: string;
  };

  const [items, setItems] = useState<string[]>(() => layout.map(l => l.i));
  const [widgetConfig, setWidgetConfig] = useState<Record<string, WidgetConfig>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  // Prefetched chart state
  const [cpuInitial, setCpuInitial] = useState<{ data: any[]; categories: string[] }>({ data: [], categories: [] });
  const [memInitial, setMemInitial] = useState<{ data: any[]; categories: string[] }>({ data: [], categories: [] });

  // Problems table state
  const [tableData, setTableData] = useState<ProblemsTriggerItem[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [hostInterfaces] = useState<Record<string, any>>({});

  const severityStyles: Record<keyof SeverityCount, string> = {
    disaster: "bg-red-900 text-red-200",
    high: "bg-rose-900 text-rose-200",
    average: "bg-orange-900 text-orange-200",
    warning: "bg-amber-900 text-amber-200",
    information: "bg-blue-900 text-blue-200",
    not_classified: "bg-slate-700 text-slate-200",
  };

  // Simple tag renderers for ProblemsTable to avoid runtime errors
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/zabbix/problems", { method: "POST" });

      const response = await res.json();
      if (!response || !Array.isArray(response.result)) {
        console.warn("Unexpected API response for triggers:", response);
      }

      const triggers: (TriggerItem & { tags?: any[]; lastchange?: string; description?: string; status?: string })[] =
        Array.isArray(response?.result) ? response.result : [];

      const groupData: Record<string, SeverityCount> = {};

      triggers.forEach((trigger) => {
        trigger.groups.forEach((group) => {
          const groupName = group.name;

          if (!groupData[groupName]) {
            groupData[groupName] = {
              disaster: 0,
              high: 0,
              average: 0,
              warning: 0,
              information: 0,
              not_classified: 0,
            };
          }

          switch (trigger.priority) {
            case "5":
              groupData[groupName].disaster++;
              break;
            case "4":
              groupData[groupName].high++;
              break;
            case "3":
              groupData[groupName].average++;
              break;
            case "2":
              groupData[groupName].warning++;
              break;
            case "1":
              groupData[groupName].information++;
              break;
            case "0":
              groupData[groupName].not_classified++;
              break;
          }
        });
      });

      const oldData = JSON.stringify(data);
      const newData = JSON.stringify(groupData);
      if (oldData !== newData) {
        setDataUpdated(true);
      }

      setData(groupData);
      setLastUpdated(new Date());

      setTableLoading(true);
      const mapped: ProblemsTriggerItem[] = triggers.map((t, idx) => ({
        key: t.triggerid || String(idx),
        triggerid: t.triggerid || String(idx),
        timestamp: t.lastchange ? String(t.lastchange) : "",
        time_from: t.lastchange ? Number(t.lastchange) : undefined,
        time_till: undefined,
        hostname: t.hosts?.[0]?.name || t.hosts?.[0]?.host || "Unknown",
        hostid: t.hosts?.[0]?.hostid || "",
        description: t.description || "",
        priority: t.priority || "0",
        status: t.status || "0",
        depends_on: undefined,
        tags: Array.isArray(t.tags) ? t.tags : [],
      }));
      setTableData(mapped);
    } catch (error) {
      console.error("Error fetching triggers:", error);
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };
  // Load layout, items, and widgetConfig from localStorage after hydration
  useEffect(() => {
    try {
      const savedLayout = window.localStorage.getItem("dashboard_layout");
      const savedItems = window.localStorage.getItem("dashboard_items");
      const savedConfig = window.localStorage.getItem("dashboard_widget_config");

      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        setLayout(parsedLayout);
        if (!savedItems) {
          setItems(parsedLayout.map((l: Layout) => l.i));
        }
      }
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      if (savedConfig) {
        setWidgetConfig(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.warn("Failed to load layout/items/config from localStorage", e);
    }
  }, []);

  // Save layout to localStorage when it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dashboard_layout", JSON.stringify(layout));
      }
    } catch {}
  }, [layout]);

  // Persist items and widget config separately
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dashboard_items", JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dashboard_widget_config", JSON.stringify(widgetConfig));
      }
    } catch {}
  }, [widgetConfig]);

  const handleAddWidget = (config: { hostid: string; hostGroupIds: string[]; itemKeys: string[]; title: string; type: WidgetType }) => {
    if (editingWidgetId) {
      // Edit existing widget
      setWidgetConfig(prev => ({
        ...prev,
        [editingWidgetId]: {
          ...prev[editingWidgetId],
          type: config.type,
          title: config.title,
          hostid: config.hostid,
          hostids: [config.hostid],
          hostGroupIds: config.hostGroupIds,
          itemKeys: config.itemKeys,
        },
      }));
      setEditingWidgetId(null);
    } else {
      // Add new widget
      const id = `widget_${Date.now()}`;
      setItems(prev => [...prev, id]);
      setLayout(prev => [...prev, { i: id, x: 0, y: Infinity, w: 6, h: 10, minH: 6 }]);
      setWidgetConfig(prev => ({
        ...prev,
        [id]: {
          type: config.type,
          title: config.title,
          hostid: config.hostid,
          hostids: [config.hostid],
          hostGroupIds: config.hostGroupIds,
          itemKeys: config.itemKeys,
        },
      }));
    }
    setIsModalOpen(false);
  };

  const handleRemoveWidget = (id: string) => {
    setItems(prev => prev.filter(i => i !== id));
    setLayout(prev => prev.filter(l => l.i !== id));
    setWidgetConfig(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleEditWidget = (id: string) => {
    setEditingWidgetId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWidgetId(null);
  };

  useEffect(() => {
    const prefetchCharts = async () => {
      try {
        const [cpuRes, memRes] = await Promise.all([
          fetch("/api/zabbix/cpu", { method: "POST" }),
          fetch("/api/zabbix/memory", { method: "POST" }),
        ]);

        const [cpuJson, memJson] = await Promise.all([cpuRes.json(), memRes.json()]);

        if (cpuJson?.result?.history) {
          const historyData = cpuJson.result.history as Array<{ key: string; history: Array<{ clock: number; value: string }> }>;
          const targetCPU = historyData.find((item) => item.key === "system.cpu.util[fgSysCpuUsage.0]");
          if (targetCPU && targetCPU.history.length > 0) {
            const formatted = targetCPU.history.map((point) => {
              const clock = Number(point.clock);
              const valueNum = Number(point.value);
              return {
                date: new Date(clock * 1000).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                "CPU Utilization": isNaN(valueNum) ? 0 : valueNum,
              };
            });
            setCpuInitial({ data: formatted, categories: ["CPU Utilization"] });
          }
        }

        if (memJson?.result?.history) {
          const historyData = memJson.result.history as Array<{ key: string; history: Array<{ clock: number; value: string }> }>;
          const targetMem = historyData.find((item) => item.key === "vm.memory.util[memoryUsedPercentage.0]");
          if (targetMem && targetMem.history.length > 0) {
            const formatted = targetMem.history.map((point) => ({
              date: new Date(point.clock * 1000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              "Memory Utilization": parseFloat(point.value),
            }));
            setMemInitial({ data: formatted, categories: ["Memory Utilization"] });
          }
        }
      } catch (e) {
        console.warn("Prefetch charts failed", e);
      }
    };

    prefetchCharts();
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-refresh every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header with Encrypted Text */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white">
          <EncryptedText
            text="Security Operations Center(SOC)"
            encryptedClassName="text-cyan-500"
            revealedClassName="text-white"
            revealDelayMs={30}
          />
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          <EncryptedText
            text="Network Monitoring & Threat Detection Platform"
            encryptedClassName="text-orange-400"
            revealedClassName="text-gray-200"
            revealDelayMs={40}
          />
        </p>
        <p className="text-gray-400">
          

          Real-time security monitoring for Goan enterprises
        </p>
      </div>

      {/* Main Stats */}
      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24} sm={12} md={6}>
          <Card
            className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all"
            variant="outlined"
          >
            <Statistic
              title={
                <span className="text-gray-300">
                  Active Hosts
                </span>
              }
              value={2847}
              prefix={<SecurityScanOutlined className="text-cyan-500" />}
              styles={{ content: { color: "#06b6d4" } }}
              suffix="devices"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all"
            variant="outlined"
          >
            <Statistic
              title={
                <span className="text-gray-300">
                  Active Triggers
                </span>
              }
              value={342}
              prefix={<BugOutlined className="text-orange-500" />}
              styles={{ content: { color: "#f97316" } }}
              suffix="alerts"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all"
            variant="outlined"
          >
            <Statistic
              title={
                <span className="text-gray-300">
                  Team Members
                </span>
              }
              value={156}
              prefix={<TeamOutlined className="text-purple-500" />}
              styles={{ content: { color: "#a855f7" } }}
              suffix="active"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all"
            variant="outlined"
          >
            <Statistic
              title={
                <span className="text-gray-300">
                  Uptime
                </span>
              }
              value={99.94}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              styles={{ content: { color: "#22c55e" } }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* About Techsec */}
      <Row gutter={[24, 24]} className="mb-12">
         
      </Row>

      {/* Services */}
      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24}>
          <h2 className="text-3xl font-bold text-white mb-6">
            Our Services
          </h2>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <SecurityScanOutlined className="text-4xl text-cyan-500 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Network Security
              </h3>
              <p className="text-gray-400">
                Comprehensive network monitoring and threat detection across all
                infrastructure layers
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <BugOutlined className="text-4xl text-orange-500 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Threat Intelligence
              </h3>
              <p className="text-gray-400">
                Real-time threat intelligence and vulnerability assessments to
                stay ahead of attackers
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <TeamOutlined className="text-4xl text-purple-500 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Security Operations
              </h3>
              <p className="text-gray-400">
                Expert SOC services with 24/7 monitoring and rapid incident
                response teams
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Dynamic Grid */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <div className="mb-4 flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} type="primary">Add Widget</Button>
            <Button onClick={() => {
              setLayout(defaultLayout);
              setItems(defaultLayout.map(l => l.i));
              setWidgetConfig({});
            }}>Reset Layout</Button>
          </div>

          <WidgetGrid layout={layout} onLayoutChange={setLayout}>
            {items.includes("severity") && (
              <div key="severity" className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h2 className="text-white text-xl drag-handle cursor-move">Problems by Severity</h2>
                  <div className="flex gap-2">
                    {dataUpdated && (
                      <Button size="small" loading={loading} onClick={() => { fetchData(); setDataUpdated(false); }}>Refresh</Button>
                    )}
                    <Button size="small" danger onClick={() => {
                      setItems(prev => prev.filter(i => i !== "severity"));
                      setLayout(prev => prev.filter(l => l.i !== "severity"));
                    }}>Remove</Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto border rounded-lg shadow">
                    <table className="w-full border-collapse">
                      <thead className="bg-slate-700 text-slate-100 text-sm">
                        <tr>
                          <th className="p-3 text-left">Host Group</th>
                          <th className="p-3">Disaster</th>
                          <th className="p-3">High</th>
                          <th className="p-3">Average</th>
                          <th className="p-3">Warning</th>
                          <th className="p-3">Information</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data).map(([group, values]) => (
                          <tr key={group} className="border-b border-slate-700 hover:bg-slate-700">
                            <td className="p-3 font-medium text-slate-100">{group}</td>
                            <td className={`p-3 text-center font-semibold ${severityStyles.disaster} ${values.disaster === 0 ? "opacity-60" : ""}`}>{values.disaster}</td>
                            <td className={`p-3 text-center font-semibold ${severityStyles.high} ${values.high === 0 ? "opacity-60" : ""}`}>{values.high}</td>
                            <td className={`p-3 text-center font-semibold ${severityStyles.average} ${values.average === 0 ? "opacity-60" : ""}`}>{values.average}</td>
                            <td className={`p-3 text-center font-semibold ${severityStyles.warning} ${values.warning === 0 ? "opacity-60" : ""}`}>{values.warning}</td>
                            <td className={`p-3 text-center font-semibold ${severityStyles.information} ${values.information === 0 ? "opacity-60" : ""}`}>{values.information}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {items.includes("cpu") && (
              <div key="cpu" className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h2 className="text-white text-xl drag-handle cursor-move">Firewall CPU Utilization</h2>
                  <Button size="small" danger onClick={() => {
                    setItems(prev => prev.filter(i => i !== "cpu"));
                    setLayout(prev => prev.filter(l => l.i !== "cpu"));
                  }}>Remove</Button>
                </div>
                <div className="p-4">
                  <FirewallCPUChart initialData={cpuInitial.data} initialCategories={cpuInitial.categories} />
                </div>
              </div>
            )}

            {items.includes("mem") && (
              <div key="mem" className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h2 className="text-white text-xl drag-handle cursor-move">Firewall Memory Utilization</h2>
                  <Button size="small" danger onClick={() => {
                    setItems(prev => prev.filter(i => i !== "mem"));
                    setLayout(prev => prev.filter(l => l.i !== "mem"));
                  }}>Remove</Button>
                </div>
                <div className="p-4">
                  <FirewallMemChart initialData={memInitial.data} initialCategories={memInitial.categories} />
                </div>
              </div>
            )}

            {items.includes("problems") && (
              <div key="problems" className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h2 className="text-white text-xl drag-handle cursor-move">Active Problems</h2>
                  <Button size="small" danger onClick={() => {
                    setItems(prev => prev.filter(i => i !== "problems"));
                    setLayout(prev => prev.filter(l => l.i !== "problems"));
                  }}>Remove</Button>
                </div>
                <div className="p-4">
                  <ProblemsTable
                    data={tableData}
                    hostInterfaces={hostInterfaces}
                    getSeverityTag={getSeverityTag}
                    getStatusTag={getStatusTag}
                    loading={tableLoading}
                    pageSize={10}
                  />
                </div>
              </div>
            )}

            {/* Dynamically added widgets */}
            {items.filter(id => id.startsWith("widget_") && widgetConfig[id]).map(id => (
              <div key={id}>
                <WidgetCard
                  id={id}
                  title={widgetConfig[id]?.title || "Widget"}
                  itemKeys={widgetConfig[id]?.itemKeys || []}
                  hostid={widgetConfig[id]?.hostid}
                  hostGroupIds={widgetConfig[id]?.hostGroupIds}
                  type={widgetConfig[id]?.type || "graph"}
                  onRemove={handleRemoveWidget}
                  onEdit={handleEditWidget}
                />
              </div>
            ))}
          </WidgetGrid>
        </Col>
      </Row>

      <AddWidgetModal
        open={isModalOpen}
        onAdd={handleAddWidget}
        onClose={handleCloseModal}
        editMode={!!editingWidgetId}
        initialConfig={editingWidgetId ? widgetConfig[editingWidgetId] : undefined}
      />
    </div>
   
  );
}






