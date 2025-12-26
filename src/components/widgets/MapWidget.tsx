"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import NetworkMapRenderer from "./NetworkMapRenderer";

interface MapWidgetProps {
  hostGroupIds?: string[];
}

interface MapElement {
  selementid: string;
  elementtype: string;
  label?: string;
  x: string;
  y: string;
}

interface MapLink {
  linkid: string;
  selementid1: string;
  selementid2: string;
  label?: string;
}

interface MapData {
  sysmapid?: string;
  mapid?: string;
  name: string;
  width: string;
  height: string;
  selements?: MapElement[];
  links?: MapLink[];
}

export default function MapWidget({ hostGroupIds }: MapWidgetProps) {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/zabbix/maps", { method: "POST" })
      .then(r => r.json())
      .then(j => {
        const mapList = Array.isArray(j?.result) ? j.result : [];
        setMaps(mapList);
        if (mapList.length > 0) {
          setSelectedMap(mapList[0]);
        }
      })
      .catch(err => {
        console.error("Failed to load maps", err);
        setMaps([]);
      })
      .finally(() => setLoading(false));
  }, [hostGroupIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!maps.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        No maps found in Zabbix
      </div>
    );
  }

  if (!selectedMap) {
    return (
      <div className="text-center text-gray-400 py-8">
        No map selected
      </div>
    );
  }

  const elements = (selectedMap.selements || []) as MapElement[];
  const links = (selectedMap.links || []) as MapLink[];

  if (elements.length === 0) {
    return (
      <div className="space-y-4">
        {maps.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {maps.map(m => (
              <button
                key={m.sysmapid || m.mapid}
                onClick={() => setSelectedMap(m)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                  (selectedMap?.sysmapid || selectedMap?.mapid) === (m.sysmapid || m.mapid)
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-100">{selectedMap.name}</h3>
          <div className="text-center text-gray-400 py-12">
            No elements in this map
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {maps.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {maps.map(m => (
            <button
              key={m.sysmapid || m.mapid}
              onClick={() => setSelectedMap(m)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                (selectedMap?.sysmapid || selectedMap?.mapid) === (m.sysmapid || m.mapid)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">{selectedMap.name}</h3>
        <div className="text-sm text-slate-400 mb-2">
          {elements.length} element{elements.length > 1 ? "s" : ""} • {links.length} connection{links.length > 1 ? "s" : ""}
        </div>

        <NetworkMapRenderer 
          elements={elements}
          links={links}
          mapWidth={parseInt(selectedMap.width) || 800}
          mapHeight={parseInt(selectedMap.height) || 600}
        />
      </div>
    </div>
  );
}
