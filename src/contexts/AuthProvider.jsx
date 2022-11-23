import { useMemo, useContext, useCallback, useEffect, useState, createContext } from "react";
import * as usersApi from '../api/users';
import config from '../config.json';
import * as api from '../api';

const JWT_TOKEN_KEY = config.token_key;
const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
  const { loading, token, user, ready, error } = useAuth();
  return { loading, token, user, ready, error };
}

export const useLogin = () => {
  const { login } = useAuth();
  return login;
}

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
}

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(Boolean(token));
    api.setAuthToken(token);
    if(token) localStorage.setItem(JWT_TOKEN_KEY, token);
    else localStorage.removeItem(JWT_TOKEN_KEY);
  }, [token])

  const login = useCallback(async (userInput, password) => {
    try {
      setLoading(false);
      setError('');
      const { token, user } = await usersApi.login(userInput, password);
      setToken(token);
      setUser(user);
      return true;
    }
    catch(error) {
      console.log(error);
      setError('Login failed, please try again');
      return false;
    }
    finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, [])

  const value = useMemo(() => ({
    loading,
    error,
    token,
    user,
    ready,
    login,
    logout
  }), [error, loading, token, user, ready, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}