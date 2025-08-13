import React, { useEffect, useState, useMemo, useContext, useRef } from "react";
import { getAllProducts } from "../services/products";
import { getAllCategories } from "../services/categories";
import { getAllStores } from "../services/stores";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useCartStore } from "../stores/stores";
import { useNavigate } from "react-router-dom";
import { Pagination, Drawer, Menu, Button as AntButton } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { loginContext } from "../context/LoginContext";
import "./customerstyle/HomePage.css";
import HomeCarousel from "../components/HomeCarousel";
import { themeContext } from "../context/ThemeContext";
import SortBar from "../components/SortBar";
import Footer from "../components/Footer";
import { Rate } from "antd";


const HomePage = () => {
  const [sortOption, setSortOption] = useState("default");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { theme } = useContext(themeContext);
  const { token } = useContext(loginContext);
  const nav = useNavigate();
  const pageSize = 9;
  const sectionRef = useRef();

  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // Scroll tới nội dung
  const handleScrollToContent = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch giỏ hàng nếu đã đăng nhập
  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, storesRes, productsRes] = await Promise.all([
          getAllCategories(),
          getAllStores(),
          getAllProducts(),
        ]);

        setCategories(categoriesRes);
        setStores(storesRes);

        const categoryMap = new Map(categoriesRes.map((c) => [String(c.id), c]));
        const storeMap = new Map(storesRes.map((s) => [String(s.id), s]));

        const mappedProducts = productsRes.map((p) => {
          // Lấy dữ liệu rating từ localStorage
          const ratingData =
            JSON.parse(localStorage.getItem(`rating-product-${p.id}`)) || {
              totalScore: 0,
              voteCount: 0,
            };
          const avgRating =
            ratingData.voteCount > 0
              ? ratingData.totalScore / ratingData.voteCount
              : 0;

          return {
            ...p,
            storeName: storeMap.get(String(p.storeId))?.storeName || "Unknown",
            storeImg: storeMap.get(String(p.storeId))?.img || "",
            categoryName: categoryMap.get(String(p.categoryId))?.name || "Unknown",
            avgRating, // ⭐ lưu rating trung bình
          };
        });

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Lỗi fetch API:", err);
      }
    };

    fetchData();
  }, []);


  // Lọc + Sắp xếp
  useEffect(() => {
    let result = [...products];

    // Lọc theo category
    if (selectedCategoryId !== "all") {
      result = result.filter((p) => String(p.categoryId) === String(selectedCategoryId));
    }

    // Lọc theo search
    if (searchTerm.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (sortOption === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, selectedCategoryId, searchTerm, sortOption]);

  // Lấy sản phẩm theo trang
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  // Danh mục unique
  const uniqueCategories = categories.filter(
    (cat, index, self) => self.findIndex((c) => c.id === cat.id) === index
  );

  // Thêm vào giỏ
  const handleAddToCart = (product) => {
    if (!token) {
      alert("Please log in to add to cart.");
      nav("/login");
      return;
    }
    addToCart({ productId: product.id, storeId: product.storeId, quantity: 1 });
  };

  return (
    <>
      <HomeCarousel onClickButton={handleScrollToContent} />

      <Container fluid ref={sectionRef}>
        {/* Nút mở Drawer */}
        <AntButton
          icon={<MenuOutlined />}
          type="primary"
          style={{ margin: "16px" }}
          onClick={() => setDrawerVisible(true)}
        >
          Menu
        </AntButton>

        {/* Thanh tìm kiếm */}
        <input
          type="text"
          placeholder="Search product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            margin: "16px 0",
            width: "100%",
            maxWidth: "300px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          }}
        />

        <SortBar sortOption={sortOption} setSortOption={setSortOption} />

        {/* Drawer category */}
        <Drawer
          title="Categories"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "white" : "black",
          }}
          headerStyle={{
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "white" : "black",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[String(selectedCategoryId)]}
            onClick={(e) => {
              setSelectedCategoryId(e.key);
              setDrawerVisible(false);
            }}
            theme={theme}
            style={{
              backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            <Menu.Item
              key="all"
              style={{
                color: theme === "dark" ? "#fff" : "#000",
                backgroundColor:
                  selectedCategoryId === "all"
                    ? theme === "dark"
                      ? "#f44336"
                      : "#f0f0f0"
                    : "transparent",
              }}
            >
              All
            </Menu.Item>
            {uniqueCategories.map((cat) => (
              <Menu.Item
                key={String(cat.id)}
                style={{
                  color: theme === "dark" ? "#fff" : "#000",
                  backgroundColor:
                    String(selectedCategoryId) === String(cat.id)
                      ? theme === "dark"
                        ? "#f44336"
                        : "#f0f0f0"
                      : "transparent",
                }}
              >
                {cat.name}
              </Menu.Item>
            ))}
          </Menu>
        </Drawer>

        {/* Danh sách sản phẩm */}
        <Row>
          {paginatedProducts.map((product) => (
            <Col key={product.id} sm={6} md={4} className="mb-4">
              <Card
                className={
                  theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
                }
              >
                <Card.Img
                  variant="top"
                  src={product.img}
                  onClick={() => nav(`/food/${product.id}/detail`)}
                  style={{ cursor: "pointer" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <Rate disabled allowHalf value={product.avgRating} />
                    <span style={{ marginLeft: "8px" }}>
                      {product.avgRating > 0 ? product.avgRating.toFixed(1) : "No rating"}
                    </span>
                  </Card.Text>

                  <Card.Text>Price: ${product.price}</Card.Text>
                  <Card.Text>Category: {product.categoryName}</Card.Text>
                  <Card.Text>
                    <Image
                      src={product.storeImg}
                      roundedCircle
                      style={{
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                      onClick={() => nav(`/shop/${product.storeId}/detail`)}
                    />
                    <span
                      onClick={() => nav(`/shop/${product.storeId}/detail`)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.storeName}
                    </span>
                  </Card.Text>
                  <Button onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Phân trang */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </Container>

      <Footer />
    </>
  );
};

export default HomePage;
