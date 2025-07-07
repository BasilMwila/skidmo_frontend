import React, { createContext, useContext, useEffect, useState } from 'react';
import  { ownerAPI } from '@/services/userApi'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          // Verify token is valid
          const decoded = jwtDecode(token);
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            // Token expired, try to refresh
            await refreshToken();
          } else {
            // Token is valid, fetch user data
            const userData = await ownerAPI.getUserInfo();
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        await ownerAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await ownerAPI.login(username, password);
      const userData = await ownerAPI.getUserInfo();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await ownerAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) => {
    setIsLoading(true);
    try {
      await ownerAPI.register(userData);
      // Optionally auto-login after registration
      // await login(userData.username, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await ownerAPI.refreshToken(refreshToken);
      if (response.access) {
        await AsyncStorage.setItem('access_token', response.access);
        // Get fresh user data after token refresh
        const userData = await ownerAPI.getUserInfo();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  const updateUser = async (userData: any) => {
    try {
      const updatedUser = await ownerAPI.updateUserInfo(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        register,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};