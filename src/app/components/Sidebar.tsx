"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  HomeIcon,
  ChartBarIcon,
  BellAlertIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  DocumentChartBarIcon,
  ArchiveBoxIcon,
  ServerStackIcon,
  BugAntIcon,
} from "@heroicons/react/24/outline";

// ---------------------------
// PROPS
// ---------------------------
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

// ---------------------------
// MENU ITEMS
// ---------------------------
const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },

  {
    name: "Monitoring",
    icon: BugAntIcon,
    children: [
      { name: "Problems", href: "/monitoring/problems" },
      { name: "Hosts", href: "/monitoring/hosts" },
      { name: "Latest Data", href: "/monitoring/latest-data" },
      { name: "Maps", href: "/monitoring/maps" },
      { name: "Discovery", href: "/monitoring/discovery" },
    ],
  },

  {
    name: "Services",
    icon: ChartBarIcon,
    children: [
      { name: "Services", href: "/services/services" },
      { name: "SLA", href: "/services/sla" },
      { name: "SLA Report", href: "/services/sla_report" },
    ],
  },

  {
    name: "Inventory",
    icon: ArchiveBoxIcon,
    children: [
      { name: "Overview", href: "/inventory/overview" },
      { name: "Hosts", href: "/inventory/hosts" },
    ],
  },

  {
    name: "Data Collection",
    icon: ServerStackIcon,
    children: [
      { name: "Template Groups", href: "/data_collection/template_group" },
      { name: "Host Group", href: "/data_collection/host_groups" },
      { name: "Templates", href: "/data_collection/templates" },
      { name: "Hosts", href: "/data_collection/hosts" },
      { name: "Maintenance", href: "/data_collection/maintenance" },
      { name: "Event Correlation", href: "/data_collection/event_correlation" },
      { name: "Discovery", href: "/data_collection/discovery" },
    ],
  },

  {
    name: "Reports",
    icon: DocumentChartBarIcon,
    children: [
      { name: "System Information", href: "/reports/SysInfo" },
      { name: "System Reports", href: "/reports/SysReport" },
      { name: "Availability Reports", href: "/reports/Availability_Reports" },
      { name: "Top 100 Triggers", href: "/reports/Top100_triggers" },
      { name: "Audit Logs", href: "/reports/Audit_logs" },
      { name: "Notifications", href: "/reports/Notification" },
    ],
  },

  {
    name: "Alerts",
    icon: BellAlertIcon,
    children: [
      {
        name: "Actions",
        href: "/alerts/actions",
        children: [
          { name: "Trigger Actions", href: "/alerts/actions/trigger_action" },
          { name: "Service Actions", href: "/alerts/actions/service_action" },
          { name: "Discovery Actions", href: "/alerts/actions/discovery_action" },
          { name: "Autoregistration Actions", href: "/alerts/actions/autoregistration_action" },
          { name: "Internal Actions", href: "/alerts/actions/internal_action" },
        ],
      },
      { name: "Media Types", href: "/alerts/mediatypes" },
      { name: "Script", href: "/alerts/scripts" },
    ],
  },

  {
    name: "Users",
    icon: UserIcon,
    children: [
      { name: "User Groups", href: "/users/UsrGrp" },
      { name: "User Roles", href: "/users/UsrRole" },
      { name: "Users", href: "/users/Users" },
      { name: "API Tokens", href: "/users/ApiToken" },
      { name: "Authentication", href: "/users/Authen" },
    ],
  },

  {
    name: "Administration",
    icon: Cog6ToothIcon,
    children: [
      {
        name: "General",
        href: "/administration/General",
        children: [
          { name: "GUI", href: "/administration/General/gui" },
          { name: "Autoregistration", href: "/administration/General/autoregistration" },
          { name: "Timeouts", href: "/administration/General/timeout" },
          { name: "Images", href: "/administration/General/images" },
          { name: "Icon Mapping", href: "/administration/General/iconmapping" },
          { name: "Regular Expression", href: "/administration/General/regularepression" },
          { name: "Trigger displaying", href: "/administration/General/regularepression" },
          { name: "Geographical maps", href: "/administration/General/geographical" },
          { name: "Modules", href: "/administration/General/modules" },
          { name: "Connectors", href: "/administration/General/connectors" },
          { name: "Other", href: "/administration/General/other" },
        ],
      },

      { name: "Audit Log", href: "/administration/Audit_log" },
      { name: "Housekeeping", href: "/administration/HouseKeeping" },
      { name: "Proxy Groups", href: "/administration/Proxy_Groups" },
      { name: "Proxies", href: "/administration/Proxies" },
      { name: "Macros", href: "/administration/Macros" },

      {
        name: "Queue",
        href: "/administration/Queue",
        children: [
          { name: "Queue Overview", href: "/administration/Queue/queueoverview" },
          { name: "Queue Overview By Proxy", href: "/administration/Queue/queueoverviewproxy" },
          { name: "Queue Details", href: "/administration/Queue/queuedetails" },
        ],
      },
    ],
  },
];

// ------------------------------------------------------
// RECURSIVE SIDEBAR ITEM COMPONENT
// ------------------------------------------------------
const SidebarItem = ({
  item,
  collapsed,
  pathname,
  openMenu,
  setOpenMenu,
  level = 0,
}: any) => {
  const Icon = item.icon;

  const active =
    pathname.startsWith(item.href || "") ||
    item.children?.some((child: any) =>
      pathname.startsWith(child.href)
    );

  const isOpen = openMenu === item.name;

  return (
    <div>
      {/* MAIN BUTTON */}
      <button
        onClick={() => !collapsed && item.children && setOpenMenu(isOpen ? null : item.name)}
        className={`flex items-center w-full transition rounded-md
          ${collapsed ? "justify-center py-2" : "justify-between px-3 py-2.5"}
          ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}
        `}
        style={{ paddingLeft: collapsed ? 0 : level * 18 + 10 }}
      >
        <div className={`flex items-center ${collapsed ? "" : "gap-4"}`}>
          {Icon && <Icon className="h-5 w-5" />}
          {!collapsed && <span className="text-[15px] font-medium">{item.name}</span>}
        </div>

        {!collapsed && item.children && (
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* CHILDREN */}
      {!collapsed && item.children && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 mt-2" : "max-h-0"
          }`}
        >
          {item.children.map((child: any) => (
            <SidebarItem
              key={child.name}
              item={child}
              collapsed={collapsed}
              pathname={pathname}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------
// MAIN SIDEBAR COMPONENT
// ------------------------------------------------------
export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div
      className="h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
      style={{ width: collapsed ? 78 : 260 }}
    >
      {/* LOGO */}
      <div
        className="flex items-center justify-center py-6 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Image
          src={collapsed ? "/techsec_log.png" : "/image.png"}
          alt="logo"
          width={collapsed ? 56 : 160}
          height={40}
          className="transition-all duration-300"
        />
      </div>

      {/* MENU LIST */}
      <nav className="space-y-2 px-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
        ))}
      </nav>
    </div>
  );
}
