import { Navigate, Outlet } from 'react-router';
import { useAuth } from './useAuth.js';

// Wraps routes that need a logged-in user; everyone else is sent to /login.
// This is for user experience only — the API enforces real access control.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Wraps routes for logged-out users only (login, register); logged-in users go to /dashboard.
export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
