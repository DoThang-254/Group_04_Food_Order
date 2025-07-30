import React, { useState } from 'react';
import { useCartStore } from '../stores/stores';
import {
  Navbar,
  Container,
  Nav,
  Badge,
  Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import { Drawer, List, Typography } from 'antd';

const Header = () => {
  const cart = useCartStore((state) => state.cart);
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
          <Nav className="ml-auto">
            <Button variant="outline-primary" onClick={() => setOpen(true)}>
              <ShoppingCartOutlined />{' '}
              <Badge bg="secondary">{totalItems}</Badge>
            </Button>
          </Nav>
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
