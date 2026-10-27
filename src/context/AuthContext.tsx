import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../api/axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  switchDemoUser: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('imovies_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('imovies_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync session with backend if real token exists or auto-login default customer
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('imovies_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('imovies_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('imovies_token');
          localStorage.removeItem('imovies_user');
          setToken(null);
          setUser(null);
        }
      } else {
        // Automatically authenticate with demo customer credentials on first launch
        try {
          const res = await api.post('/auth/login', {
            email: 'user@imovies.com',
            password: 'password123',
          });
          const { token: demoToken, user: demoUser } = res.data;
          localStorage.setItem('imovies_token', demoToken);
          localStorage.setItem('imovies_user', JSON.stringify(demoUser));
          setToken(demoToken);
          setUser(demoUser);
        } catch {
          // If server is not ready yet, set local fallback
          const fallbackUser: User = {
            id: 'usr_demo_1',
            name: 'John Doe',
            email: 'user@imovies.com',
            role: 'user',
          };
          setUser(fallbackUser);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('imovies_token', receivedToken);
      localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('imovies_token', receivedToken);
      localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (role: 'user' | 'admin') => {
    const creds =
      role === 'admin'
        ? { email: 'admin@imovies.com', password: 'admin123' }
        : { email: 'user@imovies.com', password: 'password123' };

    try {
      await login(creds.email, creds.password);
    } catch {
      const demoUser: User =
        role === 'admin'
          ? { id: 'usr_demo_2', name: 'Jane Admin', email: 'admin@imovies.com', role: 'admin' }
          : { id: 'usr_demo_1', name: 'John Doe', email: 'user@imovies.com', role: 'user' };
      const mockToken = 'mock_token_' + role;
      localStorage.setItem('imovies_token', mockToken);
      localStorage.setItem('imovies_user', JSON.stringify(demoUser));
      setToken(mockToken);
      setUser(demoUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
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
