import React, { useContext } from 'react';
import { themeContext } from '../context/ThemeContext';
import './style/Footer.css';

const Footer = () => {
  const { theme } = useContext(themeContext);

  return (
    <footer className={`footer ${theme === 'dark' ? 'footer-dark' : 'footer-light'}`}>
      <div className="footer-container">
        <div className="footer-section">
          <h5>FoodGo</h5>
          <p>Giao đồ ăn nhanh chóng, an toàn và tiện lợi.</p>
        </div>
        <div className="footer-section">
          <h6>Liên hệ</h6>
          <p>Email: support@foodgo.vn</p>
          <p>Hotline: 1900 6789</p>
        </div>
        <div className="footer-section">
          <h6>Thông tin</h6>
          <p>Chính sách bảo mật</p>
          <p>Điều khoản sử dụng</p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} FoodGo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
