import React from "react";
import { Card, Row, Col, Table, Badge } from "react-bootstrap";
import "./styles/OwnerOverview.css";

const OwnerOverview = ({ store, products, orders, staff }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const activeProducts = products.length;
  const activeStaff = staff.filter((s) => s.active).length;

  // Recent orders (latest 5)
  const recentOrders = orders.slice(0, 5);

  // Top selling products (mock data for demonstration)
  const topProducts = products.slice(0, 3);

  return (
    <div className="owner-overview">
      <div className="overview-header">
        <h3>Tổng quan cửa hàng</h3>
        <p className="text-muted">Thống kê tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card revenue-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">💰</div>
                <div className="stat-details">
                  <h4>${totalRevenue.toFixed(2)}</h4>
                  <p>Tổng doanh thu</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card orders-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">📦</div>
                <div className="stat-details">
                  <h4>{orders.length}</h4>
                  <p>Tổng đơn hàng</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card products-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">🍕</div>
                <div className="stat-details">
                  <h4>{activeProducts}</h4>
                  <p>Sản phẩm</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card staff-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">👥</div>
                <div className="stat-details">
                  <h4>{activeStaff}</h4>
                  <p>Nhân viên</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Status Overview */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="status-overview-card">
            <Card.Header>
              <h5>📊 Trạng thái đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="status-item">
                <span className="status-label">Đang chờ xử lý:</span>
                <Badge bg="warning">{pendingOrders}</Badge>
              </div>
              <div className="status-item">
                <span className="status-label">Đã hoàn thành:</span>
                <Badge bg="success">{completedOrders}</Badge>
              </div>
              <div className="status-item">
                <span className="status-label">Tổng đơn hàng:</span>
                <Badge bg="primary">{orders.length}</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="store-info-card">
            <Card.Header>
              <h5>🏪 Thông tin cửa hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="store-info-item">
                <strong>Tên cửa hàng:</strong> {store?.storeName}
              </div>
              <div className="store-info-item">
                <strong>Địa chỉ:</strong> {store?.storeAddress}
              </div>
              <div className="store-info-item">
                <strong>Trạng thái:</strong>{" "}
                <Badge bg={store?.state ? "success" : "warning"}>
                  {store?.state ? "Hoạt động" : "Chờ duyệt"}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders & Top Products */}
      <Row>
        <Col lg={8}>
          <Card className="recent-orders-card">
            <Card.Header>
              <h5>📋 Đơn hàng gần đây</h5>
            </Card.Header>
            <Card.Body>
              {recentOrders.length === 0 ? (
                <p className="text-muted text-center">Chưa có đơn hàng nào</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Mã ĐH</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <Badge
                            bg={
                              order.status === "pending"
                                ? "warning"
                                : order.status === "completed"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {order.status === "pending"
                              ? "Chờ xử lý"
                              : order.status === "completed"
                              ? "Hoàn thành"
                              : order.status}
                          </Badge>
                        </td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="top-products-card">
            <Card.Header>
              <h5>🏆 Sản phẩm nổi bật</h5>
            </Card.Header>
            <Card.Body>
              {topProducts.length === 0 ? (
                <p className="text-muted text-center">Chưa có sản phẩm nào</p>
              ) : (
                <div className="top-products-list">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <div className="product-rank">#{index + 1}</div>
                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">${product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OwnerOverview;
