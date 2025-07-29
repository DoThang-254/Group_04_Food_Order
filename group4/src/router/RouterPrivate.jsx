import React, { useContext } from 'react';
import { loginContext } from '../context/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';

const RouterPrivate = () => {
    const { islogin} = useContext(loginContext)
    return (
        <div>
            {(islogin) ? <Outlet /> : <Navigate to="/login" />}
        </div>
    );
};

export default RouterPrivate;