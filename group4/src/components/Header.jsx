import React, { useContext } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { loginContext } from '../context/LoginContext';
const Header = () => {
    const { islogin, setIsLogin } = useContext(loginContext)
    const navToLogin = useNavigate();
    return (
        <div>
            <NavLink to="/home">Foods</NavLink>
            <NavLink to="/user-info">Info</NavLink>
            {islogin ? <button onClick={() => {
                setIsLogin(false);
                navToLogin('/login')
            }}>Logout</button> :
                <NavLink to="/login">Login</NavLink>
            }
        </div>
    );
};

export default Header;