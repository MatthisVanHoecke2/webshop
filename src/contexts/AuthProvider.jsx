import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);


  const login = useCallback(async (email, password) => {

  });


  const value = useMemo(() => ({
    loading,
    error,
    token,
    user
  }), [error, loading, token, user]);

  return (
    <AuthContext.Provider>
      {children}
    </AuthContext.Provider>
  );
}