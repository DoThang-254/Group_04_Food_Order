import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { loginContext } from "../context/LoginContext";
import { Navigate } from "react-router-dom";
import { decodeFakeToken } from "../data/token";

// 👉 Import từ services
import { getStoreByOwnerId } from "../services/stores";
import { getProductsByStoreId, addProduct } from "../services/products";
import { getOrders } from "../services/orders";

const OwnerDashboard = () => {
  const { token } = useContext(loginContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
    img: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const info = await decodeFakeToken(token);
      if (!info || info.role !== "owner") return setLoading(false);
      setUser(info);

      try {
        const store = await getStoreByOwnerId(info.id);
        if (!store) return setLoading(false);
        setStore(store);

        const [products, allOrders] = await Promise.all([
          getProductsByStoreId(store.id),
          getOrders(),
        ]);

        setProducts(products);

        const relevantOrders = allOrders
          .map((order) => {
            const items = order.items.filter(
              (item) => item.storeId == store.id
            );
            if (!items.length) return null;

            const total = items.reduce((sum, item) => {
              const prod = products.find((p) => p.id == item.productId);
              return sum + (prod ? prod.price * item.quantity : 0);
            }, 0);

            return { ...order, items, total };
          })
          .filter(Boolean);

        setOrders(relevantOrders);
      } catch (err) {
        console.log("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "owner") return <Navigate to="/" replace />;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const newProd = {
      id: crypto.randomUUID(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      img: newProduct.img || "",
      categoryId: parseInt(newProduct.categoryId) || 1,
      storeId: store.id,
    };

    try {
      const saved = await addProduct(newProd);
      setProducts((prev) => [...prev, saved]);
      setNewProduct({ name: "", price: "", categoryId: "", img: "" });
      setShowAddForm(false);
    } catch (err) {
      alert("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Owner Dashboard</h2>

      {store && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Store Info</Card.Title>
            <p>
              <strong>Name:</strong> {store.name}
            </p>
            <p>
              <strong>Address:</strong> {store.storeAddress}
            </p>
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Product List</Card.Title>
            <Button onClick={() => setShowAddForm(true)}>Add Product</Button>
          </div>

          {showAddForm && (
            <Form onSubmit={handleAddProduct} className="mb-4">
              <Row>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.img}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, img: e.target.value })
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={newProduct.categoryId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        categoryId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Category</option>
                    <option value="1">Pizza</option>
                    <option value="2">Drinks</option>
                    <option value="3">Burgers</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button type="submit" className="w-100" variant="success">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          )}

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
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
