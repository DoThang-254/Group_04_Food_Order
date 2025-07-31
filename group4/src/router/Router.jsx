import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Checkout from '../pages/Checkout';
import FoodDetail from '../pages/FoodDetail';
import RouterPrivate from './RouterPrivate';
import UserInfo from '../pages/UserInfo'
import PageNotFound from '../pages/PageNotFound';
import RouterAuthorize from './RouterAuthorize';
const router = createBrowserRouter([
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
                path:'register' , 
                element: <Register/>
            },
            {
                path: 'admin',
                element: <AdminDashboard/>
            },
            {
                path: 'checkout',
                element: <Checkout/>
            },
            {    
                path: 'home/:id',
                element: <FoodDetail />
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
                path: 'register',
                element: <Register />
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