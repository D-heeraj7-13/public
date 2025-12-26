"use client";

import React from "react";
import { Table, Tag, Checkbox, Button, Space } from "antd";

export interface TriggerItem {
  key: string;
  triggerid: string;
  timestamp: string;
  time_from?: number;
  time_till?: number;
  hostname: string;
  hostid: string;
  description: string;
  comments?: string;
  priority: string;
  status: string;
  depends_on?: string;
  tags?: Array<{ tag: string; value?: string }>;
}

interface ProblemsTableProps {
  data: TriggerItem[];
  hostInterfaces: { [key: string]: any };
  getSeverityTag: (priority: string) => React.ReactNode;
  getStatusTag: (status: string) => React.ReactNode;
  loading?: boolean;
  pageSize?: number;
}

export function ProblemsTable({ data, hostInterfaces, getSeverityTag, getStatusTag, loading = false, pageSize = 10 }: ProblemsTableProps) {
  const columns = [
    {
      title: <Checkbox />,
      key: "checkbox",
      width: 40,
      render: () => <Checkbox />,
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 140,
      render: (_text: string, record: TriggerItem, index: number) => {
        if (!record.time_from) return <span style={{ fontSize: "13px" }}>-</span>;

        const date = new Date(record.time_from * 1000);
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const dateStr = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
        
        const monthName = date.toLocaleDateString("en-US", { month: "long" });
        const isFirstInMonth = index === 0 || 
          (data[index - 1]?.time_from !== undefined && 
           new Date(data[index - 1].time_from! * 1000).getMonth() !== date.getMonth());

        return (
          <div style={{ position: "relative", paddingLeft: "40px", minHeight: "60px" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: 0,
                bottom: index === data.length - 1 ? "50%" : 0,
                width: "2px",
                background: "linear-gradient(180deg, #1890ff 0%, #69c0ff 100%)",
              }}
            />
            
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: "10px",
                top: "12px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#fff",
                border: "3px solid #1890ff",
                boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.1)",
                zIndex: 1,
              }}
            />

            {/* Month label */}
            {isFirstInMonth && (
              <div
                style={{
                  position: "absolute",
                  left: "-85px",
                  top: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#595959",
                  background: "#f5f5f5",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {monthName}
              </div>
            )}

            {/* Time content */}
            <div style={{ fontSize: "13px" }}>
              <div style={{ color: "#1890ff", fontWeight: 600, marginBottom: "2px" }}>
                {timeStr}
              </div>
              <div style={{ color: "#8c8c8c", fontSize: "11px" }}>{dateStr}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Severity",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: string) => getSeverityTag(priority),
    },
    {
      title: "Recovery time",
      key: "recovery",
      width: 140,
      render: (_text: string, record: TriggerItem) => {
        if (!record.time_till)
          return <span style={{ fontSize: "13px", color: "#999" }}>-</span>;

        const date = new Date(record.time_till * 1000);
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const dateStr = date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        return (
          <div style={{ fontSize: "13px" }}>
            <div style={{ color: "#52c41a", fontWeight: 500 }}>{timeStr}</div>
            <div style={{ color: "#999", fontSize: "11px" }}>{dateStr}</div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Interface",
      key: "interface",
      width: 130,
      render: (_text: string, record: TriggerItem) => {
        const iface = record.hostid ? hostInterfaces[record.hostid] : null;
        if (!iface) {
          return <span style={{ fontSize: "12px", color: "#999" }}>-</span>;
        }
        return (
          <div style={{ fontSize: "12px" }}>
            <div>
              <strong>IP:</strong> {iface.ip}
            </div>
            {iface.dns && (
              <div>
                <strong>DNS:</strong> {iface.dns}
              </div>
            )}
            {iface.port && (
              <div>
                <strong>Port:</strong> {iface.port}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Info",
      key: "info",
      width: 50,
      render: () => <span>-</span>,
    },
    {
      title: "Host",
      dataIndex: "hostname",
      key: "hostname",
      width: 120,
      render: (text: string) => <a style={{ color: "#1677ff" }}>{text}</a>,
    },
    {
      title: "Problem",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text: string, record: TriggerItem) => (
        <div>
          <a style={{ color: "#1677ff" }}>{text}</a>
          {record.depends_on && (
            <div style={{ fontSize: "11px", color: "#999", marginTop: 4 }}>
              Depends on: {record.depends_on}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      width: 100,
      render: (_text: string, record: TriggerItem) => {
        if (!record.time_from) return <span style={{ fontSize: "13px" }}>-</span>;

        const DurationCell = () => {
          const [duration, setDuration] = React.useState("");

          React.useEffect(() => {
            const calculateDuration = () => {
              const startTime = record.time_from! * 1000;
              const endTime = record.time_till ? record.time_till * 1000 : Date.now();
              const diffMs = endTime - startTime;

              const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

              let result = "";
              if (days > 0) result = `${days}d ${hours}h ${minutes}m`;
              else if (hours > 0) result = `${hours}h ${minutes}m ${seconds}s`;
              else if (minutes > 0) result = `${minutes}m ${seconds}s`;
              else result = `${seconds}s`;

              setDuration(result);
            };

            calculateDuration();
            const interval = setInterval(calculateDuration, 1000);

            return () => clearInterval(interval);
          }, []);

          return <span style={{ fontSize: "13px", fontWeight: 500 }}>{duration}</span>;
        };

        return <DurationCell />;
      },
    },
    {
      title: "Update",
      key: "update",
      width: 70,
      render: () => (
        <Button type="link" size="small" style={{ padding: 0 }}>
          Update
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: () => (
        <Button type="link" size="small" style={{ padding: 0 }}>
          Actions
        </Button>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      width: 600,
      render: (_text: string, record: TriggerItem) => {
        if (!record.tags || record.tags.length === 0) {
          return <span style={{ fontSize: "12px", color: "#999" }}>-</span>;
        }

        const tagColors = ["blue", "green", "orange", "purple", "cyan", "magenta"] as const;

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "100%", overflow: "visible" }}>
            {record.tags.map((tag, index) => (
              <Tag 
                key={index} 
                color={tagColors[index % tagColors.length]} 
                style={{ 
                  fontSize: "11px", 
                  margin: 0, 
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  display: "inline-block"
                }}
              >
                {tag.tag}
                {tag.value ? `: ${tag.value}` : ""}
              </Tag>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="key"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize, showSizeChanger: false }}
      scroll={{ x: true }}
      size="small"
      style={{ marginTop: "16px" }}
    />
  );
}

export default ProblemsTable;