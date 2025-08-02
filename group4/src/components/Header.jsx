import React, { useContext, useState } from 'react';
import { useCartStore } from '../stores/stores';
import {
  Navbar,
  Container,
  Nav,
  Badge,
  Button,
  Dropdown,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import { Drawer, List, Typography } from 'antd';
import { loginContext } from '../context/LoginContext';


const Header = () => {
  const cart = useCartStore((state) => state.cart);
  const { token, setToken } = useContext(loginContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleViewDetails = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">My Shop</Navbar.Brand>
          <Nav className="ml-auto" style={{ marginLeft: "70%" }}>
            <Button variant="outline-primary" onClick={() => setOpen(true)}>
              <ShoppingCartOutlined />{' '}
              <Badge bg="secondary">{totalItems}</Badge>
            </Button>
          </Nav>
          {token ? (
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                Account
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/settings')}>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    setToken('');
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Navbar.Brand href="/login">Login</Navbar.Brand>
          )}

        </Container>
      </Navbar>

      <Drawer
        title="Cart Summary"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
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
                    title={item.name}
                    description={`Quantity: ${item.quantity}`}
                  />
                  <div>${item.price * item.quantity}</div>
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
    </>
  );
};

export default Header;
