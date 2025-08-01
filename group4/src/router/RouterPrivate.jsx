import React, { useContext, useEffect, useState } from 'react';
import { loginContext } from '../context/LoginContext';
import { Navigate, Outlet } from 'react-router-dom';
import { decodeFakeToken } from '../data/token';

const RouterPrivate = () => {
    const { token } = useContext(loginContext);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                setRole(info.role);
            }
            setLoading(false);
        };
        decode();
    }, [token]);

    if (loading) return null; 

    return (
        <div>
            {token && role === 'admin' ? <Outlet /> : <Navigate to="/home" />}
        </div>
    );
};


export default RouterPrivate;
