import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Simple mock auth for now - replace with Google OAuth later
export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // Mock login - replace with Google OAuth
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://via.placeholder.com/40'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userSettings');
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };
}

export { AuthContext };