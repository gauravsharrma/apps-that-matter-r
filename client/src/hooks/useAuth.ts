import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  const logout = () => {
    localStorage.removeItem('userSettings');
    window.location.href = "/api/logout";
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };
}