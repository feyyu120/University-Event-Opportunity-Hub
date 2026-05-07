import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'club_leader';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'admin' | 'club_leader') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For now, we'll assume the token is valid
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'club_leader') => {
    try {
      const endpoint = role === 'admin' ? '/auth/admin_login' : '/auth/club_member_login';
      const response = await axios.post(`${process.env.REACT_APP_API_URL}${endpoint}`, {
        email,
        password
      });

      if (response.data?.success) {
        const token: string | undefined = response.data?.token;
        const apiUser = response.data?.user;

        const userData = apiUser
          ? {
              id: apiUser.id,
              email: apiUser.email,
              full_name: apiUser.full_name,
              role: apiUser.role,
            }
          : (role === 'admin'
              ? { id: response.data.id, email, full_name: 'Admin', role }
              : {
                  id: response.data.club?.id,
                  email: response.data.club?.email,
                  full_name: response.data.club?.full_name,
                  role
                });

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};