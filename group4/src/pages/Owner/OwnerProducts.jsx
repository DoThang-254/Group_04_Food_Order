import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
} from "react-bootstrap";
import "./styles/OwnerProducts.css";

const OwnerProducts = ({
  products,
  store,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img: "",
    categoryId: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoryId.toString() === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        img: product.img || "",
        categoryId: product.categoryId.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        img: "",
        categoryId: categories.length > 0 ? categories[0].id.toString() : "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      img: "",
      categoryId: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    } else {
      onAddProduct(productData);
    }
    handleCloseModal();
  };

  const handleDelete = (productId, productName) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)
    ) {
      onDeleteProduct(productId);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    console.log(categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="owner-products">
      <div className="products-header">
        <h3>Quản lý sản phẩm</h3>
        <p className="text-muted">Quản lý menu và sản phẩm của cửa hàng</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                onClick={() => {
                  if (!store.state) {
                    setShowWarningModal(true);
                    return;
                  }
                  handleShowModal();
                }}
                className="w-100"
              >
                ➕ Thêm sản phẩm
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Products Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">{products.length}</h4>
              <p className="stat-label">Tổng sản phẩm</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">
                {new Set(products.map((p) => p.categoryId)).size}
              </h4>
              <p className="stat-label">Danh mục</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">
                ${Math.min(...(products.map((p) => p.price) || [0])).toFixed(2)}
              </h4>
              <p className="stat-label">Giá thấp nhất</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">
                ${Math.max(...(products.map((p) => p.price) || [0])).toFixed(2)}
              </h4>
              <p className="stat-label">Giá cao nhất</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Table */}
      <Card>
        <Card.Header>
          <h5>📋 Danh sách sản phẩm ({filteredProducts.length})</h5>
        </Card.Header>
        <Card.Body>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-4">
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h5>Không có sản phẩm nào</h5>
                <p className="text-muted">
                  {searchTerm || selectedCategory
                    ? "Không tìm thấy sản phẩm phù hợp với bộ lọc"
                    : "Hãy thêm sản phẩm đầu tiên cho cửa hàng của bạn"}
                </p>
                {!searchTerm && !selectedCategory && (
                  <Button variant="primary" onClick={() => handleShowModal()}>
                    Thêm sản phẩm đầu tiên
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-image">
                        {product.img ? (
                          <img src={product.img} alt={product.name} />
                        ) : (
                          <div className="no-image">📷</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="product-name">{product.name}</div>
                    </td>
                    <td>
                      <Badge bg="secondary">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </td>
                    <td>
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(product)}
                          className="me-2"
                        >
                          ✏️ Sửa
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          🗑️ Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục *</Form.Label>
                  <Form.Select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh (URL)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.img}
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
              />
              <Form.Text className="text-muted">
                Nhập URL hình ảnh sản phẩm (không bắt buộc)
              </Form.Text>
            </Form.Group>

            {formData.img && (
              <div className="image-preview">
                <Form.Label>Xem trước:</Form.Label>
                <div className="preview-container">
                  <img
                    src={formData.img}
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="preview-error" style={{ display: "none" }}>
                    ❌ Không thể tải hình ảnh
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? "Cập nhật" : "Thêm sản phẩm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Warning Modal */}
      <Modal
        show={showWarningModal}
        onHide={() => setShowWarningModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Không thể thêm sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Cửa hàng của bạn hiện đang <strong>tạm ngưng hoạt động</strong> nên
          không thể thêm sản phẩm mới.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowWarningModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OwnerProducts;
