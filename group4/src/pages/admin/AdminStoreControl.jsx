import React, { useEffect, useState } from "react";
import { getAllStores } from "../../services/stores";
import { getAllUsers } from "../../services/users";
import { getAllProducts } from "../../services/products";
import "./styles/AdminStoreControl.css";

const AdminStoreControl = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 1;
  const [selectedStore, setSelectedStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllStores().then(setStores);
    getAllUsers().then(setUsers);
    getAllProducts().then(setProducts);
  }, []);

  const getOwnerName = (ownerId) => {
    const owner = users.find(u => String(u.id) === String(ownerId));
    return owner ? owner.name : "";
  };

  const filteredStores = stores.filter(store => {
    const ownerName = getOwnerName(store.ownerId).toLowerCase();
    const matchSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.includes(search.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredStores.length / pageSize) || 1;
  const paginatedStores = filteredStores.slice((page - 1) * pageSize, page * pageSize);

  const handleBack = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="adminstore-dashboardContainer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="adminstore-dashboardTitle">Stores</h2>
        <button onClick={handleBack} style={{ padding: '8px 20px', borderRadius: 4, background: '#eee', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 500 }}>
          Back
        </button>
      </div>
      <div className="adminstore-searchBar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); setSelectedStore(null); }}
          className="adminstore-searchInput"
        />
      </div>
      <table className="adminstore-table">
        <thead>
          <tr>
            <th>Tên cửa hàng</th>
            <th>Địa chỉ</th>
            <th>Chủ cửa hàng</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStores.map(store => (
            <tr key={store.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedStore(store)}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{getOwnerName(store.ownerId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #ccc', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
        <span style={{ minWidth: 60, textAlign: 'center' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #ccc', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
      </div>

      {selectedStore && (
        <div className="adminstore-modal-overlay" onClick={() => setSelectedStore(null)}>
          <div className="adminstore-modal" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedStore(null)}
              className="adminstore-modal-close"
              aria-label="Đóng"
            >
              ×
            </button>
            <h3 className="adminstore-modal-title">Chi tiết cửa hàng</h3>
            <div className="adminstore-modal-content">
              <div className="adminstore-modal-row">
                <div className="adminstore-modal-label">Tên cửa hàng:</div>
                <div>{selectedStore.name}</div>
              </div>
              <div className="adminstore-modal-row">
                <div className="adminstore-modal-label">Chủ cửa hàng:</div>
                <div>{getOwnerName(selectedStore.ownerId)}</div>
              </div>
              <div className="adminstore-modal-row">
                <div className="adminstore-modal-label">Địa chỉ:</div>
                <div>{selectedStore.address}</div>
              </div>
              <div className="adminstore-modal-row adminstore-modal-row-menu">
                <div className="adminstore-modal-label">Menu:</div>
                <ul className="adminstore-modal-list">
                  {products.filter(p => String(p.storeId) === String(selectedStore.id)).length === 0 && <li>Không có sản phẩm</li>}
                  {products.filter(p => String(p.storeId) === String(selectedStore.id)).map(p => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              </div>
              <div className="adminstore-modal-row adminstore-modal-row-menu">
                <div className="adminstore-modal-label">Nhân viên:</div>
                <ul className="adminstore-modal-list">
                  {users.filter(u => u.role === 'staff' && String(u.storeId) === String(selectedStore.id)).length === 0 && <li>Không có nhân viên</li>}
                  {users.filter(u => u.role === 'staff' && String(u.storeId) === String(selectedStore.id)).map(u => (
                    <li key={u.id}>{u.name} ({u.email})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreControl;
