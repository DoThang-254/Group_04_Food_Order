import { createContext, useEffect, useState } from "react";

export const loginContext = createContext();

const LoginContext = ({ children }) => {
  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    );
  });
  const [remember, setRemember] = useState(
    localStorage.getItem("token") ? true : false
  );
  useEffect(() => {
    if (token) {
      if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  }, [token, remember]);
  return (
    <loginContext.Provider value={{ token, setToken, setRemember }}>
      {children}
    </loginContext.Provider>
  );
};

export default LoginContext;
