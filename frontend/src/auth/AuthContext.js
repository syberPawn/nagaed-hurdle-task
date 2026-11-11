import { createContext } from 'react';

// Holds the login state: { token, user, login, logout }.
// Filled by <AuthProvider>, read with useAuth().
export const AuthContext = createContext(null);
