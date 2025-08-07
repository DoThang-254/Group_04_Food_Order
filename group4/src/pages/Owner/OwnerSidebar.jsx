import React from "react";
import { Nav } from "react-bootstrap";
import "./styles/OwnerSidebar.css";

const OwnerSidebar = ({ activeTab, onTabChange, storeName }) => {
  const menuItems = [
    { id: "overview", label: "Tổng quan", icon: "📊" },
    { id: "products", label: "Quản lý sản phẩm", icon: "🍕" },
    { id: "staff", label: "Quản lý nhân sự", icon: "👥" },
    { id: "orders", label: "Đơn hàng", icon: "📦" },
  ];

  return (
    <div className="owner-sidebar">
      <div className="sidebar-header">
        <h4>{storeName || "Store Dashboard"}</h4>
        <p className="text-muted">Owner Panel</p>
      </div>

      <Nav className="flex-column sidebar-nav">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="sidebar-footer">
        <small className="text-muted">© 2025 Food Delivery System</small>
      </div>
    </div>
  );
};

export default OwnerSidebar;
