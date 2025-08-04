import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Container, Row, Col } from "react-bootstrap";
import { loginContext } from "../context/LoginContext";
import db from "../data/db.json";
import { Navigate } from "react-router-dom";
import { decodeFakeToken } from "../data/token";
const OwnerDashboard = () => {
  const { token } = useContext(loginContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decode = async () => {
      const info = await decodeFakeToken(token);
      if (info) {
        setUser(info);
      }
      setLoading(false);
    };
    decode();
  }, [token]);

  useEffect(() => {
    if (user && user?.role === "owner") {
      const storeData = db.stores.find((s) => s?.ownerId === user?.id);
      setStore(storeData);

      const storeProducts = db.products.filter(
        (p) => p.storeId == Number(storeData.id)
      );
      setProducts(storeProducts);

      const storeOrders = db.orders
        .map((x) => {
          const filteredItems = x.items.filter(
            (item) => item.storeId == storeData.id
          );


          if (filteredItems.length > 0) {
            const total = filteredItems.reduce((sum, item) => {
              const product = db.products.find((p) => p.id == item.productId);
              return sum + (product ? product.price * item.quantity : 0);
            }, 0);

            return {
              ...x,
              items: filteredItems,
              total
            };
          }

          return null;
        })
        .filter(Boolean);

      setOrders(storeOrders);

    }
  }, [user]);

  if (loading) return null;

  if (!user || user?.role !== "owner") {
    return <Navigate to="/" replace />;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Container className="my-4">
      <h2 className="mb-4">Owner Dashboard</h2>

      {store && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Store Info</Card.Title>
            <Card.Text>
              <strong>Name:</strong> {store.name}
            </Card.Text>
            <Card.Text>
              <strong>Address:</strong> {store.address}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <h3>{orders.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <h3>${totalRevenue.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Product List</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.name}</td>
                  <td>${prod.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Recent Orders</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OwnerDashboard;
