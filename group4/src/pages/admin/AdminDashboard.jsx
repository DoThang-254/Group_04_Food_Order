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
import AdminBlacklistUsers from "./AdminBlacklistUsers";
import AdminBlacklistStores from "./AdminBlacklistStores";

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
  const [sidebarTab, setSidebarTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  return (
    <div className={styles.dashboardContainer}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
        <div style={{ position: 'relative', minWidth: sidebarOpen ? 200 : 48, maxWidth: sidebarOpen ? 220 : 48, background: '#fff', borderRight: '2px solid #bbb', height: '100vh', transition: 'min-width 0.2s, max-width 0.2s', display: 'flex', flexDirection: 'column', alignItems: sidebarOpen ? 'flex-start' : 'center', zIndex: 10 }}>
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{ position: 'absolute', top: 12, right: sidebarOpen ? -18 : -18, background: '#1890ff', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {sidebarOpen ? '<' : '>'}
          </button>
          {sidebarOpen ? (
            <>
              <div style={{ fontWeight: 600, margin: '32px 0 18px 24px', fontSize: 18 }}>Menu</div>
              <div style={{ width: '100%' }}>
                <div style={{ padding: '10px 24px', cursor: 'pointer', color: sidebarTab==='users'?'#1890ff':'#333', fontWeight: sidebarTab==='users'?600:400 }} onClick={()=>setSidebarTab('users')}>Users</div>
                <div style={{ padding: '10px 24px', cursor: 'pointer', color: sidebarTab==='stores'?'#1890ff':'#333', fontWeight: sidebarTab==='stores'?600:400 }} onClick={()=>setSidebarTab('stores')}>Stores</div>
                <div style={{ padding: '10px 24px', cursor: 'pointer', color: sidebarTab.startsWith('blacklist')?'#1890ff':'#333', fontWeight: sidebarTab.startsWith('blacklist')?600:400 }}>
                  <span style={{ cursor: 'pointer' }} onClick={()=>setSidebarTab('blacklist-users')}>Blacklist</span>
                  {sidebarTab.startsWith('blacklist') && (
                    <div style={{ marginLeft: 16 }}>
                      <div style={{ padding: '8px 0', cursor: 'pointer', color: sidebarTab==='blacklist-users'?'#1890ff':'#333', fontWeight: sidebarTab==='blacklist-users'?600:400 }} onClick={()=>setSidebarTab('blacklist-users')}>Users</div>
                      <div style={{ padding: '8px 0', cursor: 'pointer', color: sidebarTab==='blacklist-stores'?'#1890ff':'#333', fontWeight: sidebarTab==='blacklist-stores'?600:400 }} onClick={()=>setSidebarTab('blacklist-stores')}>Stores</div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 24px', cursor: 'pointer', color: sidebarTab==='reports'?'#1890ff':'#333', fontWeight: sidebarTab==='reports'?600:400 }} onClick={()=>setSidebarTab('reports')}>Reports</div>
                <div style={{ padding: '10px 24px', cursor: 'pointer', color: sidebarTab==='feedbacks'?'#1890ff':'#333', fontWeight: sidebarTab==='feedbacks'?600:400 }} onClick={()=>setSidebarTab('feedbacks')}>Feedbacks</div>
              </div>
            </>
          ) : (
            <div style={{ marginTop: 48, fontSize: 22, color: '#1890ff', fontWeight: 700, writingMode: 'vertical-lr', textAlign: 'center', letterSpacing: 2 }}>Menu</div>
          )}
        </div>
        {/* Main content */}
        <div style={{ flex: 1, minHeight: '100vh', background: '#f7f7f7', padding: 32 }}>
          {sidebarTab === 'users' && <AdminUserControl />}
          {sidebarTab === 'stores' && <AdminStoreControl />}
          {sidebarTab === 'blacklist-users' && <AdminBlacklistUsers />}
          {sidebarTab === 'blacklist-stores' && <AdminBlacklistStores />}
          {sidebarTab === 'reports' && (
            <div style={{ background: '#fff', borderRadius: 8, border: '2px solid #bbb', padding: 32, minHeight: 300 }}>
              <h3 style={{ marginBottom: 16 }}>Reports</h3>
              <div>Chức năng báo cáo sẽ được bổ sung sau.</div>
            </div>
          )}
          {sidebarTab === 'feedbacks' && (
            <div style={{ background: '#fff', borderRadius: 8, border: '2px solid #bbb', padding: 32, minHeight: 300 }}>
              <h3 style={{ marginBottom: 16 }}>Feedbacks</h3>
              <div>Chức năng phản hồi sẽ được bổ sung sau.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
