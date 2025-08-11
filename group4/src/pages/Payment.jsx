import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { decodeFakeToken } from '../data/token';
import { getOrders } from '../services/orders';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import './customerstyle/Payment.css'; // Import CSS file

const Payment = () => {
    const { token } = useContext(loginContext);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState();
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                if (!param.id) {
                    navigate("/home");
                    return;
                }
                setUser(info);
                const res = await getOrders(param.id);
                setOrder(res);
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

    return (
         <div className="payment-page">
        <Container className="mt-5">
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow">
                        <Card.Header className="bg-primary text-white">Customer Information</Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Gender:</strong> {user.gender}</p>
                            <p><strong>Birth Date:</strong> {user.birthDate}</p>
                            <p><strong>Address:</strong> {user.address}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-success text-white">Order Summary</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
               P                         <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>${item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <h5 className="text-end">Total: <strong>${order?.total}</strong></h5>
                            <div style={{ textAlign: 'center' }}>
                                <div className="qr-section">
                                <p>Scan right here</p>
                                <img src="data:image/png;base64,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" alt="" />
                            </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default Payment;
