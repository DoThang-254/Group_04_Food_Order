import React, { useContext, useState } from 'react';
import { useCartStore } from '../stores/stores';
import {
  Navbar,
  Container,
  Nav,
  Badge,
  Button,
  Offcanvas,
  ListGroup,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { loginContext } from '../context/LoginContext';

const Header = () => {
  const cart = useCartStore((state) => state.cart);
  const { token , setToken } = useContext(loginContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleViewDetails = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">My Shop</Navbar.Brand>
          {token ? <Button onClick={() => {
            setToken('')
            localStorage.removeItem('token')
            navigate('/login')
          }}>Logout</Button> : <Navbar.Brand href="/login">Login</Navbar.Brand>}
          <Nav className="ml-auto">
            <Button variant="outline-primary" onClick={handleShow}>
              <ShoppingCartOutlined /> <Badge bg="secondary">{totalItems}</Badge>
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart Summary</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{item.name}</strong>
                        <br />
                        Quantity: {item.quantity}
                      </div>
                      <div>${item.price * item.quantity}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <hr />
              <Button variant="primary" onClick={handleViewDetails}>
                View Details
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
export default Header;
