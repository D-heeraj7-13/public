import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(req: Request) {
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        const zabbixUrl = process.env.NEXT_PUBLIC_ZABBIX_URL || process.env.ZABBIX_URL;
        let authToken =
            process.env.token ||
            process.env.ZABBIX_AUTH_TOKEN ||
            process.env.NEXT_PUBLIC_ZABBIX_AUTH_TOKEN || "";

        if (!authToken) {
            const headerToken = req.headers.get("x-auth-token") || req.headers.get("authorization") || "";
            if (headerToken) authToken = headerToken.replace(/^Bearer\s+/i, "");
        }

        let hostid: string | undefined;
        let itemKeys: string[] = [];

        try {
            const body = await req.json().catch(() => ({} as any));
            if (body && typeof body.token === "string") authToken = body.token;
            hostid = body.hostid;
            itemKeys = Array.isArray(body.itemKeys) ? body.itemKeys : [];
        } catch (e) {
            // ignore parse errors
        }

        if (!zabbixUrl) {
            return NextResponse.json({ error: "Missing Zabbix URL" }, { status: 500 });
        }
        if (!authToken) {
            return NextResponse.json({ error: "Missing Zabbix auth token" }, { status: 401 });
        }
        if (!hostid) {
            return NextResponse.json({ error: "Missing hostid" }, { status: 400 });
        }
        if (!itemKeys.length) {
            return NextResponse.json({ error: "Missing itemKeys" }, { status: 400 });
        }

        // Fetch matching items first
        const itemResponse = await axios.post(
            zabbixUrl,
            {
                jsonrpc: "2.0",
                method: "item.get",
                params: {
                    hostids: [hostid],
                    filter: { key_: itemKeys },
                    output: ["itemid", "name", "key_", "value_type"],
                },
                auth: authToken,
                id: 1,
            },
            { httpsAgent }
        );

        if (itemResponse?.data?.error) {
            return NextResponse.json(itemResponse.data, { status: 502 });
        }

        const items = itemResponse?.data?.result || [];
        if (!items.length) {
            return NextResponse.json({ result: { history: [] } });
        }

        const timeFrom = Math.floor(Date.now() / 1000) - 3600; // last 1 hour
        const historyResults = await Promise.all(
            items.map(async (item: any, idx: number) => {
                try {
                    // Determine history type based on value_type
                    // 0=float, 1=char, 2=log, 3=integer, 4=text
                    const valueTypeToHistoryType: Record<string, number> = {
                        "0": 0, // float -> numeric
                        "1": 1, // character
                        "2": 2, // log
                        "3": 0, // integer -> numeric
                        "4": 4, // text
                    };
                    const historyType = valueTypeToHistoryType[item.value_type] ?? 0;

                    const hRes = await axios.post(
                        zabbixUrl,
                        {
                            jsonrpc: "2.0",
                            method: "history.get",
                            params: {
                                output: "extend",
                                history: historyType,
                                itemids: [item.itemid],
                                time_from: timeFrom,
                                time_till: Math.floor(Date.now() / 1000),
                                sortfield: "clock",
                                sortorder: "ASC",
                                limit: 100,
                            },
                            auth: authToken,
                            id: 1,
                        },
                        { httpsAgent }
                    );

                    return {
                        key: item.key_,
                        name: item.name,
                        history: hRes?.data?.result || [],
                    };
                } catch (e) {
                    console.error(`History fetch failed for item ${item.key_}:`, e);
                    return {
                        key: item.key_,
                        name: item.name,
                        history: [],
                    };
                }
            })
        );

        return NextResponse.json({ result: { history: historyResults } });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
    }
}
