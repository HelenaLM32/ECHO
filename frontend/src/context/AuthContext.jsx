import { createContext, useState, useEffect, useContext } from "react";
import { loginService, registerService } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingContext(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const register = async (email, username, password) => {
    const data = await registerService(email, username, password);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loadingContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);