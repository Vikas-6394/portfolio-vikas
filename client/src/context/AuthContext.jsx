import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem('vm_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Purge any legacy persistent token so session strictly adheres to current browser tab/window
    try {
      localStorage.removeItem('vm_admin_token');
    } catch {
      // Ignore if unavailable
    }

    const verifyUser = async () => {
      const storedToken = sessionStorage.getItem('vm_admin_token');
      if (storedToken) {
        try {
          const res = await portfolioAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            setUser(null);
            sessionStorage.removeItem('vm_admin_token');
          }
        } catch (err) {
          console.warn('Session verification error:', err.response?.data?.message || err.message);
          setUser(null);
          sessionStorage.removeItem('vm_admin_token');
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await portfolioAPI.login({ email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      sessionStorage.setItem('vm_admin_token', res.data.token);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = async () => {
    try {
      await portfolioAPI.logout();
    } catch (err) {
      console.warn('Logout API error:', err.message);
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('vm_admin_token');
      try {
        localStorage.removeItem('vm_admin_token');
      } catch {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
