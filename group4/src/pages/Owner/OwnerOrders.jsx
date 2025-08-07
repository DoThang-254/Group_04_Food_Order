import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import "./styles/OwnerOrders.css";

const OwnerOrders = ({ orders, products, onUpdateOrderStatus }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.userId.toString().includes(searchTerm);

    let matchesDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.createdAt).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      matchesDate = orderDate === filterDate;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng?`)) {
      onUpdateOrderStatus(orderId, newStatus);
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.price : 0;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "preparing":
        return "info";
      case "ready":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "preparing":
        return "Đang chuẩn bị";
      case "ready":
        return "Sẵn sàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="owner-orders">
      <div className="orders-header">
        <h3>Quản lý đơn hàng</h3>
        <p className="text-muted">Theo dõi và xử lý đơn hàng của cửa hàng</p>
      </div>

      {/* Order Statistics */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4 className="stat-number">{totalOrders}</h4>
              <p className="stat-label">Tổng đơn hàng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card pending-card">
            <Card.Body className="text-center">
              <h4 className="stat-number text-warning">{pendingOrders}</h4>
              <p className="stat-label">Chờ xử lý</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card completed-card">
            <Card.Body className="text-center">
              <h4 className="stat-number text-success">{completedOrders}</h4>
              <p className="stat-label">Hoàn thành</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card cancelled-card">
            <Card.Body className="text-center">
              <h4 className="stat-number text-danger">{cancelledOrders}</h4>
              <p className="stat-label">Đã hủy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={8} sm={12} className="mb-3">
          <Card className="stat-card revenue-card">
            <Card.Body className="text-center">
              <h4 className="stat-number text-primary">
                ${totalRevenue.toFixed(2)}
              </h4>
              <p className="stat-label">Doanh thu (Đã hoàn thành)</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="preparing">Đang chuẩn bị</option>
                <option value="ready">Sẵn sàng</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setStatusFilter("");
                  setDateFilter("");
                  setSearchTerm("");
                }}
                className="w-100"
              >
                🔄 Đặt lại bộ lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card>
        <Card.Header>
          <h5>📋 Danh sách đơn hàng ({filteredOrders.length})</h5>
        </Card.Header>
        <Card.Body>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-4">
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h5>Không có đơn hàng nào</h5>
                <p className="text-muted">
                  {statusFilter || dateFilter || searchTerm
                    ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                    : "Chưa có đơn hàng nào từ khách hàng"}
                </p>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-id">ID: {order.userId}</div>
                      </div>
                    </td>
                    <td>
                      <div className="order-items">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="item-summary">
                            {getProductName(item.productId)} x{item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <small className="text-muted">
                            +{order.items.length - 2} sản phẩm khác
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong className="order-total">
                        ${order.total.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td>
                      <div className="order-time">
                        <div>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleViewOrderDetail(order)}
                          className="me-2 mb-1"
                        >
                          👁️ Xem
                        </Button>

                        {order.status === "pending" && (
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="preparing">Bắt đầu chuẩn bị</option>
                            <option value="cancelled">Hủy đơn</option>
                          </Form.Select>
                        )}

                        {order.status === "preparing" && (
                          <Form.Select
                            size="sm"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="preparing">Đang chuẩn bị</option>
                            <option value="ready">Sẵn sàng</option>
                            <option value="cancelled">Hủy đơn</option>
                          </Form.Select>
                        )}

                        {order.status === "ready" && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(order.id, "completed")
                            }
                          >
                            ✅ Hoàn thành
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        show={showOrderDetail}
        onHide={() => setShowOrderDetail(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="order-detail">
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Thông tin đơn hàng</h6>
                  <p>
                    <strong>Mã đơn hàng:</strong> #{selectedOrder.id}
                  </p>
                  <p>
                    <strong>Khách hàng ID:</strong> {selectedOrder.userId}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <Badge bg={getStatusBadgeVariant(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Thời gian</h6>
                  <p>
                    <strong>Đặt hàng:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    <strong className="text-primary">
                      ${selectedOrder.total.toFixed(2)}
                    </strong>
                  </p>
                </Col>
              </Row>

              <h6>Sản phẩm đặt hàng</h6>
              <Table striped>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{getProductName(item.productId)}</td>
                      <td>${getProductPrice(item.productId).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        $
                        {(
                          getProductPrice(item.productId) * item.quantity
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderDetail(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OwnerOrders;
