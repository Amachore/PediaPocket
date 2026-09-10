import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../services/storage';
import STORAGE_KEYS from '../services/storage';
import { userService, initializeDefaultData } from '../services/dataService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      // Initialize default data on first launch
      await initializeDefaultData();
      
      // Check if user was previously logged in
      const savedUser = await storage.load(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (uid) => {
    try {
      const user = await userService.getById(uid);
      if (user) {
        await storage.save(STORAGE_KEYS.CURRENT_USER, user);
        setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await storage.remove(STORAGE_KEYS.CURRENT_USER);
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const isParent = () => currentUser?.role === 'parent';
  const isCaregiver = () => currentUser?.role === 'caregiver';

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isParent,
    isCaregiver,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
