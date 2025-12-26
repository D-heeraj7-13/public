import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(req: Request) {
  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    // Resolve Zabbix URL
    const zabbixUrl =
      process.env.NEXT_PUBLIC_ZABBIX_URL ||
      process.env.ZABBIX_URL;

    // Try to resolve auth token from env, header, or request body
    let authToken =
      process.env.token ||
      process.env.ZABBIX_AUTH_TOKEN ||
      process.env.NEXT_PUBLIC_ZABBIX_AUTH_TOKEN || "";

    if (!authToken) {
      const headerToken = req.headers.get("x-auth-token") || req.headers.get("authorization") || "";
      if (headerToken) authToken = headerToken.replace(/^Bearer\s+/i, "");
    }

    if (!authToken) {
      try {
        const body = await req.json().catch(() => null);
        if (body && typeof body.token === "string") {
          authToken = body.token;
        }
      } catch (_) {
        // ignore body parse errors
      }
    }

    if (!zabbixUrl) {
      console.error("Missing Zabbix URL environment variable");
      return NextResponse.json({ error: "Missing Zabbix URL" }, { status: 500 });
    }

    if (!authToken) {
      console.error("Missing Zabbix auth token");
      return NextResponse.json({ error: "Missing Zabbix auth token" }, { status: 401 });
    }

    // First, get the host ID for PCPL_FIREWALL
    const hostResponse = await axios.post(
      zabbixUrl,
      {
        jsonrpc: "2.0",
        method: "host.get",
        params: {
          filter: {
            host: ["PCPL_FIREWALL"],
          },
          output: ["hostid", "host"],
        },
        auth: authToken,
        id: 1,
      },
      { httpsAgent }
    );

    if (hostResponse?.data?.error) {
      console.error("Zabbix API error (host.get):", hostResponse.data.error);
      return NextResponse.json(hostResponse.data, { status: 502 });
    }

    const hosts = hostResponse.data.result;
    if (!hosts || hosts.length === 0) {
      return NextResponse.json({ error: "Host PCPL_FIREWALL not found" }, { status: 404 });
    }

    const hostid = hosts[0].hostid;

    // Get CPU items for the host
    const itemResponse = await axios.post(
      zabbixUrl,
      {
        jsonrpc: "2.0",
        method: "item.get",
        params: {
          hostids: [hostid],
          search: {
            key_: "system.cpu",
          },
          output: ["itemid", "name", "key_", "value_type", "lastvalue", "lastclock"],
          sortfield: "name",
        },
        auth: authToken,
        id: 2,
      },
      { httpsAgent }
    );

    if (itemResponse?.data?.error) {
      console.error("Zabbix API error (item.get):", itemResponse.data.error);
      return NextResponse.json(itemResponse.data, { status: 502 });
    }

    const items = itemResponse.data.result;

    // Find the specific CPU utilization item
    const targetCPU = items.find((item: any) => item.key_ === "system.cpu.util[fgSysCpuUsage.0]");
    
    // Get history for the target CPU item or fallback to first 8 items
    const itemsToProcess = targetCPU ? [targetCPU] : items.slice(0, 8);

    // Get history for each item (last 24 hours)
    const historyPromises = itemsToProcess.map(async (item: any) => {
      const historyResponse = await axios.post(
        zabbixUrl,
        {
          jsonrpc: "2.0",
          method: "history.get",
          params: {
            itemids: [item.itemid],
            history: item.value_type,
            sortfield: "clock",
            sortorder: "ASC",
            limit: 50,
            time_from: Math.floor(Date.now() / 1000) - 3600, // Last hour
          },
          auth: authToken,
          id: 3,
        },
        { httpsAgent }
      );

      return {
        itemid: item.itemid,
        name: item.name,
        key: item.key_,
        history: historyResponse.data.result || [],
      };
    });

    const historyData = await Promise.all(historyPromises);

    return NextResponse.json({
      jsonrpc: "2.0",
      result: {
        items,
        history: historyData,
      },
      id: 1,
    });
  } catch (error) {
    console.error("Zabbix API Error:", error);
    return NextResponse.json({ error: "Failed to fetch CPU data" }, { status: 500 });
  }
}
