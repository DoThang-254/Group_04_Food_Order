import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useCartStore } from "../stores/stores";
import { DeleteOutlined } from '@ant-design/icons';
import { createOrder } from "../services/orders";
import { loginContext } from "../context/LoginContext";
import { decodeFakeToken } from "../data/token";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const cart = useCartStore((state) => state.cart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearAfterCheckout = useCartStore((state) => state.clearAfterCheckout);
  useEffect(() => {
    fetchCart();
  }, [])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { token } = useContext(loginContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      if (info) {
        setUser(info);
      }
      setLoading(false);
    };
    decode();
  }, [token]);

  if (loading) return null;

  const handleCheckout = async () => {
    if (total > 0) {
      const isConfirmed = window.confirm("Checkout successfully. Do you want pay?");
      if (isConfirmed) {
        await clearAfterCheckout();
        try {
          const order = {
            userId: user.id,
            status: 'pending',
            total: total,
            items: cart,
            createdAt: new Date().toISOString()
          }
          const newOrder = await createOrder(order);

          navigate(`/payment/${newOrder.id}`);
          // navigate('/qr', { state: { orderId: newOrder.id, total: total } });

        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <Container className="py-4">
      {cart.map((item) => (
        <Row
          key={item.id}
          className="border-bottom align-items-center py-3"
        >
          <Col xs={2}>
            <img
              src={item.img}
              alt={item.name}
              className="img-fluid rounded"
            />
          </Col>

          <Col xs={5}>
            <div className="fw-bold">{item.name}</div>

          </Col>

          <Col xs={2} className="d-flex align-items-center">
            <div className="d-flex border rounded px-2">
              <Button
                variant="light"
                size="sm"
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </Button>
              <div className="px-2 d-flex align-items-center">
                {item.quantity}
              </div>
              <Button
                variant="light"
                size="sm"
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </Button>
            </div>
          </Col>

          <Col xs={1} className="text-center fw-bold">
            {item.price} $
          </Col>

          <Col xs={1} className="text-center fw-bold">
            {(item.price * item.quantity)} $
          </Col>

          <Col xs={1} className="text-center">
            <Button
              variant="link"
              className="text-danger p-0"
              onClick={() => removeFromCart(item.id)}
            >
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
      ))}

      {/* Tổng cộng */}
      <Row className="justify-content-end mt-4">
        <Col xs="auto">
          <h5>
            <strong>TOTAL: {total} $</strong>
          </h5>
        </Col>
      </Row>
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
      <Row className="justify-content-end mt-2">
        <Col xs="auto">
          <Button variant="dark" className="px-4 py-2" onClick={handleCheckout} >
            Checkout
          </Button>
        </Col>
      </Row>


    </Container>
  );
};

export default Checkout;
