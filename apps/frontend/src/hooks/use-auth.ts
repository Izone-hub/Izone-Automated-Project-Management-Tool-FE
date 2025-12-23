import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, SignupData, AuthResponse } from '@/lib/api/auth';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { setCookie, removeCookie } from '@/lib/utils';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearSession = () => {
    if (typeof window === 'undefined') return;

    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastWorkspaceId');

  
    removeCookie('auth_token');
    
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_') || key.includes('token')) {
        localStorage.removeItem(key);
      }
    });

  
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

    
    clearSession();

    try {
      const response: AuthResponse = await authApi.login(credentials);

      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
    
        setCookie('auth_token', response.access_token);

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

    
    clearSession();

    try {
      const response: AuthResponse = await authApi.signup(data);

      
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        
        setCookie('auth_token', response.access_token);

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
