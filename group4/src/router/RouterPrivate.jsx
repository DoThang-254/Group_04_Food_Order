import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';
import { decodeFakeToken } from '../data/token';

const RouterPrivate = () => {
    const { token } = useContext(loginContext);
    const [role, setRole] = useState(null);
    console.log(token)
    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                console.log(info);      
                setRole(info.role);      
            }
        };
        decode();
    }, [token]);

    return (
        <div>
            {token && role === 'admin' ? <Outlet /> : <Navigate to="/home" />}
        </div>
    );
};

export default RouterPrivate;
