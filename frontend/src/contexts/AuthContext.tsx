import LoadingScreen from '@/components/LoadingScreen';
import { useUserStore } from '@/store/useUserStore';
import { User } from '@/types/types';
import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/verify`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [setUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/register`,
        { name, email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/user/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  if (loading) {
    return <LoadingScreen />;
  }


  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
