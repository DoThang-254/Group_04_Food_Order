import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/products';
import { getAllCategories } from '../services/categories';
import { ListGroup, Card, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);

        const productsResponse = await getAllProducts();
        const categoryMap = new Map(categoriesResponse.map(item => [Number(item.id), item.name]));

        const mappedProducts = productsResponse.map(product => ({
          ...product,
          categoryId: categoryMap.get(product.categoryId), // category name
          price: product.price,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi fetch api");
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    let filtered = [...products];
    if (selectedCategoryId !== "all") {
      filtered = filtered.filter(p => p.categoryId === selectedCategoryId);
    }
    setFilteredProducts(filtered);
  }, [selectedCategoryId, products]);

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
                active={selectedCategoryId === cat.name}
                onClick={() => setSelectedCategoryId(cat.name)}
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
                    <Card.Text>Category: {product.categoryId || "Unknown"}</Card.Text>
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
