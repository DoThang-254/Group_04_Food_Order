import React, { useEffect, useState, useMemo } from 'react';
import { getAllProducts } from '../services/products';
import { getAllCategories } from '../services/categories';
import { getAllStores } from '../services/stores';
import { ListGroup, Card, Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useCartStore } from '../stores/stores';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const addToCart = useCartStore((state) => state.addToCart);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);

        const storesResponse = await getAllStores();
        setStores(storesResponse);

        const productsResponse = await getAllProducts();

        const categoryMap = new Map(categoriesResponse.map(item => [Number(item.id), item.name]));
        const storeMap = new Map(storesResponse.map(item => [Number(item.id), item.name]));
        const categoryStoreMap = new Map(categoriesResponse.map(item => [Number(item.id), item.storeId]));
        const storeImgMap = new Map(storesResponse.map(item => [Number(item.id), item.img]));

        const mappedProducts = productsResponse.map(product => ({
          ...product,
          categoryName: categoryMap.get(product.categoryId),
          storeName: storeMap.get(categoryStoreMap.get(product.categoryId)) || "Unknown",
          storeId: categoryStoreMap.get(product.categoryId),
          storeImg: storeImgMap.get(categoryStoreMap.get(product.categoryId)) || "Unknown",
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
    setCurrentPage(1); // Reset về trang đầu mỗi khi filter
  }, [selectedCategoryId, products]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const uniqueCategories = categories.filter(
    (cat, index, self) =>
      self.findIndex(c => c.name === cat.name) === index
  );

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleViewDetail = (id) => {
    nav(`/food/${id}/detail`);
  };

  const handleShopDetail = (id) => {
    nav(`/shop/${id}/detail`);
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
            {paginatedProducts.map((product) => (
              <Col key={product.id} sm={6} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={product.img} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Card.Text>Category: {product.categoryName || "Unknown"}</Card.Text>
                    <Card.Text>
                      <Image
                        src={product.storeImg}
                        roundedCircle
                        style={{ width: '30px', height: '30px', cursor: 'pointer', marginRight: '8px' }}
                        onClick={() => handleShopDetail(product.storeId)}
                      />
                      {product.storeName || "Unknown"}
                    </Card.Text>
                    <Button onClick={() => handleAddToCart(product)} className="me-2">Add to Cart</Button>
                    <Button onClick={() => handleViewDetail(product.id)} variant="secondary">View Detail</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination Component */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProducts.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: 'center', marginTop: '20px' }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
