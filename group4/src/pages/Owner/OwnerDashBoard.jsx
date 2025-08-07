import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { loginContext } from "../../context/LoginContext";
import { Navigate } from "react-router-dom";
import { decodeFakeToken } from "../../data/token";
import { hashPassword } from "../../data/util";

// Import API services
import { getAllProducts } from "../../services/products";
import { getAllCategories } from "../../services/categories";
import { getAllUsers } from "../../services/users";
import { getAllOrders } from "../../services/orders";
import { getAllStores } from "../../services/stores";

// Import components
import OwnerSidebar from "./OwnerSidebar";
import OwnerOverview from "./OwnerOverview";
import OwnerProducts from "./OwnerProducts";
import OwnerStaff from "./OwnerStaff";
import OwnerOrders from "./OwnerOrders";

// Import styles
import "./styles/OwnerDashboard.css";

// Import database (assuming you have a db file)
import db from "../../data/db"; // Add this import

const OwnerDashboard = () => {
  const { token } = useContext(loginContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      if (info) {
        setUser(info);
      }
      setLoading(false);
    };
    decode();
  }, [token]);

  useEffect(() => {
    if (user && user?.role === "owner") {
      // Get store data
      const storeData = db.stores.find(
        (s) => String(s?.ownerId) === String(user?.id)
      );
      setStore(storeData);

      if (storeData) {
        // Get products for this store
        const storeProducts = db.products.filter(
          (p) => p.storeId == storeData.id
        );
        setProducts(storeProducts);

        // Get staff for this store
        const storeStaff = db.users.filter(
          (u) =>
            u.role === "staff" && String(u.storeId) === String(storeData.id)
        );
        setStaff(storeStaff);

        // Get orders for this store
        const storeOrders = db.orders
          .map((order) => {
            const filteredItems = order.items.filter(
              (item) => item.storeId == storeData.id
            );

            if (filteredItems.length > 0) {
              const total = filteredItems.reduce((sum, item) => {
                const product = db.products.find((p) => p.id == item.productId);
                return sum + (product ? product.price * item.quantity : 0);
              }, 0);

              return {
                ...order,
                items: filteredItems,
                total,
              };
            }
            return null;
          })
          .filter(Boolean);

        setOrders(storeOrders);
      }

      // Get all categories
      setCategories(db.categories);
    }
  }, [user]);

  // Handler functions for data manipulation
  const handleAddProduct = async (productData) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          storeId: store.id,
        }),
      });
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );
      const updatedProduct = await response.json();
      setProducts(
        products.map((p) => (p.id === productId ? updatedProduct : p))
      );
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:3000/products/${productId}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...staffData,
          storeId: store.id,
          role: "staff",
        }),
      });
      const newStaff = await response.json();
      setStaff([...staff, newStaff]);
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Có lỗi xảy ra khi thêm nhân viên");
    }
  };

  const handleUpdateStaff = async (staffId, staffData) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      });
      const updatedStaff = await response.json();
      setStaff(staff.map((s) => (s.id === staffId ? updatedStaff : s)));
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Có lỗi xảy ra khi cập nhật nhân viên");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await fetch(`http://localhost:3000/users/${staffId}`, {
        method: "DELETE",
      });
      setStaff(staff.filter((s) => s.id !== staffId));
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Có lỗi xảy ra khi xóa nhân viên");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await response.json();
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
  };

  if (loading) return null;

  if (!user || user?.role !== "owner") {
    return <Navigate to="/" replace />;
  }

  if (!store) {
    return (
      <Container className="my-4">
        <div className="text-center">
          <h3>Không tìm thấy cửa hàng</h3>
          <p className="text-muted">
            Có vẻ như bạn chưa có cửa hàng nào được liên kết với tài khoản này.
          </p>
        </div>
      </Container>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OwnerOverview
            store={store}
            products={products}
            orders={orders}
            staff={staff}
          />
        );
      case "products":
        return (
          <OwnerProducts
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case "staff":
        return (
          <OwnerStaff
            staff={staff}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        );
      case "orders":
        return (
          <OwnerOrders
            orders={orders}
            products={products}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      default:
        return (
          <OwnerOverview
            store={store}
            products={products}
            orders={orders}
            staff={staff}
          />
        );
    }
  };

  return (
    <div className="owner-dashboard-container">
      <Row className="no-gutters">
        <Col md={3} lg={2} className="sidebar-col">
          <OwnerSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            storeName={store.name}
          />
        </Col>
        <Col md={9} lg={10} className="content-col">
          <div className="dashboard-content">{renderContent()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default OwnerDashboard;
