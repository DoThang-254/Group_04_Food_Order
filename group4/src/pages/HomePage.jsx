import React, { useEffect, useState, useMemo, useContext, useRef } from 'react';
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
import HomeCarousel from '../components/HomeCarousel';
import { themeContext } from '../context/ThemeContext';
import SortBar from '../components/SortBar';
import Footer from '../components/Footer';
const HomePage = () => {
  const [sortOption, setSortOption] = useState("default");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idUser, setIdUser] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { theme } = useContext(themeContext);
  const pageSize = 9;
  const sectionRef = useRef();

  const nav = useNavigate();
  const { token } = useContext(loginContext);

  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

   const handleScrollToContent = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

    useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        const storesResponse = await getAllStores();
        const productsResponse = await getAllProducts();

        setCategories(categoriesResponse);
        setStores(storesResponse);

        const categoryMap = new Map(categoriesResponse.map(item => [(item.id), item]));
        const storeMap = new Map(storesResponse.map(item => [(item.id), item]));

       const mappedProducts = productsResponse.map(product => {
  const store = storeMap.get(String(product.storeId));
  const category = categoryMap.get(String(product.categoryId));
  
  return {
    ...product,
    storeName: store?.name,
    storeImg: store?.img,
    categoryName: category?.name
  };
});

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi fetch api", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
  let sorted = [...filteredProducts];
  if (sortOption === "asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    sorted.sort((a, b) => b.price - a.price);
  }
  setFilteredProducts(sorted);
}, [sortOption]);


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
      
      productId: (product.id),
      storeId: (product.storeId),
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
    <>
    


    <HomeCarousel onClickButton={handleScrollToContent}/>
    
    
    <Container fluid ref={sectionRef}>
      {/* Nút mở Drawer */}

      <AntButton
        icon={<MenuOutlined />}
        type="primary"
        style={{ margin: '16px' }}
        onClick={() => setDrawerVisible(true)}
      >
        Menu
      </AntButton>
      <div><SortBar sortOption={sortOption} setSortOption={setSortOption} /></div>

      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className={theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}
        bodyStyle={{
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
          color: theme === 'dark' ? 'white' : 'black'
        }}
        headerStyle={{
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
          color: theme === 'dark' ? 'white' : 'black'
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedCategoryId]}
          onClick={(e) => handleCategoryClick(e.key)}
          theme={theme}
          style={{
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
        >
          <Menu.Item
            key="all"
            style={{
              color: theme === 'dark' ? '#fff' : '#000',
              backgroundColor: selectedCategoryId === 'all'
                ? theme === 'dark' ? '#f44336' : '#f0f0f0'
                : 'transparent',
            }}
          >
            All
          </Menu.Item>
          {uniqueCategories.map((cat) => (
            <Menu.Item
              key={cat.name}
              style={{
                color: theme === 'dark' ? '#fff' : '#000',
                backgroundColor: selectedCategoryId === cat.name
                  ? theme === 'dark' ? '#f44336' : '#f0f0f0'
                  : 'transparent',
              }}
            >
              {cat.name}
            </Menu.Item>
          ))}
        </Menu>

      </Drawer>


      {/* Sản phẩm */}
      <Row>
        {paginatedProducts.map((product) => (
          <Col key={product.id} sm={6} md={4} className="mb-4">
            <Card className={theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}>
              <Card.Img variant="top" src={product.img} onClick={() => handleViewDetail(product.id)} style={{ cursor: "pointer" }} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text style={{ color: theme === 'dark' ? 'white' : 'black' }}
                >Price: ${product.price}</Card.Text>
                <Card.Text style={{
                  color: theme === 'dark' ? 'white' : 'black'
                }}>Category: {product.categoryName || "Unknown"}</Card.Text>
                <Card.Text>
                  <Image
                    src={product.storeImg}
                    roundedCircle
                    style={{
                      width: '30px', height: '30px', cursor: 'pointer', marginRight: '8px'
                    }}
                    onClick={() => handleShopDetail(product.storeId)}
                  />
                  <span onClick={() => handleShopDetail(product.storeId)} style={{
                    cursor: "pointer",
                    color: theme === 'dark' ? 'white' : 'black'
                  }} > {product.storeName || "Unknown"}</span>
                </Card.Text>
                <Button type="button" onClick={() => handleAddToCart(product)} className="me-2">Add to Cart</Button>
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
        className={theme === 'dark' ? 'pagination-dark' : 'pagination-light'}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </Container>
    <div className='footer'> <Footer/></div>
   
    </>
  );
};

export default HomePage;
