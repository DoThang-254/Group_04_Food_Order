import React, { useContext, useEffect, useState } from 'react';
import { useCartStore } from '../stores/stores';
import {
  Navbar,
  Container,
  Nav,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import { Drawer, List, Badge, Affix } from 'antd'; // 👉 THÊM Affix Ở ĐÂY
import { loginContext } from '../context/LoginContext';
import { decodeFakeToken } from '../data/token';
import './style/Header.css';
import logo from './image/logo.jpg'
const Header = () => {
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { token, setToken } = useContext(loginContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      if (info?.id) {
        fetchCart(info.id);
      }
    };
    if (token) decode();
  }, [token]);

  const handleViewDetails = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <Affix offsetTop={0}> {/* 👉 BỌC NAVBAR TRONG AFFIX */}
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand href="/" className="brand-wrapper">
  <div className="d-flex align-items-center">
    <img src={logo} alt="Logo" className='logo-img' />
  </div>
</Navbar.Brand>
            <Nav className="ml-auto nav-actions">
              <Badge count={totalItems} offset={[-2, 2]} color="#E53935">
                <Button className="cart-button" onClick={() => setOpen(true)}>
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                </Button>
              </Badge>
              {token ? (
                <Button
                  className="logout-btn"
                  onClick={() => {
                    clearCart();
                    setToken('');
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              ) : (
                <a className="login-link" href="/login">
                  Login
                </a>
              )}
            </Nav>
          </Container>
        </Navbar>
      </Affix>

     <Drawer
  title="Cart Summary"
  placement="right"
  onClose={() => setOpen(false)}
  open={open}
>
  <div> {/* 👈 THÊM THẺ BAO DIV */}
    {cart.length === 0 ? (
      <div className="text-center mt-5">
        <FrownOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
        <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
      </div>
    ) : (
      <>
        <List
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name || 'Tên sản phẩm'}
                description={`Quantity: ${item.quantity}`}
              />
              <div>${(item.price || 0) * (item.quantity || 0)}</div>
            </List.Item>
          )}
        />
        <hr />
        <Button type="primary" block onClick={handleViewDetails}>
          View Details
        </Button>
      </>
    )}
  </div>
</Drawer>
    </>
  );
};

export default Header;
