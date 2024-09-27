"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any; // Define a proper user type if necessary
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Adjust type as needed

  const login = async (email: string, password: string) => {
    // Implement login logic, set user and handle token
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    setUser(response.data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Implement signup logic
    await axios.post('/api/auth/signup', { name, email, password }, { withCredentials: true });
  };

  const logout = async () => {
    // Implement logout logic
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const refresh = async () => {
    // Implement token refresh logic
    const response = await axios.get('/api/auth/refresh', { withCredentials: true });
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
