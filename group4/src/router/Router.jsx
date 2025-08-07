<<<<<<< HEAD
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/auth/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLayout from '../pages/admin/AdminLayout';
import Checkout from '../pages/Checkout';
import FoodDetail from '../pages/FoodDetail';
import RouterPrivate from './RouterPrivate';
import PageNotFound from '../pages/auth/PageNotFound';
import ShopDetail from '../pages/ShopDetail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword'
import OwnerDashboard from '../pages/OwnerDashBoard';
import Profile from '../pages/auth/Profile';
import RegisterStore from '../pages/auth/RegisterStore';
import RouterAuth from './RouterAuth';
import Payment from '../pages/Payment';
=======
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/auth/Login";
import HomePage from "../pages/HomePage";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import Checkout from "../pages/Checkout";
import FoodDetail from "../pages/FoodDetail";
import RouterPrivate from "./RouterPrivate";
import PageNotFound from "../pages/auth/PageNotFound";
import ShopDetail from "../pages/ShopDetail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OwnerDashboard from "../pages/OwnerDashBoard";
import Profile from "../pages/auth/Profile";
import RegisterStore from "../pages/auth/RegisterStore";
import RouterAuth from "./RouterAuth";
>>>>>>> 6eedeb592139134c6e2111fca5a8d145a7aca82f
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Navigate to="/home" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "food/:id/detail",
        element: <FoodDetail />,
      },
      {
        path: "shop/:id/detail",
        element: <ShopDetail />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "owner-dashboard",
        element: <OwnerDashboard />,
      },
      {
        path: "",
        element: <RouterAuth />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "register-store",
            element: <RegisterStore />,
          },
          {
            path: 'payment/:id',
            element: <Payment />
          }
        ]
      }
    ],
  },
  {
    element: <RouterPrivate />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
]);
const Router = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default Router;
