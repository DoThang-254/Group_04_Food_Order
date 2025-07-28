import React from 'react';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/Register';
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