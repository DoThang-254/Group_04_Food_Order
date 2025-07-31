import { createContext, useEffect, useState } from 'react';

export const loginContext = createContext();

const LoginContext = ({ children }) => {
    const [token, setToken] = useState(() => {
        const stored = localStorage.getItem('token');
        return stored; 
    });

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]); 

    return (
        <loginContext.Provider value={{ token, setToken }}>
            {children}
        </loginContext.Provider>
    );
};

export default LoginContext;