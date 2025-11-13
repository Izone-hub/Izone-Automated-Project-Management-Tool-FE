/**
 * Authentication hook for managing auth state and operations
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, SignupData, AuthResponse } from '@/lib/api/auth';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await authApi.login(credentials);
      
      // Store token in localStorage (consider using httpOnly cookies in production)
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      toast.success('Login successful!');
      router.push('/dashboard');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await authApi.signup(data);
      
      // Store token in localStorage
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      toast.success('Account created successfully!');
      router.push('/dashboard');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return {
    login,
    signup,
    logout,
    isLoading,
    error,
  };
}

