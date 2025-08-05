
import React, { useContext } from 'react';
import { loginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { setIsLogin } = useContext(loginContext);
  const navigate = useNavigate();
  // Lấy tên tài khoản admin từ localStorage (giả định đã lưu khi đăng nhập)
  // const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  return (
    <div style={{
      width: '100%',
      background: '#8B0000',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      letterSpacing: 1
    }}>
      <div>
        {/* Admin &nbsp;|&nbsp; {adminName} */}
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: 'white',
          color: '#8B0000',
          border: 'none',
          borderRadius: 4,
          padding: '8px 20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: 16
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;
