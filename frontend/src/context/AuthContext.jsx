import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("secureRideUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem("secureRideUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("secureRideUser");
    setUser(null);
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem("secureRideUser", JSON.stringify(updated));
    setUser(updated);
  };

  const value = useMemo(() => ({ user, login, logout, updateUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}