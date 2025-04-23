import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../utils/api';

interface User {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  firstName: string;
  lastName: string;
}

interface DecodedToken {
  userId: string;
  role: 'student' | 'tutor' | 'admin';
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await API.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // If we can't fetch user details, clear the token
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.log('Token expired, logging out');
          localStorage.removeItem('token');
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        fetchUserDetails(decoded.userId);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string): Promise<void> => {
    try {
      localStorage.setItem('token', token);
      const decoded = jwtDecode<DecodedToken>(token);
      await fetchUserDetails(decoded.userId);
      return Promise.resolve();
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('token');
      setUser(null);
      return Promise.reject(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}