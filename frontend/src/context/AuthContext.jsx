import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("lifesync_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("lifesync_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("lifesync_token");
      if (savedToken) {
        try {
          const res = await api.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem("lifesync_user", JSON.stringify(res.data.user));
          }
        } catch (err) {
          if (err.response?.status === 401) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("lifesync_token");
            localStorage.removeItem("lifesync_user");
          }
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("lifesync_token", res.data.token);
      localStorage.setItem("lifesync_user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const loginDemo = async () => {
    return login("demo@lifesync.ai", "LifeSync@2026");
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("lifesync_token", res.data.token);
      localStorage.setItem("lifesync_user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("lifesync_token");
    localStorage.removeItem("lifesync_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        loginDemo,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
