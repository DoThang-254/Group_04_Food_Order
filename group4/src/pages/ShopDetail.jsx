import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnStore } from '../services/stores';
import { getAllProducts } from '../services/products';
import './customerstyle/ShopDetail.css';
import { useCartStore } from '../stores/stores';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { loginContext } from '../context/LoginContext';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { token } = useContext(loginContext);
 const nav = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const handleAddToCart = (product) => {
    if (!token) {
      alert('Please login to add to cart.');
      navigate('/login');
      return;
    }

    const item = {
      productId: (product.id),
      storeId: (product.storeId),
      quantity: 1,
    };

    addToCart(item);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-toast';
    successMsg.innerHTML = `
      <div class="success-content">
        <i class="success-icon">✓</i>
        <span>Added ${product.name} to cart!</span>
      </div>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storeRes = await getAnStore(id);
        setStore(storeRes);

        const productsRes = await getAllProducts();
        setProducts(productsRes);

        const filtered = productsRes.filter(
          (p) => Number(p.storeId) === Number(id)
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Get unique categories
  const categories = ['all', ...new Set(filteredProducts.map(p => p.category).filter(Boolean))];

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      const filtered = products.filter(
        (p) => Number(p.storeId) === Number(id)
      );
      setFilteredProducts(filtered);
    } else {
      const filtered = products.filter(
        (p) => Number(p.storeId) === Number(id) && p.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading store information...</p>
      </div>
    );
  }
  

  return (
    <div className="shop-detail-wrapper">
      {/* Hero Section */}
      {store && (
        <div className="shop-hero">
          <div className="hero-background">
            <img src={store.img} alt={store.name} className="hero-bg-image" />
            <div className="hero-overlay"></div>
          </div>
          <Container>
            <div className="hero-content">
              <div className="shop-avatar">
                <img src={store.img} alt={store.name} />
              </div>
              <div className="shop-info">
                <h1 className="shop-name">{store.name}</h1>
                <div className="shop-stats">
                  <div className="stat-item">
                    <span className="stat-number">{filteredProducts.length}</span>
                    <span className="stat-label">Dish</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">4.5</span>
                    <span className="stat-label">⭐ Rating</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">30-45</span>
                    <span className="stat-label">Delivery Minute</span>
                  </div>
                </div>
                <p className="shop-description">
                 Welcome to {store.name}! We are committed to bringing you the best food with great quality.
                </p>
              </div>
            </div>
          </Container>
        </div>
      )}

      <Container className="shop-content">
        {/* Category Filter */}
        <div className="category-section">
          <h3 className="section-title">
            <span className="title-icon">🍽️</span>
           Our menu
          </h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h4>No food available</h4>
            <p>This store currently has no dishes in the selected category.</p>
          </div>
        ) : (
          <Row className="products-grid g-4">
            {filteredProducts.map((product, index) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="product-card animate-fade-in" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                 onClick={() => navigate(`/food/${product.id}/detail`)}
                >
                  <div className="card-image-wrapper">
                    <Card.Img
                      variant="top"
                      src={product.img}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="image-overlay">
                      <button 
                        className="quick-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                           navigate(`/food/${product.id}/detail`);
                        }}
                      >
                        <i className="view-icon" >👁️</i>
                        View Detail
                      </button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="product-header">
                      <Card.Title className="product-name">{product.name}</Card.Title>
                      <div className="rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-text">(4.5)</span>
                      </div>
                    </div>
                    <Card.Text className="product-price">
                      {product.price.toLocaleString()}₫
                    </Card.Text>
                    <Button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <span className="btn-icon">🛒</span>
                      Add To Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ShopDetail;