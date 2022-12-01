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

export const useSignUp = () => {
  const { signup } = useAuth();
  return signup;
}

export const useTokenCheck = () => {
  const { checkToken } = useAuth();
  return checkToken;
}

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, [])

  const checkToken = useCallback(() => {
    return usersApi.getByToken().then(user => setUser(user)).catch(() => logout());
  }, [logout]);

  useEffect(() => {
    setReady(Boolean(token));
    api.setAuthToken(token);
    if(token) {
      localStorage.setItem(JWT_TOKEN_KEY, token);
      checkToken();
    }
    else localStorage.removeItem(JWT_TOKEN_KEY);
  }, [token, checkToken])

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
      setError('Login failed, please try again');
      return false;
    }
    finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data) => {
    try {
      setLoading(false);
      setError('');
      const { token, user } = await usersApi.saveUser({name: data.user, email: data.email, password: data.pass});
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

  const value = useMemo(() => ({
    loading,
    error,
    token,
    user,
    ready,
    login,
    logout,
    signup,
    checkToken
  }), [error, loading, token, user, ready, login, logout, signup, checkToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}