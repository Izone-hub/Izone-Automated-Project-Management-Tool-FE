/**
 * Authentication API Service
 * Centralized API calls for authentication operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Mock authentication service for development
 * Replace with real API calls when backend is ready
 */
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },
};

/**
 * Mock implementation for development
 * Remove when real API is integrated
 */
export const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock successful response
    return {
      access_token: 'mock-token',
      token_type: 'bearer',
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock successful response
    return {
      access_token: 'mock-token',
      token_type: 'bearer',
      user: {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    };
  },
};

