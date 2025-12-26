import axios from "axios";

const AUTH_TOKEN = "7de73a2634c45b95faaecb45d0429286005a442e974352f4431eaee833a66d00";

export const zabbix = axios.create({
  baseURL: "/api/zabbix-proxy",
  headers: { "Content-Type": "application/json" },
});

export const getHostGroups = () =>
  zabbix.post("", {
    jsonrpc: "2.0",
    method: "hostgroup.get",
    params: { output: ["groupid", "name"] },
    auth: AUTH_TOKEN,
    id: 1,
  });

export const getHosts = (groupids: string[]) =>
  zabbix.post("", {
    jsonrpc: "2.0",
    method: "host.get",
    params: { output: ["hostid", "name"], groupids },
    auth: AUTH_TOKEN,
    id: 2,
  });

export const getItems = (hostid: string) =>
  zabbix.post("", {
    jsonrpc: "2.0",
    method: "item.get",
    params: { output: ["name", "key_"], hostids: [hostid] },
    auth: AUTH_TOKEN,
    id: 3,
  });
