import { createContext, useState, useEffect, useContext } from "react";
import { loginService, registerService } from "../services/auth";
import { clearAuthSession, getAuthToken, getAuthUser, setAuthSession } from "../services/session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    const storedUser = getAuthUser();
    const storedToken = getAuthToken();
    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
    setLoadingContext(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    setAuthSession({ token: data.token, user: data });
    setToken(data.token);
    setUser(data);
  };

  const register = async (email, username, password) => {
    const data = await registerService(email, username, password);
    setAuthSession({ token: data.token, user: data });
    setToken(data.token);
    setUser(data);
  };

  const logout = () => {
    clearAuthSession();
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