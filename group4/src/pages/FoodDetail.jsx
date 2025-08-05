import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getAnProduct } from '../services/products';
import { useCartStore } from "../stores/stores";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { loginContext } from '../context/LoginContext';
import './customerstyle/FoodDetail.css';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default 1 cho UX tốt hơn
const [idUser,setIdUser] = useState()
  const addToCart = useCartStore((state) => state.addToCart);
 const { token } = useContext(loginContext);
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getAnProduct(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);
   useEffect(() => {
      const decode = async () => {
        const info = await decodeFakeToken(token);
        console.log(info.id)
        if (info) {
          setIdUser(info.id);
           
        }
  
      };
      decode();
    }, [token]);
  

  const handleAddToCart = () => {
    if (!token) {
      alert("Please log in to add to cart.");
      navigate('/login');
      return;
    }

    if (product && quantity > 0) {
      const item = {
        userId: idUser,
        productId: Number(product.id),
        storeId: Number(product.storeId),
        quantity: quantity,
      };

      addToCart(item);
      alert("Added to cart!");
    }
  };

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
          <Col xs={12} md={6}>
            <Image src={product?.img} rounded fluid />
          </Col>
          <Col xs={12} md={6}>
            <h4>{product?.name}</h4>
            <p><strong>Price:</strong> ${Number(product?.price).toLocaleString()}</p>
            
            <div className="mt-3">
              <Button
                variant="primary"
                onClick={handleAddToCart}
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
