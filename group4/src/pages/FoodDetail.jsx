import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getAnProduct } from '../services/products';
import { useCartStore } from "../stores/stores"; // Đảm bảo đúng đường dẫn
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getAnProduct(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  return (
    <div>
      <div>
        <Button
          variant="warning"
          onClick={() => navigate(-1)}
          className="mt-3 mb-3"
        >
          BACK TO PRODUCTS
        </Button>
      </div>

      <Container>
        <Row>
          <Col xs={6} md={4}>
            <Image src={product?.img} rounded />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <p><strong>Name: {product?.name}</strong></p>
            <p><strong>Price: ${product?.price}</strong></p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setQuantity(q => Math.max(0, q - 1))}>-</Button>
              <span>{quantity}</span>
              <Button variant="secondary" onClick={() => setQuantity(q => q + 1)}>+</Button>
            </div>

            <div className="mt-3">
              <Button
                variant="primary"
                onClick={() => {
                  if (product && quantity > 0) {
                    addToCart({ ...product, quantity });
                    alert("Added to cart!");
                  }
                }}
                disabled={quantity === 0}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FoodDetail;
