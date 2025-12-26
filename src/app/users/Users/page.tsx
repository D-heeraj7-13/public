"use client";

import { useState } from "react";
import { Button, Input, Select, Checkbox, Tabs } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    groups: [],
    password: "",
    passwordConfirm: "",
    language: "system_default",
    timezone: "system_default",
    theme: "system_default",
    autoLogin: false,
    autoLogout: false,
    autoLogoutTime: "15m",
    refresh: "30s",
    rowsPerPage: "50",
    urlAfterLogin: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Add your submit logic here
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Add your cancel logic here
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", maxWidth: "100%", minHeight: "100vh" }}>
      <div style={{ maxWidth: "flex ", backgroundColor: "white", padding: "0" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="User" key="1">
            <div style={{ padding: "20px" }}>
              {/* Username */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  <span style={{ color: "red" }}>* </span>Username
                </label>
                <Input
                  style={{ flex: 1, maxWidth: "500px" }}
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </div>

              {/* Name */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Name
                </label>
                <Input
                  style={{ flex: 1, maxWidth: "500px" }}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              {/* Last name */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Last name
                </label>
                <Input
                  style={{ flex: 1, maxWidth: "500px" }}
                  value={formData.lastname}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                />
              </div>

              {/* Groups */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Groups
                </label>
                <div style={{ flex: 1, maxWidth: "500px", display: "flex", gap: "10px" }}>
                  <Input
                    placeholder="type here to search"
                    style={{ flex: 1 }}
                    value={formData.groups.join(", ")}
                    readOnly
                  />
                  <Button>Select</Button>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  <span style={{ color: "red" }}>* </span>Password{" "}
                  <InfoCircleOutlined style={{ color: "#999", fontSize: "14px" }} />
                </label>
                <Input.Password
                  style={{ flex: 1, maxWidth: "180px" }}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>

              {/* Password (once again) */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  <span style={{ color: "red" }}>* </span>Password (once again)
                </label>
                <Input.Password
                  style={{ flex: 1, maxWidth: "180px" }}
                  value={formData.passwordConfirm}
                  onChange={(e) => handleInputChange("passwordConfirm", e.target.value)}
                />
              </div>

              {/* Info text */}
              <div style={{ marginBottom: "24px", paddingLeft: "210px" }}>
                <span style={{ color: "#666", fontSize: "13px" }}>
                  Password is not mandatory for non internal authentication type.
                </span>
              </div>

              {/* Language */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Language
                </label>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <Select
                    style={{ width: "250px" }}
                    value={formData.language}
                    onChange={(value) => handleInputChange("language", value)}
                  >
                    <Select.Option value="system_default">System default</Select.Option>
                    <Select.Option value="english">English</Select.Option>
                    <Select.Option value="spanish">Spanish</Select.Option>
                  </Select>
                  <Button
                    style={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      width: "32px",
                      height: "32px",
                      padding: "0",
                    }}
                  >
                    ⓘ
                  </Button>
                </div>
              </div>

              {/* Time zone */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Time zone
                </label>
                <Select
                  style={{ width: "400px" }}
                  value={formData.timezone}
                  onChange={(value) => handleInputChange("timezone", value)}
                >
                  <Select.Option value="system_default">
                    System default: (UTC+05:30) Asia/Kolkata
                  </Select.Option>
                  <Select.Option value="utc">UTC</Select.Option>
                  <Select.Option value="est">EST</Select.Option>
                </Select>
              </div>

              {/* Theme */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Theme
                </label>
                <Select
                  style={{ width: "250px" }}
                  value={formData.theme}
                  onChange={(value) => handleInputChange("theme", value)}
                >
                  <Select.Option value="system_default">System default</Select.Option>
                  <Select.Option value="light">Light</Select.Option>
                  <Select.Option value="dark">Dark</Select.Option>
                </Select>
              </div>

              {/* Auto-login */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Auto-login
                </label>
                <Checkbox
                  checked={formData.autoLogin}
                  onChange={(e) => handleInputChange("autoLogin", e.target.checked)}
                />
              </div>

              {/* Auto-logout */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  Auto-logout
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Checkbox
                    checked={formData.autoLogout}
                    onChange={(e) => handleInputChange("autoLogout", e.target.checked)}
                  />
                  <Input
                    style={{ width: "100px" }}
                    value={formData.autoLogoutTime}
                    onChange={(e) => handleInputChange("autoLogoutTime", e.target.value)}
                    disabled={!formData.autoLogout}
                  />
                </div>
              </div>

              {/* Refresh */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  <span style={{ color: "red" }}>* </span>Refresh
                </label>
                <Input
                  style={{ width: "100px" }}
                  value={formData.refresh}
                  onChange={(e) => handleInputChange("refresh", e.target.value)}
                />
              </div>

              {/* Rows per page */}
              <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  <span style={{ color: "red" }}>* </span>Rows per page
                </label>
                <Input
                  style={{ width: "100px" }}
                  value={formData.rowsPerPage}
                  onChange={(e) => handleInputChange("rowsPerPage", e.target.value)}
                />
              </div>

              {/* URL (after login) */}
              <div style={{ marginBottom: "24px", display: "flex", alignItems: "center" }}>
                <label style={{ width: "200px", textAlign: "right", marginRight: "10px" }}>
                  URL (after login)
                </label>
                <Input
                  style={{ flex: 1, maxWidth: "500px" }}
                  value={formData.urlAfterLogin}
                  onChange={(e) => handleInputChange("urlAfterLogin", e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ paddingLeft: "210px", display: "flex", gap: "10px" }}>
                <Button type="primary" onClick={handleSubmit}>
                  Add
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Media" key="2">
            <div style={{ padding: "20px" }}>Media content goes here</div>
          </TabPane>
          <TabPane tab="Permissions" key="3">
            <div style={{ padding: "20px" }}>Permissions content goes here</div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default UserForm;