// app/context/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '@/config/config';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState({ isLoggedIn: false, isAdmin: false });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/status`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not logged in');

        const data = await res.json();
        setAuthState({ isLoggedIn: true, isAdmin: data.isAdmin });
      } catch {
        setAuthState({ isLoggedIn: false, isAdmin: false });
      }
    };
    checkStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    setAuthState({ isLoggedIn: true, isAdmin: data.role === 'admin' });
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    setAuthState({ isLoggedIn: false, isAdmin: false });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        isAdmin: authState.isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
