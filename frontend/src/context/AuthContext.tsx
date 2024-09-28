"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { apiClient, authApiClient } from "@/lib/apiClient";

interface AuthContextType {
  user: any; // Define a proper user type if necessary
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  loading: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null); // Adjust type as needed
  const [loading, setLoading] = useState<string>("loading");

  const login = async (email: string, password: string) => {
    // Implement login logic, set user and handle token
    const response = await apiClient.post(
      `/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(response.data.data);
  };

  useLayoutEffect(() => {
    async function isAuth() {
      try {
        const response = await apiClient.post(
          `/isauth`,
          {},
          { withCredentials: true }
        );
        setUser(response.data.data);
      } catch (error: any) {
        setUser(null);
      } finally {
        setLoading("idle");
      }
    }
    isAuth();
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    // Implement signup logic
    await apiClient.post(
      `/signup`,
      { name, email, password },
      { withCredentials: true }
    );
  };

  const logout = async () => {
    // Implement logout logic
    await authApiClient.post(`/logout`, {});
    setUser(null);
  };

  const refresh = async () => {
    // Implement token refresh logic
    const response = await authApiClient.get(`/refresh`);
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, refresh, loading }}
    >
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
