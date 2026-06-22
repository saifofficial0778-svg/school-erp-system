import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null); // Admin profile info handle karne ke liye
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Page load hote hi token validation logic (Future extension safe)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setUser({ role: 'admin', name: 'Admin' }); // Fallback data
    }
    setLoading(false);
  }, []);

  // 🔑 LOGIN TRIGGER FUNCTION
  const login = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    setUser(userData || { role: 'admin', name: 'Admin' });
  };

  // 🚪 LOGOUT TRIGGER FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consumption across components easily
export const useAuth = () => useContext(AuthContext);