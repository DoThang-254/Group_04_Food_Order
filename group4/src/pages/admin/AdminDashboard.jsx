import React, { useEffect, useState } from "react";
import AdminStoreControl from "./AdminStoreControl";
import { getAllStores } from "../../services/stores";
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { getAllOrders } from "../../services/orders";
import { getAllCart } from "../../services/cart";
import { getAllUsers } from "../../services/users";
import styles from "./styles/AdminDashboard.module.css";
import AdminUserControl from "./AdminUserControl";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    stores: 0,
    users: 0,
    categories: 0,
    products: 0,
    orders: 0,
    cart: 0,
  });
  const [page, setPage] = useState('dashboard');
  const [pendingStores, setPendingStores] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [stores, users, categories, products, orders, cart] = await Promise.all([
        getAllStores(),
        getAllUsers ? getAllUsers() : [],
        getAllCategories(),
        getAllProducts(),
        getAllOrders(),
        getAllCart(),
      ]);
      setStats({
        stores: stores.length,
        users: users.length,
        categories: categories.length,
        products: products.length,
        orders: orders.length,
        cart: cart.length,
      });
      setPendingStores(stores.filter(s => s.state === false));
      setAllUsers(users);
    };
    fetchData();
  }, []);

  // Xử lý duyệt hoặc từ chối cửa hàng
  const handleApproveStore = async (store) => {
    if (!window.confirm('Chấp nhận cửa hàng này?')) return;
    await fetch(`http://localhost:3000/stores/${store.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: true })
    });
    setPendingStores(prev => prev.filter(s => s.id !== store.id));
  };
  const handleRejectStore = async (store) => {
    if (!window.confirm('Từ chối cửa hàng này?')) return;
    await fetch(`http://localhost:3000/stores/${store.id}`, {
      method: 'DELETE'
    });
    setPendingStores(prev => prev.filter(s => s.id !== store.id));
  };

  if (page === 'stores') {
    return <AdminStoreControl />;
  }
  if (page === 'users') {
    return <AdminUserControl />;
  }
  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 32, flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Các card dashboard */}
        <div>
          <div className={styles.dashboardCards}>
            <div className={styles.card} style={{ cursor: 'pointer' }} onClick={() => setPage('stores')}>
              <h3>Stores</h3>
              <p>{stats.stores}</p>
            </div>
            <div className={styles.card} style={{ cursor: 'pointer' }} onClick={() => setPage('users')}>
              <h3>Users</h3>
              <p>{stats.users}</p>
            </div>
          </div>
        </div>
        {/* Bảng phê duyệt cửa hàng */}
        <div style={{ minWidth: 350, background: '#fff', borderRadius: 8,  padding: 20, border: '2px solid #bbb' }}>
          <h3 style={{ marginBottom: 16 }}>Phê duyệt cửa hàng</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #bbb' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #bbb' }}>Tên cửa hàng</th>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #bbb' }}>Chủ cửa hàng</th>
                <th style={{ textAlign: 'center', padding: 8, border: '1px solid #bbb' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingStores.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16, color: '#888', border: '1px solid #bbb' }}>Không có cửa hàng chờ duyệt</td></tr>
              ) : (
                pendingStores.map(store => {
                  let ownerDisplay = 'N/A';
                  if (store.ownerId) {
                    const foundUser = allUsers.find(u => String(u.id) === String(store.ownerId));
                    ownerDisplay = foundUser ? foundUser.name : 'N/A';
                  }
                  return (
                    <tr key={store.id}>
                      <td style={{ padding: 8, border: '1px solid #bbb' }}>{store.storeName}</td>
                      <td style={{ padding: 8, border: '1px solid #bbb' }}>{ownerDisplay}</td>
                      <td style={{ padding: 8, textAlign: 'center', border: '1px solid #bbb' }}>
                        <button onClick={() => handleApproveStore(store)} style={{ background: '#52c41a', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Chấp nhận</button>
                        <button onClick={() => handleRejectStore(store)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Từ chối</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
