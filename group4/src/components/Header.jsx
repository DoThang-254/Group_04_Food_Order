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
} from '@ant-design/icons';
import { Drawer, List, Badge, Affix } from 'antd'; 
import { loginContext } from '../context/LoginContext';
import { decodeFakeToken } from '../data/token';
import './style/Header.css';
import logo from './image/logo.jpg'
import { themeContext } from '../context/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { token, setToken } = useContext(loginContext);
  const { theme, toggleTheme } = useContext(themeContext);

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
      <Affix offsetTop={0}>
        <Navbar bg="danger" expand="lg" className="shadow-sm">
          <Container style={{ backgroundColor: "red" }}>
            <Navbar.Brand href="/">
              <div> <img src={logo}/></div>
            </Navbar.Brand>

            <Nav className="ml-auto nav-actions">
              <Badge count={totalItems} offset={[-2, 2]} color="#E53935">
                <Button className="cart-button" onClick={() => setOpen(true)}>
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                </Button>
              </Badge>
            </Nav>
            <Nav style={{ marginLeft: '10px' }}>
              {token ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Account
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={toggleTheme}>
                      Mode : <></>
                      <span>
                        {theme === "light" ? "Dark" : "Light"
                        }
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {
                      setToken('')
                      clearCart()
                      localStorage.removeItem('token')
                      navigate('/login')
                    }}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link href="/login" style={{ color: 'white', fontSize: 'large' }}>Login</Nav.Link>
              )}
            </Nav>

          </Container>
        </Navbar>

        <Drawer
          title="Cart Summary"
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          className={theme === 'dark' ? 'drawer-dark' : 'drawer-light'}
          style={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          {cart.length === 0 ? (
            <div className="text-center mt-5">
              <FrownOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
              <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
            </div>
          ) : (
            <>
              <List
                className={theme === 'dark' ? 'cart-list-dark' : 'cart-list-light'}
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
        </Drawer>
      </Affix>

    </>
  );
};

export default Header;
