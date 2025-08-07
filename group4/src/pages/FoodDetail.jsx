import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rate } from 'antd';
import { getAnProduct } from '../services/products';
import { useCartStore } from '../stores/stores';
import { loginContext } from '../context/LoginContext';
import './customerstyle/FoodDetail.css';
import React, { useState } from 'react';
import { Flex, Rate } from 'antd';
 const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const FoodDetail = () => {
 
  const [value, setValue] = useState(3);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { token } = useContext(loginContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getAnProduct(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const handleAddToCart = () => {
    if (!token) {
      alert('Please log in to add to cart.');
      navigate('/login');
      return;
    }

    if (product && quantity > 0) {
      const item = {
        productId: (product.id),
        storeId: (product.storeId),
        quantity: quantity,
      };

      addToCart(item);
      alert('Added to cart!');
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="food-detail-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="food-detail-container">
        <div className="food-detail-img">
          <img src={product?.img} alt={product?.name} />
        </div>

        <div className="food-detail-info">
          <h1 className="food-name">{product?.name}</h1>
          <p className="food-price">${Number(product?.price).toLocaleString()}</p>
          
          {/* Rating Section */}
          <div className="rating-section">
             <Flex gap="middle" vertical>
      <Rate tooltips={desc} onChange={setValue} value={value} />
      {value ? <span>{desc[value - 1]}</span> : null}
    </Flex>
          </div>

          <p className="food-desc">
            {product?.description || 'Delicious food made from fresh ingredients, ensuring hygiene and authentic restaurant flavors. Sweet spicy vegetable with delicious prosciutto. Fried and the yellow sauce flavoring served.'}
          </p>

          {/* Food Info */}
          <div className="food-info">
            <div className="info-item">
              <span className="info-label">SKU:</span>
              <span className="info-value">R1017</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">Burgers</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tags:</span>
              <span className="info-value">Fast Food, Hot, Soft, Trend</span>
            </div>
          </div>

          <div className="quantity-box">
            <span>Quantity:</span>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;