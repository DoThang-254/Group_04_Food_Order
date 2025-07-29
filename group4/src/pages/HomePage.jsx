import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/products';
import { getAllCategories } from '../services/categories';
import { ListGroup, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useCartStore } from '../stores/stores';
import { getAllStores } from '../services/stores';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores,setStores] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);
        const storesResponse = await getAllStores();
        setStores(storesResponse)
        const productsResponse = await getAllProducts();
        const categoryMap = new Map(categoriesResponse.map(item => [Number(item.id), item.name]));
        const storeMap = new Map(storesResponse.map(item => [Number(item.id),item.name]))
        const categoryStoreMap = new Map(categoriesResponse.map(item => [Number(item.id), item.storeId]));

        const mappedProducts = productsResponse.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId),
  storeName: storeMap.get(categoryStoreMap.get(product.categoryId)) || "Unknown",
          price: product.price,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi fetch api", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (selectedCategoryId !== "all") {
      filtered = filtered.filter(p => p.categoryName === selectedCategoryId);
    }
    setFilteredProducts(filtered);
  }, [selectedCategoryId, products]);

  const uniqueCategories = categories.filter(
    (cat, index, self) =>
      self.findIndex(c => c.name === cat.name) === index
  );

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

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

            {uniqueCategories.map((cat) => (
              <ListGroup.Item
                key={cat.name}
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
                    <Card.Text>Category: {product.categoryName || "Unknown"}</Card.Text>
                    <Card.Text>Store: {product.storeName || "Unknown"}</Card.Text>
                    <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
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
