import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, SignupData, AuthResponse } from '@/lib/api/auth';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearSession = () => {
    if (typeof window === 'undefined') return;

    // Clear known keys
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastWorkspaceId');

    // 🔥 Clean cookie as well for Middleware
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('auth_token');
    // Nuclear option: Force expire via raw DOM in case library misses scope
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    // Clear any potential auth/token related keys as a fallback
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_') || key.includes('token')) {
        localStorage.removeItem(key);
      }
    });

    // Clear cookies if any (simple attempt, though httpOnly won't be cleared here, it helps for others)
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    // 🔥 CRITICAL: Clear strictly before attempt
    clearSession();

    try {
      const response: AuthResponse = await authApi.login(credentials);

      // Store token in localStorage
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        // Sync to Cookie for Middleware
        Cookies.set('auth_token', response.access_token, { expires: 7, path: '/' }); // Explicit path

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

    // 🔥 CRITICAL: Clear strictly before attempt
    clearSession();

    try {
      const response: AuthResponse = await authApi.signup(data);

      // Store token in localStorage
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        // Sync to Cookie for Middleware
        Cookies.set('auth_token', response.access_token, { expires: 7, path: '/' }); // Explicit path

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

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error("Server logout failed", e);
    }
    clearSession();
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
