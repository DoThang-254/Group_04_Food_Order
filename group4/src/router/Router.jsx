import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLayout from '../pages/admin/AdminLayout';
import Checkout from '../pages/Checkout';
import FoodDetail from '../pages/FoodDetail';
import RouterPrivate from './RouterPrivate';
import UserInfo from '../pages/UserInfo'
import PageNotFound from '../pages/PageNotFound';
import ShopDetail from '../pages/ShopDetail';
import RouterAuthorize from './RouterAuthorize';
const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboard />
      }
    ]
  },

  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to='/home' />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'home/:id',
        element: <FoodDetail />
      },
      {
        path: 'shop/:id/detail',
        element: <ShopDetail/>
      },
      {
        path: 'food/:id/detail' , 
        element: <FoodDetail/>
      },
      {
        element: <RouterPrivate />,
        children: [
          {
            path: 'user-info',
            element: <UserInfo />
          },

        ]
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  }
])
const Router = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default Router;