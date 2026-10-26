import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('healspace_token') || null);
  const [therapist, setTherapist] = useState(() => {
    const saved = localStorage.getItem('healspace_therapist');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = (newToken, therapistData) => {
    localStorage.setItem('healspace_token', newToken);
    localStorage.setItem('healspace_therapist', JSON.stringify(therapistData));
    setToken(newToken);
    setTherapist(therapistData);
  };

  const logout = () => {
    localStorage.removeItem('healspace_token');
    localStorage.removeItem('healspace_therapist');
    setToken(null);
    setTherapist(null);
  };

  return (
    <AuthContext.Provider value={{ token, therapist, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}