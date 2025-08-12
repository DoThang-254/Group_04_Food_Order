import React, { useState, useEffect } from "react";
import { getAllStores } from "../../services/stores";       
import { getAllUsers } from "../../services/users";
import "./styles/AdminStoreControl.css";

const AdminBlacklistStores = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    getAllStores().then(setStores);
    getAllUsers().then(setUsers);
  }, []);

  // Chỉ lấy các store bị ban (state === false hoặc có trường ban === true)
  const filteredStores = stores.filter(store => {
  if (!store.ban !== false) return false;
  if (!store.name) return false;
  const matchSearch = store.name.toLowerCase().includes(search.toLowerCase());
  return matchSearch;
  });

  const totalPages = Math.ceil(filteredStores.length / pageSize) || 1;
  const paginatedStores = filteredStores.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="adminstore-dashboardContainer" style={{ padding: 0, marginTop: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="adminstore-dashboardTitle">Blacklist Stores</h2>
      </div>
      <div className="adminstore-searchBar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên cửa hàng..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="adminstore-searchInput"
        />
      </div>
      <table className="adminstore-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên cửa hàng</th>
            <th>Địa chỉ</th>
            <th>Chủ cửa hàng</th>
            <th>Lý do ban</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStores.map((store, idx) => {
            const owner = users.find(u => String(u.id) === String(store.ownerId));
            return (
              <tr key={store.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{store.name}</td>
                <td>{store.address || store.storeAddress}</td>
                <td>{owner ? owner.name : store.ownerId}</td>
                <td>{store.banReason || ''}</td>
                <td>
                  <button
                    style={{background:'#2d8202ff',color:'#fff',border:'none',borderRadius:4,padding:'4px 12px',cursor:'pointer'}}
                    onClick={async () => {
                      if (!window.confirm('Bạn có chắc chắn muốn kích hoạt lại cửa hàng này không?')) return;
                      try {
                        await fetch(`http://localhost:3000/stores/${store.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ state: true, ban: false })
                        });
                        setStores(prev => prev.map(s => s.id === store.id ? { ...s, state: true, ban: false } : s));
                      } catch (e) {
                        alert('Cập nhật trạng thái thất bại!');
                      }
                    }}
                  >Active</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #ccc', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
        <span style={{ minWidth: 60, textAlign: 'center' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: 4, border: '1px solid #ccc', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
      </div>
    </div>
  );
};

export default AdminBlacklistStores;
