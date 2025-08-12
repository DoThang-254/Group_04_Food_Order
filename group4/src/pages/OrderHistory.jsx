import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { decodeFakeToken } from '../data/token';
import { getOrdersByUserId } from '../services/orders';
import { Button, Card, Col, Container, Row, Spinner, Table, Pagination } from 'react-bootstrap';
import './customerstyle/OrderHistory.css'; // Import CSS file

const OrderHistory = () => {
    const { token } = useContext(loginContext);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [expanded, setExpanded] = useState({});

    // state phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // số đơn hàng mỗi trang

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                const res = await getOrdersByUserId(info.id);
                setOrders(res);
            }
            setLoading(false);
        };
        decode();
    }, [token]);

    if (loading) {
        return (
            <div className="loading-container d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" className="loading-spinner" />
            </div>
        );
    }

    const toggleExpand = (orderId) => {
        setExpanded((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // Function to get status class
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            case 'processing':
                return 'status-processing';
            default:
                return 'status-pending';
        }
    };

    // Tính toán dữ liệu hiển thị cho trang hiện tại
    const indexOfLastOrder = currentPage * pageSize;
    const indexOfFirstOrder = indexOfLastOrder - pageSize;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Tổng số trang
    const totalPages = Math.ceil(orders.length / pageSize);

    // Render nút phân trang
    const renderPagination = () => {
        let items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return (
            <Pagination className="mt-3 justify-content-center">{items}</Pagination>
        );
    };

    return (
        <div className="order-history-container">
            <Container className="mt-5">
                <Row>
                    <Col md={12}>
                        <Card className="order-card shadow">
                            <Card.Header className="card-header-red">
                                <i className="fas fa-shopping-cart me-2"></i>
                                Lịch Sử Đơn Hàng
                            </Card.Header>
                            <Card.Body>
                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="icon">📦</div>
                                        <h3>Chưa có đơn hàng nào</h3>
                                        <p>Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                                    </div>
                                ) : (
                                    <>
                                        <Table className="order-table" hover>
                                            <thead>
                                                <tr>
                                                    <th>Mã Đơn Hàng</th>
                                                    <th>Trạng Thái</th>
                                                    <th className="d-none d-md-table-cell">Tổng Tiền</th>
                                                    <th>Thao Tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentOrders.map((order) => (
                                                    <React.Fragment key={order.id}>
                                                        <tr>
                                                            <td>
                                                                <span className="order-id">#{order.id}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`order-status ${getStatusClass(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="d-none d-md-table-cell">
                                                                <span className="order-total price-highlight">
                                                                    ${order.total}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    size="sm"
                                                                    className={`btn-detail ${expanded[order.id] ? "btn-detail-secondary" : "btn-detail-primary"}`}
                                                                    onClick={() => toggleExpand(order.id)}
                                                                >
                                                                    {expanded[order.id] ? (
                                                                        <>
                                                                            <i className="fas fa-eye-slash me-1"></i>
                                                                            Ẩn Chi Tiết
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <i className="fas fa-eye me-1"></i>
                                                                            Xem Chi Tiết
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </td>
                                                        </tr>

                                                        {expanded[order.id] && (
                                                            <tr className="expanded-row">
                                                                <td colSpan="4">
                                                                    <div className="p-3">
                                                                        <h6 className="mb-3 text-danger fw-bold">
                                                                            <i className="fas fa-list me-2"></i>
                                                                            Chi Tiết Đơn Hàng #{order.id}
                                                                        </h6>
                                                                        <Table className="detail-table" size="sm">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Sản Phẩm</th>
                                                                                    <th>Giá</th>
                                                                                    <th>Số Lượng</th>
                                                                                    <th>Thành Tiền</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {order.items.map((item) => (
                                                                                    <tr key={item.id}>
                                                                                        <td>
                                                                                            <div className="d-flex align-items-center">
                                                                                                <i className="fas fa-box me-2 text-danger"></i>
                                                                                                {item.name}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td>
                                                                                            <span className="price-highlight">
                                                                                                ${item.price}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td>
                                                                                            <span className="badge bg-secondary">
                                                                                                {item.quantity}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td>
                                                                                            <strong className="price-highlight">
                                                                                                ${(item.price * item.quantity).toFixed(2)}
                                                                                            </strong>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                        <div className="text-end mt-3">
                                                                            <h6 className="mb-0">
                                                                                <span className="text-muted">Tổng cộng: </span>
                                                                                <span className="price-highlight fs-5 fw-bold">
                                                                                    ${order.total}
                                                                                </span>
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </Table>

                                        {totalPages > 1 && renderPagination()}
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderHistory;