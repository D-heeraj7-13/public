"use client";

import { useRef, useEffect, useState } from "react";

interface MapElement {
  selementid: string;
  elementtype: string;
  label?: string;
  x: string;
  y: string;
  iconid?: string;
}

interface MapLink {
  linkid: string;
  selementid1: string;
  selementid2: string;
  label?: string;
}

interface NetworkMapRendererProps {
  elements: MapElement[];
  links: MapLink[];
  mapWidth: number;
  mapHeight: number;
}

export default function NetworkMapRenderer({ 
  elements, 
  links, 
  mapWidth = 800, 
  mapHeight = 600 
}: NetworkMapRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const getElementColor = (type: string) => {
    switch (type) {
      case "0": return "#3b82f6"; // Host - Blue
      case "1": return "#10b981"; // Map - Green
      case "2": return "#f59e0b"; // Trigger - Orange
      case "3": return "#ef4444"; // Host Group - Red
      case "4": return "#8b5cf6"; // Image - Purple
      default: return "#6b7280"; // Gray
    }
  };

  const getElementLabel = (type: string) => {
    switch (type) {
      case "0": return "H"; // Host
      case "1": return "M"; // Map
      case "2": return "T"; // Trigger
      case "3": return "G"; // Host Group
      case "4": return "I"; // Image
      default: return "?";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw links (connections) first so they appear behind nodes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    links.forEach((link) => {
      const el1 = elements.find(e => e.selementid === link.selementid1);
      const el2 = elements.find(e => e.selementid === link.selementid2);

      if (el1 && el2) {
        const x1 = parseInt(el1.x) || 100;
        const y1 = parseInt(el1.y) || 100;
        const x2 = parseInt(el2.x) || 100;
        const y2 = parseInt(el2.y) || 100;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw link label if exists
        if (link.label) {
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(link.label, midX, midY - 5);
        }
      }
    });

    // Draw elements (nodes)
    const nodeRadius = 20;
    elements.forEach((element) => {
      const x = parseInt(element.x) || 100;
      const y = parseInt(element.y) || 100;
      const color = getElementColor(element.elementtype);
      const isHovered = hoveredElement === element.selementid;

      // Draw node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? nodeRadius + 5 : nodeRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = isHovered ? "#fff" : "#e2e8f0";
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#fff";
      ctx.font = isHovered ? "bold 12px sans-serif" : "10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(getElementLabel(element.elementtype), x, y);

      // Draw element name below node
      if (element.label) {
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(element.label, x, y + nodeRadius + 15);
      }
    });
  }, [elements, links, hoveredElement]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nodeRadius = 20;

    // Check if mouse is over any element
    let found = false;
    for (const element of elements) {
      const elX = parseInt(element.x) || 100;
      const elY = parseInt(element.y) || 100;
      const distance = Math.sqrt((x - elX) ** 2 + (y - elY) ** 2);

      if (distance < nodeRadius + 5) {
        setHoveredElement(element.selementid);
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredElement(null);
    }
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={Math.max(mapWidth, 600)}
        height={Math.max(mapHeight, 400)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredElement(null)}
        className="border border-slate-600 rounded-lg cursor-pointer bg-slate-900"
      />
      
      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Host (H)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Map (M)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Trigger (T)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Host Group (G)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Image (I)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
