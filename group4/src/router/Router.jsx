import React from 'react';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Layout from '../pages/Layout';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import Register from '../pages/Register';
import Checkout from '../pages/Checkout';
import FoodDetail from '../pages/FoodDetail';
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
               path:'home/:id',
               element:<FoodDetail/>
            },
            {
                path:'register' , 
                element: <Register/>
            },
             {
                path:'checkout' , 
                element: <Checkout/>
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