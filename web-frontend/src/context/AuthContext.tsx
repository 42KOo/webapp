import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{children:any}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setAuthToken(t);
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post('/auth/login', { email, password });
    const { token, user } = r.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(undefined);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
