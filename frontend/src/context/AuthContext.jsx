import { createContext, useState, useEffect, useContext } from "react";
import { loginService, registerService } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    if (storedData) {
      setUser(JSON.parse(storedData));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoadingContext(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
  };

  const register = async (email, username, password) => {
    const data = await registerService(email, username, password);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loadingContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);