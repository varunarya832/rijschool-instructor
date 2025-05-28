import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authAPI from '../service/auth.service';
import { storage } from '../utils/storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.getToken());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { token } = await authAPI.login(credentials);
      console.log(token);

      storage.setToken(token);
      setToken(token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setToken(null);
  }, []);

  useEffect(() => {
    const existingToken = storage.getToken();
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


 