import React, { useEffect, useState, useMemo, useContext } from 'react';
import { getAllProducts } from '../services/products';
import { getAllCategories } from '../services/categories';
import { getAllStores } from '../services/stores';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useCartStore } from '../stores/stores';
import { useNavigate } from 'react-router-dom';
import { Pagination, Drawer, Menu, Button as AntButton } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { loginContext } from '../context/LoginContext';
import './customerstyle/HomePage.css';
import { decodeFakeToken } from '../data/token';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idUser, setIdUser] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const pageSize = 9;

  const nav = useNavigate();
  const { token } = useContext(loginContext);

  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      if (info) setIdUser(info.id);
    };
    decode();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        const storesResponse = await getAllStores();
        const productsResponse = await getAllProducts();

        setCategories(categoriesResponse);
        setStores(storesResponse);

        const categoryMap = new Map(categoriesResponse.map(item => [Number(item.id), item.name]));
        const storeNameMap = new Map(storesResponse.map(item => [Number(item.id), item.name]));
        const storeImgMap = new Map(storesResponse.map(item => [Number(item.id), item.img]));

        const mappedProducts = productsResponse.map(product => ({
          ...product,
          storeName: storeNameMap.get(product.storeId),
          categoryName: categoryMap.get(product.categoryId),
          storeImg: storeImgMap.get(product.storeId)
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

    setCurrentPage(1);

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
    if (!token) {
      alert("Please log in to add to cart.");
      nav('/login');
      return;
    }
    const item = {
      userId: idUser,
      productId: Number(product.id),
      storeId: Number(product.storeId),
      quantity: 1
    };
    addToCart(item);
  };

  const handleViewDetail = (id) => nav(`/food/${id}/detail`);
  const handleShopDetail = (id) => nav(`/shop/${id}/detail`);

  const handleCategoryClick = (name) => {
    setSelectedCategoryId(name);
    setDrawerVisible(false);
  };

  return (
    <Container fluid>
      {/* Nút mở Drawer */}
      <AntButton
        icon={<MenuOutlined />}
        type="primary"
        style={{ margin: '16px' }}
        onClick={() => setDrawerVisible(true)}
      >
        Menu
      </AntButton>

      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedCategoryId]}
          onClick={(e) => handleCategoryClick(e.key)}
        >
          <Menu.Item key="all">All</Menu.Item>
          {uniqueCategories.map((cat) => (
            <Menu.Item key={cat.name}>{cat.name}</Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Sản phẩm */}
      <Row>
        {paginatedProducts.map((product) => (
          <Col key={product.id} sm={6} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={product.img} onClick={() => handleViewDetail(product.id)} style={{cursor:"pointer"}} />
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
              <span  onClick={() => handleShopDetail(product.storeId)} style={{cursor:"pointer"}} > {product.storeName || "Unknown"}</span>   
                </Card.Text>
                <Button onClick={() => handleAddToCart(product)} className="me-2">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredProducts.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </Container>
  );
};

export default HomePage;
