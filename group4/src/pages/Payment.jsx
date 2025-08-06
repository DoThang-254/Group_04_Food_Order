import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { decodeFakeToken } from '../data/token';
import { getOrders } from '../services/orders';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';

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
                                        <th>Item</th>
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Payment;
