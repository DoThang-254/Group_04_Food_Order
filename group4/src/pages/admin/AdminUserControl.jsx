import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users";
import "./styles/AdminStoreControl.css";

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    if (user.role === 'admin') return false;
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? user.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleToggleActive = async (user) => {
    const action = user.active ? 'ban' : 'kích hoạt';
    const confirmMsg = `Bạn có chắc chắn muốn ${action} tài khoản này không?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !user.active })
      });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    } catch (e) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  const handleBack = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="adminstore-dashboardContainer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="adminstore-dashboardTitle">Users</h2>
        <button onClick={handleBack} style={{ padding: '8px 20px', borderRadius: 4, background: '#eee', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 500 }}>
          Back
        </button>
      </div>
      <div className="adminstore-searchBar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="adminstore-searchInput"
        />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 4 }}>
          <option value="">Tất cả vai trò</option>
          <option value="customer">Khách hàng</option>
          <option value="owner">Chủ cửa hàng</option>
          <option value="staff">Nhân viên</option>
        </select>
      </div>
      <table className="adminstore-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, idx) => (
            <tr key={user.id}>
              <td>{(page - 1) * pageSize + idx + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{
                user.role === 'customer' ? 'Khách hàng' :
                user.role === 'owner' ? 'Chủ cửa hàng' :
                user.role === 'admin' ? 'Admin' :
                user.role === 'staff' ? 'Nhân viên' : user.role
              }</td>
              <td>
                {user.active ? (
                  <button
                    style={{background:'rgb(139, 0, 0)',color:'#fff',border:'none',borderRadius:4,padding:'4px 12px',cursor:'pointer'}}
                    onClick={() => handleToggleActive(user)}
                  >Ban</button>
                ) : (
                  <button
                    style={{background:'#2d8202ff',color:'#fff',border:'none',borderRadius:4,padding:'4px 12px',cursor:'pointer'}}
                    onClick={() => handleToggleActive(user)}
                  >Active</button>
                )}
              </td>
            </tr>
          ))}
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

export default AdminUserControl;
