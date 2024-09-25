import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? true : false; // Set based on stored token
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = (newToken) => {
    setIsAuthenticated(true);
    setToken(newToken);
    localStorage.setItem('token', newToken); // Store the token in local storage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('token'); // Remove the token from local storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
