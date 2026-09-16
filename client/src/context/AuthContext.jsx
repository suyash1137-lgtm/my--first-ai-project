import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('saral_token'));
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('saral_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setToken(savedToken);
      } catch {
        localStorage.removeItem('saral_token');
        localStorage.removeItem('saral_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser, profile } = res.data;
    localStorage.setItem('saral_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return { user: newUser, profile };
  }, []);

  const register = useCallback(async (name, email, password, role = 'student', profileType = 'general') => {
    const res = await api.post('/auth/register', { name, email, password, role, profileType });
    const { token: newToken, user: newUser, profile } = res.data;
    localStorage.setItem('saral_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return { user: newUser, profile };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('saral_token');
    localStorage.removeItem('saral_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateOnboarding = useCallback(async (profileType, customSettings) => {
    const res = await api.post('/auth/onboarding', { profileType, customSettings });
    setUser(res.data.user);
    return res.data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateOnboarding, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
