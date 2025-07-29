import React from 'react';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/Register';
import AdminDashboard from '../pages/admin/AdminDashboard';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                path: 'login',
                element: <Login/>
            },
            {
                path:'home',
                element:<HomePage/>
            },
            {
                path:'register' , 
                element: <Register/>
            },
            {
                path: 'admin',
                element: <AdminDashboard/>
            }

        ]
    }
])
const Router = () => {
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    );
};

export default Router;