import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getCurrentUser());

  useEffect(() => {
    api.seed();
    setUser(api.getCurrentUser());
  }, []);

  const login = async (username, password) => {
    const u = await api.login(username, password);
    setUser(u);
    return u;
  };

  // NEW: register
  const register = async (payload) => {
    const u = await api.register(payload);
    setUser(u); // auto login
    return u;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const hasRole = (...roles) => !!user && roles.includes(user.role);

  const value = useMemo(
    () => ({ user, login, register, logout, hasRole }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
