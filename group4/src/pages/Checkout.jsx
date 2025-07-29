import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useCartStore } from "../stores/stores";

const Checkout = () => {
  const cart = useCartStore((state) => state.cart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container className="py-4">
      {cart.map((item) => (
        <Row
          key={item.id}
          className="border-bottom align-items-center py-3"
        >
          <Col xs={2}>
            <img
              src={item.image}
              alt={item.name}
              className="img-fluid rounded"
            />
          </Col>

          <Col xs={5}>
            <div className="fw-bold">{item.name}</div>
            <div>Màu: {item.color}</div>
            <div>Size: {item.size}</div>
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
            {item.price.toLocaleString()} ₫
          </Col>

          <Col xs={1} className="text-center fw-bold">
            {(item.price * item.quantity).toLocaleString()} ₫
          </Col>

          <Col xs={1} className="text-center">
            <Button
              variant="link"
              className="text-danger p-0"
              onClick={() => removeFromCart(item.id)}
            >
              Xóa
            </Button>
          </Col>
        </Row>
      ))}

      {/* Tổng cộng */}
      <Row className="justify-content-end mt-4">
        <Col xs="auto">
          <h5>
            <strong>TỔNG CỘNG: {total.toLocaleString()} ₫</strong>
          </h5>
        </Col>
      </Row>

      <Row className="justify-content-end mt-2">
        <Col xs="auto">
          <Button variant="dark" className="px-4 py-2">
            TIẾN HÀNH THANH TOÁN
          </Button>
        </Col>
      </Row>

      
    </Container>
  );
};

export default Checkout;
