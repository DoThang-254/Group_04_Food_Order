import React from 'react';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                path: 'login',
                element: <Login/>
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