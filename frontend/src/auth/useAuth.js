import { useContext } from 'react';
import { AuthContext } from './AuthContext.js';

// Returns { token, user, isAuthenticated, login, logout }.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
