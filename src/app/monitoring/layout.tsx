"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen overflow-hidden">

      <div
        className="fixed left-0 top-0 h-screen bg-white border-r overflow-hidden transition-all duration-300"
        style={{ width: collapsed ? 64 : 256 }}
      >

        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div
        className="flex-1 h-screen overflow-y-auto bg-white p-6 transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 256 }}
      >
        {children}
      </div>

    </div>
  );
}
