import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('janvoice_token');
    const savedUser = localStorage.getItem('janvoice_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to state
        setToken(token);
        setUser(user);
        
        // Save to localStorage
        localStorage.setItem('janvoice_token', token);
        localStorage.setItem('janvoice_user', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Login failed' 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        setToken(token);
        setUser(user);
        
        localStorage.setItem('janvoice_token', token);
        localStorage.setItem('janvoice_user', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Registration failed' 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('janvoice_token');
    localStorage.removeItem('janvoice_user');
    localStorage.removeItem('janvoice_remember');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;