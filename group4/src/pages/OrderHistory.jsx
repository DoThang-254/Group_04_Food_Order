import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { decodeFakeToken } from '../data/token';
import { getOrdersByUserId } from '../services/orders';
import { Button, Card, Col, Container, Row, Spinner, Table } from 'react-bootstrap';

const OrderHistory = () => {
    const { token } = useContext(loginContext);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState();
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                setUser(info);
                const res = await getOrdersByUserId(info.id);
                setOrders(res);
            }
            setLoading(false);
        };
        decode();
    }, [token]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    console.log(orders)

    const toggleExpand = (orderId) => {
        setExpanded((prev) => ({
            ...prev,
            [orderId]: !prev[orderId], // đảo trạng thái ẩn/hiện cho order đó
        }));
    };
    return (
        <Container className="mt-5">
            <Row>
                <Col md={8}>
                    <Card className="shadow">
                        <Card.Header className="bg-success text-white">
                            Order Summary
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            {/* Hàng thông tin đơn hàng */}
                                            <tr>
                                                <td>{order.id}</td>
                                                <td>{order.status}</td>
                                                <td>${order.total}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant={expanded[order.id] ? "secondary" : "primary"}
                                                        onClick={() => toggleExpand(order.id)}
                                                    >
                                                        {expanded[order.id] ? "Ẩn chi tiết" : "Xem chi tiết"}
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* Hàng chi tiết sản phẩm */}
                                            {expanded[order.id] && (
                                                <tr>
                                                    <td colSpan="4">
                                                        <Table striped bordered size="sm" className="mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Item</th>
                                                                    <th>Price</th>
                                                                    <th>Quantity</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.items.map((item) => (
                                                                    <tr key={item.id}>
                                                                        <td>{item.name}</td>
                                                                        <td>${item.price}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderHistory;