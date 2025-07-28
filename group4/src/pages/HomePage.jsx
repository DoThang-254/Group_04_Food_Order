import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/products';
import { getAllCategories } from '../services/categories';
import { ListGroup, Card, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
    const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  useEffect(() => {
      const fetchProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
      };
      fetchProducts();
    }, []);
  
    
    useEffect(() => {
      const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
      };
      fetchCategories();
    }, []);
     const filteredProducts = products.filter((p) => {
    return selectedCategoryId === "all" || p.categoryId === parseInt(selectedCategoryId);
  });

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <h5>Categories</h5>
          <ListGroup>
            <ListGroup.Item
              active={selectedCategoryId === "all"}
              onClick={() => setSelectedCategoryId("all")}
              style={{ cursor: 'pointer' }}
            >
              All
            </ListGroup.Item>
            {categories.map((cat) => (
              <ListGroup.Item
                key={cat.id}
                active={selectedCategoryId === String(cat.id)}
                onClick={() => setSelectedCategoryId(String(cat.id))}
                style={{ cursor: 'pointer' }}
              >
                {cat.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9}>
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={6} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Card.Text>
  Category: {categories.find(cat => cat.id === product.categoryId)?.name || "Unknown"}
</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;