"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  is_turf_owner?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (token && refresh) {
      fetchUser();
      const interval = setInterval(refreshToken, 10 * 60 * 1000); // every 10 min
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/profile/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/user/login/", { email, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      toast.success("Logged in successfully!");
      await fetchUser();
    } catch (err) {
      toast.error("Invalid credentials!");
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      await api.post("/user/register/", data);
      toast.success("Account created! Please log in.");
    } catch (err) {
      toast.error("Registration failed!");
      throw err;
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;

    try {
      const res = await api.post("/user/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
      console.log("Token refreshed successfully");
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
