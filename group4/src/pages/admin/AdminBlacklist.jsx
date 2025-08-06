import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../services/users";
import "./styles/AdminStoreControl.css";

const AdminBlacklist = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    if (!user.ban) return false;
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? user.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="adminstore-dashboardContainer" style={{ padding: 0, marginTop: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="adminstore-dashboardTitle">Blacklist Users</h2>
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
        </select>
      </div>
      <table className="adminstore-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
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
                user.role === 'admin' ? 'Admin' : user.role
              }</td>
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

export default AdminBlacklist;
