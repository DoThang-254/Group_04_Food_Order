import React, { useContext, useEffect, useState } from 'react';
import { useCartStore } from '../stores/stores';
import {
  Navbar,
  Container,
  Nav,
  Button,
  Dropdown,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  FrownOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Drawer, List, Badge, Affix, Divider } from 'antd';
import { loginContext } from '../context/LoginContext';
import { decodeFakeToken } from '../data/token';
import './style/Header.css';
import logo from './image/logo.jpg'
import { themeContext } from '../context/ThemeContext';
import { getStoreByOwnerId, getStoreByOwnerIdAndChecking } from '../services/stores';

const Header = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { token, setToken } = useContext(loginContext);
  const { theme, toggleTheme } = useContext(themeContext);
  const [role, setRole] = useState();
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      const store = await getStoreByOwnerIdAndChecking(info.id);
      if (info?.id) {
        fetchCart(info.id);
        setRole(info.role);
        if (store.state) {
          setStore(true);
        }
        else {
          setStore(false);
        }
      }
    };
    if (token) decode();
  }, [token]);

  const handleViewDetails = () => {
    setOpen(false);
    navigate('/checkout');
  };

  const handleLogout = () => {
    setToken('');
    clearCart();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Affix offsetTop={0}>
        <Navbar expand="lg" className="custom-navbar">
          <Container>
            <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src={logo} alt="Logo" />
            </Navbar.Brand>

            <Nav className="ml-auto nav-actions" style={{ marginLeft: '1000px' }}>

              <Badge
                count={totalItems}
                offset={[-2, 2]}
                showZero
                style={{
                  backgroundColor: 'white',
                  color: '#E53935',
                  border: '2px solid #E53935',
                  fontWeight: 'bold'
                }}
              >
                <Button
                  className="cart-button"
                  onClick={() => setOpen(true)}
                  title="Giỏ hàng"
                >
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                </Button>
              </Badge>
            </Nav>

            <Nav style={{ marginLeft: '15px' }}>
              {token ? (
                <Dropdown align="end">
                  <Dropdown.Toggle className="account-dropdown">
                    <UserOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
                    Account
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      <ProfileOutlined style={{ marginRight: '8px' }} />
                      Profile
                    </Dropdown.Item>
                    {role === 'owner' && store && (
                      <Dropdown.Item onClick={() => navigate('/owner-dashboard')}>
                        <ProfileOutlined style={{ marginRight: '8px' }} />
                        Owner Dashboard
                      </Dropdown.Item>
                    )}
                    {role != 'owner' || !store && (
                      <Dropdown.Item onClick={() => navigate('/')}>
                        <ProfileOutlined style={{ marginRight: '8px' }} />
                        Register Store
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={toggleTheme}>
                      {theme === "light" ?
                        <MoonOutlined style={{ marginRight: '8px' }} /> :
                        <SunOutlined style={{ marginRight: '8px' }} />
                      }
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <LogoutOutlined style={{ marginRight: '8px' }} />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link
                  onClick={() => navigate('/login')}
                  style={{ cursor: 'pointer' }}
                  className="login-link"
                >
                  <UserOutlined style={{ marginRight: '8px' }} />
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCartOutlined style={{ fontSize: '20px' }} />
              Cart Summary
            </div>
          }
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          width={360}
          className={theme === 'dark' ? 'drawer-dark' : 'drawer-light'}
          style={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          {cart.length === 0 ? (
            <div className="text-center mt-5">
              <FrownOutlined style={{ fontSize: '64px', marginBottom: '16px', color: '#E53935' }} />

              <p>There are no products in your shopping cart.</p>
              <Button 
                type="primary" 

                onClick={() => {
                  setOpen(false);
                  navigate('/');
                }}
                style={{ marginTop: '20px' }}
              >
                Continue shopping
              </Button>
            </div>
          ) : (
            <>
              <List
                className={theme === 'dark' ? 'cart-list-dark' : 'cart-list-light'}
                itemLayout="horizontal"
                dataSource={cart}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{item.name || 'Tên sản phẩm'}</span>
                          <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                            x{item.quantity}
                          </span>
                        </div>
                      }
                      description={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                          <span>${(item.price || 0).toLocaleString()}/item</span>
                          <span style={{ fontWeight: 'bold', color: '#E53935', fontSize: '1.1rem' }}>
                            ${((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />

              <Divider style={{ borderColor: '#E53935', opacity: 0.3 }} />

              <div style={{
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                <span>Total:</span>
                <span style={{ color: '#E53935', fontSize: '1.4rem' }}>
                  ${totalPrice.toLocaleString()}
                </span>
              </div>

              <Button
                type="primary"
                block
                onClick={handleViewDetails}
                size="large"
                style={{ marginTop: '10px' }}
              >
                <ShoppingCartOutlined style={{ marginRight: '8px' }} />
                View Cart Detail
              </Button>
            </>
          )}
        </Drawer>
      </Affix>
    </>
  );
};

export default Header;