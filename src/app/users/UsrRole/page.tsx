'use client';

import { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Button, 
  Typography, 
  Space,
  Divider,
  Row,
  Col
} from 'antd';

const { Title, Text } = Typography;

export default function UserRolesPage() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: '',
    userType: 'User',
    defaultAccessNewUI: false,
    // Dashboards
    dashboards: false,
    // Monitoring
    monitoring: false,
    problems: false,
    hosts: false,
    latestData: false,
    maps: false,
    discovery: false,
    // Services
    services: false,
    servicesServices: false,
    sla: false,
    slaReport: false,
    // Inventory
    inventory: false,
    overview: false,
    inventoryHosts: false,
    // Reports
    reports: false,
    systemInformation: false,
    scheduledReports: false,
    availabilityReport: false,
    top100Triggers: false,
    auditLog: false,
    actionLog: false,
    notifications: false,
    // Data collection
    dataCollection: false,
    templateGroups: false,
    hostGroups: false,
    templates: false,
    dataCollectionHosts: false,
    maintenance: false,
    eventCorrelation: false,
    dataCollectionDiscovery: false,
    // Alerts
    alerts: false,
    triggerActions: false,
    serviceActions: false,
    discoveryActions: false,
    autoregistrationActions: false,
    internalActions: false,
    mediaTypes: false,
    scripts: false,
    // Users
    users: false,
    userGroups: false,
    userRoles: false,
    usersUsers: false,
    apiTokens: false,
    authentication: false,
    // Administration
    administration: false,
    general: false,
    administrationAuditLog: false,
    housekeeping: false,
    proxyGroups: false,
    proxies: false,
    macros: false,
    queue: false,
    // Access to services
    readWriteAccessServices: 'None',
    readOnlyAccessServices: 'None',
    // Access to API
    apiEnabled: false,
    apiMethods: 'Allow list',
    // Access to actions
    createEditDashboards: false,
    createEditMaps: false,
    createEditMaintenance: false,
    addProblemComments: false,
    changeSeverity: false,
    acknowledgeProblems: false,
    suppressProblems: false,
    closeProblems: false,
    executeScripts: false,
    manageAPITokens: false,
    manageScheduledReports: false,
    manageSLA: false,
    invokeExecuteNow: false,
    changeProblemRanking: false,
    defaultAccessNewActions: false,
  });

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <div className="p-6 max-w-6xl" style={{ color: '#000' }}>
      <Title level={2} style={{ color: '#000', fontWeight: 'normal', marginBottom: 24 }}>
        User roles
      </Title>
      
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleSubmit}
        initialValues={formData}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      >
        {/* Name and User Type */}
        <Form.Item
          label={<span style={{ color: '#000' }}><span style={{ color: 'red' }}> </span>Name</span>}
          name="name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input style={{ maxWidth: 400, color: '#000' }} />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#000' }}>User type</span>}
          name="userType"
        >
          <Select style={{ width: 200, color: '#000' }}>
            <Select.Option value="User">User</Select.Option>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Super admin">Super admin</Select.Option>
          </Select>
        </Form.Item>

        <Divider />

        {/* Access to UI elements */}
        <Title level={4} style={{ color: '#000', fontWeight: 'normal', marginBottom: 16 }}>
          Access to UI elements
        </Title>

        {/* Dashboards */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Dashboards</span>}
          name="dashboards"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>

        {/* Monitoring */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Monitoring</span>}
          name="monitoring"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="problems" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Problems</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="latestData" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Latest data</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discovery" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Discovery</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hosts" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Hosts</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maps" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Maps</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Services */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Services</span>}
          name="services"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="servicesServices" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Services</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sla" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>SLA</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="slaReport" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>SLA report</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Inventory */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Inventory</span>}
          name="inventory"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="overview" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Overview</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="inventoryHosts" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Hosts</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Reports */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Reports</span>}
          name="reports"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="systemInformation" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>System information</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="top100Triggers" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Top 100 triggers</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="notifications" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Notifications</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="scheduledReports" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Scheduled reports</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="auditLog" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Audit log</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="availabilityReport" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Availability report</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="actionLog" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Action log</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Data collection */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Data collection</span>}
          name="dataCollection"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="templateGroups" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Template groups</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dataCollectionHosts" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Hosts</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="eventCorrelation" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Event correlation</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hostGroups" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Host groups</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maintenance" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Maintenance</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dataCollectionDiscovery" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Discovery</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="templates" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Templates</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Alerts */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Alerts</span>}
          name="alerts"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="triggerActions" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Trigger actions</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="autoregistrationActions" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Autoregistration actions</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="scripts" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Scripts</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="serviceActions" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Service actions</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="internalActions" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Internal actions</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discoveryActions" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Discovery actions</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mediaTypes" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Media types</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Users */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Users</span>}
          name="users"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="userGroups" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>User groups</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usersUsers" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Users</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="authentication" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Authentication</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userRoles" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>User roles</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="apiTokens" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>API tokens</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Administration */}
        <Form.Item
          label={<span style={{ color: '#000' }}>Administration</span>}
          name="administration"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="general" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>General</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="proxies" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Proxies</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="administrationAuditLog" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Audit log</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="macros" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Macros</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="housekeeping" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Housekeeping</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="queue" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Queue</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="proxyGroups" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#000' }}>Proxy groups</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Text type="danger" style={{ color: 'red' }}>* At least one UI element must be checked.</Text>
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#000' }}>Default access to new UI elements</span>}
          name="defaultAccessNewUI"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>

        <Divider />

        {/* Access to services */}
        <Title level={4} style={{ color: '#000', fontWeight: 'normal', marginBottom: 16 }}>
          Access to services
        </Title>
        
        <Form.Item
          label={<span style={{ color: '#000' }}>Read-write access to services</span>}
          name="readWriteAccessServices"
        >
          <Radio.Group>
            <Radio value="None" style={{ color: '#000' }}>None</Radio>
            <Radio value="All" style={{ color: '#000' }}>All</Radio>
            <Radio value="Service list" style={{ color: '#000' }}>Service list</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#000' }}>Read-only access to services</span>}
          name="readOnlyAccessServices"
        >
          <Radio.Group>
            <Radio value="None" style={{ color: '#000' }}>None</Radio>
            <Radio value="All" style={{ color: '#000' }}>All</Radio>
            <Radio value="Service list" style={{ color: '#000' }}>Service list</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider />

        {/* Access to modules */}
        <Title level={4} style={{ color: '#000', fontWeight: 'normal', marginBottom: 16 }}>
          Access to modules
        </Title>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 16px', fontSize: '14px', color: '#000' }}>
            <div>Action log</div>
            <div>Clock</div>
            <div>Data overview</div>
            <div>Discovery status</div>
            <div>Favorite graphs</div>
            <div>Favorite maps</div>
            <div>Gauge</div>
            <div>Geomap</div>
            <div>Graph</div>
            <div>Graph (classic)</div>
            <div>Graph prototype</div>
            <div>Honeycomb</div>
            <div>Host availability</div>
            <div>Host navigator</div>
            <div>Insights Dashboard</div>
            <div>Item history</div>
            <div>Item navigator</div>
            <div>Item value</div>
            <div>Map</div>
            <div>Map navigation tree</div>
            <div>Pie chart</div>
            <div>Problem hosts</div>
            <div>Problems</div>
            <div>Problems by severity</div>
            <div>SLA report</div>
            <div>System information</div>
            <div>Top hosts</div>
            <div>Top triggers</div>
            <div>Trigger overview</div>
            <div>URL</div>
            <div>Web monitoring</div>
            <div>Ziggy</div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Checkbox style={{ color: '#000' }}>Default access to new modules</Checkbox>
          </div>
        </Form.Item>

        <Divider />

        {/* Access to API */}
        <Title level={4} style={{ color: '#000', fontWeight: 'normal', marginBottom: 16 }}>
          Access to API
        </Title>
        
        <Form.Item
          label={<span style={{ color: '#000' }}>Enabled</span>}
          name="apiEnabled"
          valuePropName="checked"
        >
          <Checkbox style={{ color: '#000' }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#000' }}>API methods</span>}
          name="apiMethods"
        >
          <Radio.Group>
            <Radio value="Allow list" style={{ color: '#000' }}>Allow list</Radio>
            <Radio value="Deny list" style={{ color: '#000' }}>Deny list</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Input placeholder="type here to search" style={{ marginBottom: 8, maxWidth: 400, color: '#000' }} />
          <Select
            mode="multiple"
            placeholder="Select"
            style={{ width: '100%', maxWidth: 400, color: '#000' }}
            options={[]}
          />
        </Form.Item>

        <Divider />

        {/* Access to actions */}
        <Title level={4} style={{ color: '#000', fontWeight: 'normal', marginBottom: 16 }}>
          Access to actions
        </Title>
        
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Space direction="vertical">
            <Form.Item name="createEditDashboards" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Create and edit dashboards</Checkbox>
            </Form.Item>
            <Form.Item name="createEditMaps" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Create and edit maps</Checkbox>
            </Form.Item>
            <Form.Item name="createEditMaintenance" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Create and edit maintenance</Checkbox>
            </Form.Item>
            <Form.Item name="addProblemComments" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Add problem comments</Checkbox>
            </Form.Item>
            <Form.Item name="changeSeverity" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Change severity</Checkbox>
            </Form.Item>
            <Form.Item name="acknowledgeProblems" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Acknowledge problems</Checkbox>
            </Form.Item>
            <Form.Item name="suppressProblems" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Suppress problems</Checkbox>
            </Form.Item>
            <Form.Item name="closeProblems" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Close problems</Checkbox>
            </Form.Item>
            <Form.Item name="executeScripts" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Execute scripts</Checkbox>
            </Form.Item>
            <Form.Item name="manageAPITokens" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Manage API tokens</Checkbox>
            </Form.Item>
            <Form.Item name="manageScheduledReports" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Manage scheduled reports</Checkbox>
            </Form.Item>
            <Form.Item name="manageSLA" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Manage SLA</Checkbox>
            </Form.Item>
            <Form.Item name="invokeExecuteNow" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Invoke "Execute now" on read-only hosts</Checkbox>
            </Form.Item>
            <Form.Item name="changeProblemRanking" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Change problem ranking</Checkbox>
            </Form.Item>
            <Form.Item name="defaultAccessNewActions" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#000' }}>Default access to new actions</Checkbox>
            </Form.Item>
          </Space>
        </Form.Item>

        <Divider />

        {/* Form buttons */}
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
            <Button onClick={() => window.history.back()}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}



// 'use client';

// import { useState } from 'react';

// export default function UserRolesPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     userType: 'User',
//     defaultAccessNewUI: false,
//     // Dashboards
//     dashboards: false,
//     // Monitoring
//     monitoring: false,
//     problems: false,
//     hosts: false,
//     latestData: false,
//     maps: false,
//     discovery: false,
//     // Services
//     services: false,
//     servicesServices: false,
//     sla: false,
//     slaReport: false,
//     // Inventory
//     inventory: false,
//     overview: false,
//     inventoryHosts: false,
//     // Reports
//     reports: false,
//     systemInformation: false,
//     scheduledReports: false,
//     availabilityReport: false,
//     top100Triggers: false,
//     auditLog: false,
//     actionLog: false,
//     notifications: false,
//     // Data collection
//     dataCollection: false,
//     templateGroups: false,
//     hostGroups: false,
//     templates: false,
//     dataCollectionHosts: false,
//     maintenance: false,
//     eventCorrelation: false,
//     dataCollectionDiscovery: false,
//     // Alerts
//     alerts: false,
//     triggerActions: false,
//     serviceActions: false,
//     discoveryActions: false,
//     autoregistrationActions: false,
//     internalActions: false,
//     mediaTypes: false,
//     scripts: false,
//     // Users
//     users: false,
//     userGroups: false,
//     userRoles: false,
//     usersUsers: false,
//     apiTokens: false,
//     authentication: false,
//     // Administration
//     administration: false,
//     general: false,
//     administrationAuditLog: false,
//     housekeeping: false,
//     proxyGroups: false,
//     proxies: false,
//     macros: false,
//     queue: false,
//     // Access to services
//     readWriteAccessServices: 'None',
//     readOnlyAccessServices: 'None',
//     // Access to API
//     apiEnabled: false,
//     apiMethods: 'Allow list',
//     // Access to actions
//     createEditDashboards: false,
//     createEditMaps: false,
//     createEditMaintenance: false,
//     addProblemComments: false,
//     changeSeverity: false,
//     acknowledgeProblems: false,
//     suppressProblems: false,
//     closeProblems: false,
//     executeScripts: false,
//     manageAPITokens: false,
//     manageScheduledReports: false,
//     manageSLA: false,
//     invokeExecuteNow: false,
//     changeProblemRanking: false,
//     defaultAccessNewActions: false,
//   });

//   const handleCheckboxChange = (field: string) => {
//     setFormData(prev => ({ ...prev, [field as keyof typeof prev]: !prev[field as keyof typeof prev] }));
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//     // Add your submit logic here
//   };

//   return (
//     <div className="p-6 max-w-6xl">
//       <h1 className="text-3xl font-bold mb-6 text-black">User roles</h1>
      
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
//         {/* Name and User Type */}
//         <div className="mb-6 space-y-4">
//           <div className="flex items-center gap-4">
//             <label className="w-48 text-right font-bold text-black">
//               <span className="text-red-500">* </span>Name
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => handleInputChange('name', e.target.value)}
//               className="flex-1 max-w-md border border-blue-500 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//               required
//             />
//           </div>
          
//           <div className="flex items-center gap-4">
//             <label className="w-48 text-right font-bold text-black">User type</label>
//             <select
//               value={formData.userType}
//               onChange={(e) => handleInputChange('userType', e.target.value)}
//               className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//             >
//               <option>User</option>
//               <option>Admin</option>
//               <option>Super admin</option>
//             </select>
//           </div>
//         </div>

//         {/* Access to UI elements */}
//         <div className="mb-6">
//           <h3 className="font-bold text-black mb-4">Access to UI elements</h3>
          
//           <div className="space-y-3 ml-48">
//             {/* Dashboards */}
//             <div className="flex items-center">
//               <label className="w-40 text-right mr-4 font-bold text-black">Dashboards</label>
//               <input
//                 type="checkbox"
//                 checked={formData.dashboards}
//                 onChange={() => handleCheckboxChange('dashboards')}
//                 className="w-4 h-4 text-black"
//               />
//             </div>

//             {/* Monitoring */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Monitoring</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.monitoring}
//                   onChange={() => handleCheckboxChange('monitoring')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.problems}
//                     onChange={() => handleCheckboxChange('problems')}
//                     className="w-4 h-4"
//                   />
//                   Problems
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.latestData}
//                     onChange={() => handleCheckboxChange('latestData')}
//                     className="w-4 h-4"
//                   />
//                   Latest data
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.discovery}
//                     onChange={() => handleCheckboxChange('discovery')}
//                     className="w-4 h-4"
//                   />
//                   Discovery
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.hosts}
//                     onChange={() => handleCheckboxChange('hosts')}
//                     className="w-4 h-4"
//                   />
//                   Hosts
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.maps}
//                     onChange={() => handleCheckboxChange('maps')}
//                     className="w-4 h-4"
//                   />
//                   Maps
//                 </label>
//               </div>
//             </div>

//             {/* Services */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Services</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.services}
//                   onChange={() => handleCheckboxChange('services')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.servicesServices}
//                     onChange={() => handleCheckboxChange('servicesServices')}
//                     className="w-4 h-4"
//                   />
//                   Services
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.sla}
//                     onChange={() => handleCheckboxChange('sla')}
//                     className="w-4 h-4"
//                   />
//                   SLA
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.slaReport}
//                     onChange={() => handleCheckboxChange('slaReport')}
//                     className="w-4 h-4"
//                   />
//                   SLA report
//                 </label>
//               </div>
//             </div>

//             {/* Inventory */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Inventory</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.inventory}
//                   onChange={() => handleCheckboxChange('inventory')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.overview}
//                     onChange={() => handleCheckboxChange('overview')}
//                     className="w-4 h-4"
//                   />
//                   Overview
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.inventoryHosts}
//                     onChange={() => handleCheckboxChange('inventoryHosts')}
//                     className="w-4 h-4"
//                   />
//                   Hosts
//                 </label>
//               </div>
//             </div>

//             {/* Reports */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Reports</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.reports}
//                   onChange={() => handleCheckboxChange('reports')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.systemInformation}
//                     onChange={() => handleCheckboxChange('systemInformation')}
//                     className="w-4 h-4"
//                   />
//                   System information
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.top100Triggers}
//                     onChange={() => handleCheckboxChange('top100Triggers')}
//                     className="w-4 h-4"
//                   />
//                   Top 100 triggers
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.notifications}
//                     onChange={() => handleCheckboxChange('notifications')}
//                     className="w-4 h-4"
//                   />
//                   Notifications
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.scheduledReports}
//                     onChange={() => handleCheckboxChange('scheduledReports')}
//                     className="w-4 h-4"
//                   />
//                   Scheduled reports
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.auditLog}
//                     onChange={() => handleCheckboxChange('auditLog')}
//                     className="w-4 h-4"
//                   />
//                   Audit log
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.availabilityReport}
//                     onChange={() => handleCheckboxChange('availabilityReport')}
//                     className="w-4 h-4"
//                   />
//                   Availability report
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.actionLog}
//                     onChange={() => handleCheckboxChange('actionLog')}
//                     className="w-4 h-4"
//                   />
//                   Action log
//                 </label>
//               </div>
//             </div>

//             {/* Data collection */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Data collection</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.dataCollection}
//                   onChange={() => handleCheckboxChange('dataCollection')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.templateGroups}
//                     onChange={() => handleCheckboxChange('templateGroups')}
//                     className="w-4 h-4"
//                   />
//                   Template groups
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.dataCollectionHosts}
//                     onChange={() => handleCheckboxChange('dataCollectionHosts')}
//                     className="w-4 h-4"
//                   />
//                   Hosts
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.eventCorrelation}
//                     onChange={() => handleCheckboxChange('eventCorrelation')}
//                     className="w-4 h-4"
//                   />
//                   Event correlation
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.hostGroups}
//                     onChange={() => handleCheckboxChange('hostGroups')}
//                     className="w-4 h-4"
//                   />
//                   Host groups
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.maintenance}
//                     onChange={() => handleCheckboxChange('maintenance')}
//                     className="w-4 h-4"
//                   />
//                   Maintenance
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.dataCollectionDiscovery}
//                     onChange={() => handleCheckboxChange('dataCollectionDiscovery')}
//                     className="w-4 h-4"
//                   />
//                   Discovery
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.templates}
//                     onChange={() => handleCheckboxChange('templates')}
//                     className="w-4 h-4"
//                   />
//                   Templates
//                 </label>
//               </div>
//             </div>

//             {/* Alerts */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Alerts</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.alerts}
//                   onChange={() => handleCheckboxChange('alerts')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.triggerActions}
//                     onChange={() => handleCheckboxChange('triggerActions')}
//                     className="w-4 h-4"
//                   />
//                   Trigger actions
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.autoregistrationActions}
//                     onChange={() => handleCheckboxChange('autoregistrationActions')}
//                     className="w-4 h-4"
//                   />
//                   Autoregistration actions
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.scripts}
//                     onChange={() => handleCheckboxChange('scripts')}
//                     className="w-4 h-4"
//                   />
//                   Scripts
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.serviceActions}
//                     onChange={() => handleCheckboxChange('serviceActions')}
//                     className="w-4 h-4"
//                   />
//                   Service actions
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.internalActions}
//                     onChange={() => handleCheckboxChange('internalActions')}
//                     className="w-4 h-4"
//                   />
//                   Internal actions
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.discoveryActions}
//                     onChange={() => handleCheckboxChange('discoveryActions')}
//                     className="w-4 h-4"
//                   />
//                   Discovery actions
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.mediaTypes}
//                     onChange={() => handleCheckboxChange('mediaTypes')}
//                     className="w-4 h-4"
//                   />
//                   Media types
//                 </label>
//               </div>
//             </div>

//             {/* Users */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Users</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.users}
//                   onChange={() => handleCheckboxChange('users')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.userGroups}
//                     onChange={() => handleCheckboxChange('userGroups')}
//                     className="w-4 h-4"
//                   />
//                   User groups
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.usersUsers}
//                     onChange={() => handleCheckboxChange('usersUsers')}
//                     className="w-4 h-4"
//                   />
//                   Users
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.authentication}
//                     onChange={() => handleCheckboxChange('authentication')}
//                     className="w-4 h-4"
//                   />
//                   Authentication
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.userRoles}
//                     onChange={() => handleCheckboxChange('userRoles')}
//                     className="w-4 h-4"
//                   />
//                   User roles
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.apiTokens}
//                     onChange={() => handleCheckboxChange('apiTokens')}
//                     className="w-4 h-4"
//                   />
//                   API tokens
//                 </label>
//               </div>
//             </div>

//             {/* Administration */}
//             <div>
//               <div className="flex items-center mb-2">
//                 <label className="w-40 text-right mr-4 font-bold text-black">Administration</label>
//                 <input
//                   type="checkbox"
//                   checked={formData.administration}
//                   onChange={() => handleCheckboxChange('administration')}
//                   className="w-4 h-4"
//                 />
//               </div>
//               <div className="ml-44 space-y-2 grid grid-cols-3 gap-2">
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.general}
//                     onChange={() => handleCheckboxChange('general')}
//                     className="w-4 h-4"
//                   />
//                   General
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.proxies}
//                     onChange={() => handleCheckboxChange('proxies')}
//                     className="w-4 h-4"
//                   />
//                   Proxies
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.administrationAuditLog}
//                     onChange={() => handleCheckboxChange('administrationAuditLog')}
//                     className="w-4 h-4"
//                   />
//                   Audit log
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.macros}
//                     onChange={() => handleCheckboxChange('macros')}
//                     className="w-4 h-4"
//                   />
//                   Macros
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.housekeeping}
//                     onChange={() => handleCheckboxChange('housekeeping')}
//                     className="w-4 h-4"
//                   />
//                   Housekeeping
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.queue}
//                     onChange={() => handleCheckboxChange('queue')}
//                     className="w-4 h-4"
//                   />
//                   Queue
//                 </label>
//                 <label className="flex items-center gap-2 font-bold text-black">
//                   <input
//                     type="checkbox"
//                     checked={formData.proxyGroups}
//                     onChange={() => handleCheckboxChange('proxyGroups')}
//                     className="w-4 h-4"
//                   />
//                   Proxy groups
//                 </label>
//               </div>
//             </div>

//             <div className="ml-44 mt-4">
//               <p className="text-sm text-red-600 font-bold">* At least one UI element must be checked.</p>
//             </div>

//             <div className="flex items-center ml-0">
//               <label className="w-40 text-right mr-4 font-bold text-black">Default access to new UI elements</label>
//               <input
//                 type="checkbox"
//                 checked={formData.defaultAccessNewUI}
//                 onChange={() => handleCheckboxChange('defaultAccessNewUI')}
//                 className="w-4 h-4"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Access to services */}
//         <div className="mb-6 border-t pt-6">
//           <h3 className="font-bold text-black mb-4">Access to services</h3>
          
//           <div className="ml-48 space-y-3">
//             <div className="flex items-center gap-4">
//               <label className="w-48 font-bold text-black">Read-write access to services</label>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readWriteAccessServices === 'None' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readWriteAccessServices', 'None')}
//                 >
//                   None
//                 </button>
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readWriteAccessServices === 'All' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readWriteAccessServices', 'All')}
//                 >
//                   All
//                 </button>
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readWriteAccessServices === 'Service list' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readWriteAccessServices', 'Service list')}
//                 >
//                   Service list
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-48 font-bold text-black">Read-only access to services</label>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readOnlyAccessServices === 'None' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readOnlyAccessServices', 'None')}
//                 >
//                   None
//                 </button>
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readOnlyAccessServices === 'All' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readOnlyAccessServices', 'All')}
//                 >
//                   All
//                 </button>
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.readOnlyAccessServices === 'Service list' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('readOnlyAccessServices', 'Service list')}
//                 >
//                   Service list
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Access to modules */}
//         <div className="mb-6 border-t pt-6">
//           <h3 className="font-bold text-black mb-4">Access to modules</h3>
//           <div className="ml-48">
//             <div className="grid grid-cols-4 gap-2 text-sm font-bold text-black">
//               <div>Action log</div>
//               <div>Clock</div>
//               <div>Data overview</div>
//               <div>Discovery status</div>
//               <div>Favorite graphs</div>
//               <div>Favorite maps</div>
//               <div>Gauge</div>
//               <div>Geomap</div>
//               <div>Graph</div>
//               <div>Graph (classic)</div>
//               <div>Graph prototype</div>
//               <div>Honeycomb</div>
//               <div>Host availability</div>
//               <div>Host navigator</div>
//               <div>Insights Dashboard</div>
//               <div>Item history</div>
//               <div>Item navigator</div>
//               <div>Item value</div>
//               <div>Map</div>
//               <div>Map navigation tree</div>
//               <div>Pie chart</div>
//               <div>Problem hosts</div>
//               <div>Problems</div>
//               <div>Problems by severity</div>
//               <div>SLA report</div>
//               <div>System information</div>
//               <div>Top hosts</div>
//               <div>Top triggers</div>
//               <div>Trigger overview</div>
//               <div>URL</div>
//               <div>Web monitoring</div>
//               <div>Ziggy</div>
//             </div>
//             <div className="mt-4">
//               <label className="flex items-center gap-2 font-bold text-black">
//                 <input type="checkbox" className="w-4 h-4" />
//                 Default access to new modules
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Access to API */}
//         <div className="mb-6 border-t pt-6">
//           <h3 className="font-bold text-black mb-4">Access to API</h3>
//           <div className="ml-48">
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.apiEnabled}
//                 onChange={() => handleCheckboxChange('apiEnabled')}
//                 className="w-4 h-4"
//               />
//               Enabled
//             </label>
//             <div className="mt-4">
//               <div className="mb-2 font-bold text-black">API methods</div>
//               <div className="flex gap-2 mb-2">
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.apiMethods === 'Allow list' ? 'text-black' : 'bg-gray-300'}`}
//                   onClick={() => handleInputChange('apiMethods', 'Allow list')}
//                 >
//                   Allow list
//                 </button>
//                 <button
//                   type="button"
//                   className={`px-4 py-1 rounded font-bold text-black ${formData.apiMethods === 'Deny list' ? 'bg-gray-300' : 'bg-gray-100'}`}
//                   onClick={() => handleInputChange('apiMethods', 'Deny list')}
//                 >
//                   Deny list
//                 </button>
//               </div>
//               <input
//                 type="text"
//                 placeholder="type here to search"
//                 className="border border-black-300 text-black rounded px-3 py-1 w-full max-w-md mb-2"
//               />
//               <select className="border border-black-300 rounded text-blue px-3 py-1 w-full max-w-md" size={5}>
//                 <option>Select</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Access to actions */}
//         <div className="mb-6 border-t pt-6">
//           <h3 className="font-bold text-black mb-4">Access to actions</h3>
//           <div className="ml-48 space-y-2">
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.createEditDashboards}
//                 onChange={() => handleCheckboxChange('createEditDashboards')}
//                 className="w-4 h-4"
//               />
//               Create and edit dashboards
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.createEditMaps}
//                 onChange={() => handleCheckboxChange('createEditMaps')}
//                 className="w-4 h-4"
//               />
//               Create and edit maps
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.createEditMaintenance}
//                 onChange={() => handleCheckboxChange('createEditMaintenance')}
//                 className="w-4 h-4"
//               />
//               Create and edit maintenance
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.addProblemComments}
//                 onChange={() => handleCheckboxChange('addProblemComments')}
//                 className="w-4 h-4"
//               />
//               Add problem comments
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.changeSeverity}
//                 onChange={() => handleCheckboxChange('changeSeverity')}
//                 className="w-4 h-4"
//               />
//               Change severity
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.acknowledgeProblems}
//                 onChange={() => handleCheckboxChange('acknowledgeProblems')}
//                 className="w-4 h-4"
//               />
//               Acknowledge problems
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.suppressProblems}
//                 onChange={() => handleCheckboxChange('suppressProblems')}
//                 className="w-4 h-4"
//               />
//               Suppress problems
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.closeProblems}
//                 onChange={() => handleCheckboxChange('closeProblems')}
//                 className="w-4 h-4"
//               />
//               Close problems
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.executeScripts}
//                 onChange={() => handleCheckboxChange('executeScripts')}
//                 className="w-4 h-4"
//               />
//               Execute scripts
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.manageAPITokens}
//                 onChange={() => handleCheckboxChange('manageAPITokens')}
//                 className="w-4 h-4"
//               />
//               Manage API tokens
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.manageScheduledReports}
//                 onChange={() => handleCheckboxChange('manageScheduledReports')}
//                 className="w-4 h-4"
//               />
//               Manage scheduled reports
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.manageSLA}
//                 onChange={() => handleCheckboxChange('manageSLA')}
//                 className="w-4 h-4"
//               />
//               Manage SLA
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.invokeExecuteNow}
//                 onChange={() => handleCheckboxChange('invokeExecuteNow')}
//                 className="w-4 h-4"
//               />
//               Invoke &quot;Execute now&quot; on read-only hosts
//             </label>
//             <label className="flex items-center gap-2 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.changeProblemRanking}
//                 onChange={() => handleCheckboxChange('changeProblemRanking')}
//                 className="w-4 h-4"
//               />
//               Change problem ranking
//             </label>
//             <label className="flex items-center gap-2 mt-4 font-bold text-black">
//               <input
//                 type="checkbox"
//                 checked={formData.defaultAccessNewActions}
//                 onChange={() => handleCheckboxChange('defaultAccessNewActions')}
//                 className="w-4 h-4 "
//               />
//               Default access to new actions
//             </label>
//           </div>
//         </div>

//         {/* Form buttons */}
//         <div className="flex gap-4 mt-8 ml-48">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded"
//           >
//             Add
//           </button>
//           <button
//             type="button"
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-2 rounded"
//             onClick={() => window.history.back()}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }