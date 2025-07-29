import { createContext, useEffect, useState } from 'react';

export const loginContext = createContext();

const LoginContext = ({ children }) => {
    const [islogin, setIsLogin] = useState(() => {
        const stored = localStorage.getItem('islogin');
        return stored === 'true'; 
    });

    useEffect(() => {
        localStorage.setItem('islogin', islogin);
    }, [islogin]); 

    return (
        <loginContext.Provider value={{ islogin, setIsLogin }}>
            {children}
        </loginContext.Provider>
    );
};

export default LoginContext;