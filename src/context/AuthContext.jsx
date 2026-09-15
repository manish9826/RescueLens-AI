import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(localStorage.getItem('isDemo') === 'true');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (isDemo) {
        setUser({ id: 'demo-123', name: 'Demo User', email: 'demo@rescuelens.ai' });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token, isDemo]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsDemo(false);
  };

  const loginAsDemo = () => {
    localStorage.setItem('isDemo', 'true');
    setIsDemo(true);
    setToken('demo-token');
    setUser({ id: 'demo-123', name: 'Demo User', email: 'demo@rescuelens.ai' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isDemo');
    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isDemo, login, loginAsDemo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
