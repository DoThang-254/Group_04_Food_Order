import React, { useEffect, useState } from "react";
import { getAllStores } from "../../services/stores";
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { getAllOrders } from "../../services/orders";
import { getAllCart } from "../../services/cart";
import { getAllUsers } from "../../services/users";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    stores: 0,
    users: 0,
    categories: 0,
    products: 0,
    orders: 0,
    cart: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [stores, users, categories, products, orders, cart] = await Promise.all([
        getAllStores(),
        getAllUsers ? getAllUsers() : [],
        getAllCategories(),
        getAllProducts(),
        getAllOrders(),
        getAllCart(),
      ]);
      setStats({
        stores: stores.length,
        users: users.length,
        categories: categories.length,
        products: products.length,
        orders: orders.length,
        cart: cart.length,
      });
    };
    fetchData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
      <div className={styles.dashboardCards}>
        <div className={styles.card}>
          <h3>Stores</h3>
          <p>{stats.stores}</p>
        </div>
        <div className={styles.card}>
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className={styles.card}>
          <h3>Categories</h3>
          <p>{stats.categories}</p>
        </div>
        <div className={styles.card}>
          <h3>Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className={styles.card}>
          <h3>Orders</h3>
          <p>{stats.orders}</p>
        </div>
        <div className={styles.card}>
          <h3>Cart</h3>
          <p>{stats.cart}</p>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
