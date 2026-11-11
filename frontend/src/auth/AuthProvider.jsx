import { useCallback, useMemo, useState } from 'react';
import * as authApi from '../api/authApi.js';
import { AuthContext } from './AuthContext.js';

const STORAGE_KEY = 'nagaed.auth';

// Reads { token, user } saved by a previous login, so a page refresh keeps the user logged in.
function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.token && saved?.user ? saved : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  // Throws ApiError on failure (e.g. "Invalid credentials") so the page can show it.
  const login = useCallback(async ({ email, password }) => {
    const { token, user } = await authApi.login({ email, password });
    const next = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
