import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always fetch user data from server (checks session cookie)
  // This will work even if localStorage token is not set
  const { data: userData, isLoading: authLoading } = trpc.auth.me.useQuery();
  
  // Update isAuthenticated based on server response
  useEffect(() => {
    if (userData) {
      // userData is the user object directly (id, email, name, etc.)
      setIsAuthenticated(true);
      setIsLoading(false);
    } else if (userData === null) {
      // Explicitly null means not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    } else if (!authLoading) {
      // Loading finished but no data
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [userData, authLoading]);

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
    user: userData, // userData is already the user object
    handleLogout,
  };
}
