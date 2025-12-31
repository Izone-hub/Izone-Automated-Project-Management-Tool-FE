/**
 * Authentication API Service
 * Centralized API calls for authentication operations
 */

const API_BASE_URL = "/api/backend";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  Full_Name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: "include"
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      console.error(`Login failed. Status: ${response.status} ${response.statusText}`);
      console.error('Login error body:', rawText);

      let message = 'Login failed';
      try {
        if (rawText) {
          const body = JSON.parse(rawText);
          message = body?.detail || body?.message || message;
        }
      } catch (e) {
        message = rawText || message;
      }

      throw new Error(`Login failed (${response.status}): ${message}`);
    }

    return response.json();
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    // Standardize to full_name for backend compatibility
    const payload = {
      email: data.email,
      full_name: data.Full_Name,
      password: data.password,
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      console.error('Signup error details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: rawText
      });

      let message = 'Signup failed';
      try {
        if (rawText) {
          const body = JSON.parse(rawText);
          message = body?.detail || body?.message || message;
        }
      } catch (e) {
        message = rawText || message;
      }

      throw new Error(message);
    }

    return response.json();
  },
};
