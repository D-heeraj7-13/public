
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Row,
  Col,
  Space,
  Checkbox,
  Table,
  message,
} from 'antd';
import axios from 'axios';
import type { FormProps } from 'antd';
import LatestDataTable from './aaj';

type SizeType = Parameters<typeof Form>[0]['size'];

type HostGroup = {
  groupid: string;
  name: string;
};

export default function LatestDataPage() {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('small');
  const [form] = Form.useForm();
  const [hostGroups, setHostGroups] = useState<HostGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [hosts, setHosts] = useState<any[]>([]);
  const [loadingHosts, setLoadingHosts] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const onFormLayoutChange: FormProps<any>['onValuesChange'] = ({ size }) => {
    setComponentSize(size);
  };

  // Fetch host groups on mount
  const handleGetHostGroups = async () => {
    setLoadingGroups(true);

    const payload = {
      jsonrpc: '2.0',
      method: 'hostgroup.get',
      params: {
        output: ['groupid', 'name'],
      },
      auth: '7de73a2634c45b95faaecb45d0429286005a442e974352f4431eaee833a66d00',
      id: 1,
    };

    try {
      const response = await axios.post('/api/zabbix-proxy', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const items = response?.data?.result ?? [];
      const normalized = Array.isArray(items)
        ? items.map((g: any) => ({ groupid: String(g.groupid), name: g.name }))
        : [];

      setHostGroups(normalized);
    } catch (err: any) {
      console.error('Hostgroup fetch error', err);
      if (err?.response) {
        console.error('Hostgroup fetch - response status:', err.response.status);
        console.error('Hostgroup fetch - response data:', err.response.data);
      }
      setHostGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Fetch hosts for selected group IDs
  const handleGetHosts = async (groupIds: string[]) => {
    if (!groupIds?.length) {
      setHosts([]);
      return;
    }

    setLoadingHosts(true);

    const payload = {
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'name'],
        groupids: groupIds,
      },
      auth: '7de73a2634c45b95faaecb45d0429286005a442e974352f4431eaee833a66d00',
      id: 2,
    };

    try {
      const res = await axios.post('/api/zabbix-proxy', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setHosts(res?.data?.result ?? []);
    } catch (err: any) {
      console.error('Host fetch error', err);
      setHosts([]);
    } finally {
      setLoadingHosts(false);
    }
  };

  // Auto-fetch host groups on mount
  useEffect(() => {
    handleGetHostGroups();
  }, []);

  // Auto-fetch hosts when selected group IDs change
  useEffect(() => {
    handleGetHosts(value);
  }, [value]);

  // Auto-fetch hosts when selected group IDs change
  useEffect(() => {
    handleGetHosts(value);
  }, [value]);

  // Fetch table data when Apply is pressed or on mount
  const handleApply = async () => {
    setLoadingTable(true);

    const params: any = {
      output: ['itemid', 'name', 'lastvalue', 'lastclock', 'delta', 'prevvalue', 'type'],
      selectHosts: ['hostid', 'name'],
      selectTags: ['tag', 'value'],
    };

    // When hosts are selected, limit to those; otherwise fetch all
    if (selectedHosts?.length) {
      params.hostids = selectedHosts;
    }

    const payload = {
      jsonrpc: '2.0',
      method: 'item.get',
      params,
      auth: '7de73a2634c45b95faaecb45d0429286005a442e974352f4431eaee833a66d00',
      id: 3,
    };

    try {
      const res = await axios.post('/api/zabbix-proxy', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const items = res?.data?.result ?? [];
      console.log('Apply result count:', Array.isArray(items) ? items.length : 'non-array', items);

      if (!Array.isArray(items) || items.length === 0) {
        message.info('No items returned for the current filter.');
      }

      const formatted = Array.isArray(items)
        ? items.map((item: any) => ({
            key: String(item.itemid ?? JSON.stringify(item)),
            host: item.hosts?.[0]?.name ?? item.hosts?.[0]?.hostid ?? 'Unknown',
            name: item.name ?? '',
            lastValue: item.lastvalue ?? '',
            lastCheck: item.lastclock ? new Date(Number(item.lastclock) * 1000).toLocaleString() : '-',
            change: item.delta ? String(item.delta) : '-',
            tags: Array.isArray(item.tags)
              ? item.tags.map((t: any) => `${t.tag}:${t.value}`).join(', ')
              : '-',
            info: '-',
          }))
        : [];

      setTableData(formatted);
    } catch (err: any) {
      console.error('Table fetch failed', err);
      if (err?.response) {
        console.error('item.get - response status:', err.response.status);
        console.error('item.get - response data:', err.response.data);
        message.error(`item.get failed: HTTP ${err.response.status}`);
      } else if (err?.request) {
        console.error('item.get - no response received');
        message.error('item.get failed: no response from server');
      } else {
        console.error('item.get - error:', err?.message);
        message.error('item.get failed: see console');
      }
      setTableData([]);
    } finally {
      setLoadingTable(false);
    }
  };

  // Load all items on initial mount
  useEffect(() => {
    handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MAX_COUNT = 3;
  const suffix = <span style={{ color: '#8c8c8c' }}>▾</span>;

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ size: 'small' }}
        onValuesChange={onFormLayoutChange}
        size="small"
        style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}
      >
        <Row gutter={16}>
          {/* Left Column */}
          <Col span={8}>
            <Form.Item label="Host groups" style={{ marginBottom: 12 }}>
              <Select
                mode="multiple"
                maxCount={MAX_COUNT}
                value={value}
                loading={loadingGroups}
                style={{ width: '100%' }}
                onChange={setValue}
                suffixIcon={suffix}
                placeholder="Please select"
                size="small"
                options={hostGroups.map(g => ({ value: g.groupid, label: g.name }))}
              />
            </Form.Item>

            <Form.Item label="Hosts" style={{ marginBottom: 12 }}>
              <Select
                mode="multiple"
                maxCount={MAX_COUNT}
                value={selectedHosts}
                loading={loadingHosts}
                style={{ width: '100%' }}
                onChange={setSelectedHosts}
                suffixIcon={suffix}
                placeholder="Please select"
                size="small"
                options={hosts.map(h => ({ value: h.hostid, label: h.name }))}
              />
            </Form.Item>

            <Form.Item label="Name" style={{ marginBottom: 12 }}>
              <Input />
            </Form.Item>

            <Form.Item label="State" style={{ marginBottom: 12 }}>
              <Radio.Group defaultValue="all" buttonStyle="solid" size="small">
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="normal">Normal</Radio.Button>
                <Radio.Button value="not_supported">Not supported</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox>Show details</Checkbox>
            </Form.Item>
          </Col>

          {/* Middle Column */}
          <Col span={8}>
            <Form.Item label="Show tags" style={{ marginBottom: 12 }}>
              <Radio.Group defaultValue="3" buttonStyle="solid" size="small">
                <Radio.Button value="none">None</Radio.Button>
                <Radio.Button value="1">1</Radio.Button>
                <Radio.Button value="2">2</Radio.Button>
                <Radio.Button value="3">3</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Tag name" style={{ marginBottom: 12 }}>
              <Radio.Group defaultValue="full" buttonStyle="solid" size="small">
                <Radio.Button value="full">Full</Radio.Button>
                <Radio.Button value="short">Short</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Tag display priority" style={{ marginBottom: 12 }}>
              <Input placeholder="comma-separated list" />
            </Form.Item>
          </Col>

          {/* Right Column */}
          <Col span={8}>
            <Form.Item label="Tags" style={{ marginBottom: 12 }}>
              <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                <Row gutter={8} align="middle">
                  <Col>
                    <Radio.Group size="small" defaultValue="and">
                      <Radio.Button value="and">And/Or</Radio.Button>
                      <Radio.Button value="or">Or</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col flex="1">
                    <Input placeholder="tag" size="small" />
                  </Col>
                </Row>
                <Row gutter={8} align="middle">
                  <Col span={12}>
                    <Select defaultValue="Contains" style={{ width: '100%' }} size="small">
                      <Select.Option value="contains">Contains</Select.Option>
                      <Select.Option value="equals">Equals</Select.Option>
                      <Select.Option value="exists">Exists</Select.Option>
                      <Select.Option value="not_contains">Does not contain</Select.Option>
                      <Select.Option value="not_exists">Does not exist</Select.Option>
                      <Select.Option value="not_equals">Does not equal</Select.Option>
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Input placeholder="value" size="small" />
                  </Col>
                </Row>
                <div>
                  <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto' }}>+ Add</Button>
                  <Button type="link" size="small" style={{ padding: '0 4px', height: 'auto', marginLeft: 8 }}>Remove</Button>
                </div>
              </Space>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: 16 }} gutter={12}>
          <Col>
            <Button size="middle">Save as</Button>
          </Col>
          <Col>
            <Button
              type="primary"
              size="middle"
              className="apply-bolt"
              htmlType="button"
              onClick={handleApply}
              loading={loadingTable}
            >
              Apply
            </Button>
          </Col>

          <Col>
            <Button size="middle">Reset</Button>
          </Col>
        </Row>
      </Form>

      {/* Render the table with filtered results when Apply is pressed */}
      <div style={{ marginTop: 24 }}>
        <LatestDataTable data={tableData} loading={loadingTable} />
      </div>
    </div>
  );
}


