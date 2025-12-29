import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export function useAuth() {
  // Check localStorage immediately on initialization (before first render)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from server
  const { data: authData } = trpc.auth.me.useQuery(undefined, {
    enabled: isAuthenticated, // Only fetch if token exists
  });

  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user: authData?.user,
    handleLogout,
  };
}
