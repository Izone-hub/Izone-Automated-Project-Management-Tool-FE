// /**
//  * Authentication API Service
//  * Centralized API calls for authentication operations
//  */

// const API_BASE_URL = "/api/backend";

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface SignupData {
//   email: string;
//   Full_Name: string;
//   password: string;
// }

// export interface AuthResponse {
//   access_token: string;
//   token_type: string;
//   user?: {
//     id: string;
//     email: string;
//     full_name: string;
//   };
// }

// export interface ApiError {
//   message: string;
//   errors?: Record<string, string[]>;
// }

// /**
//  * Mock authentication service for development
//  * Replace with real API calls when backend is ready
//  */
// export const authApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//       credentials: "include"
//     });

//     if (!response.ok) {
//       const rawText = await response.text().catch(() => '');
//       console.error(`Login failed. Status: ${response.status} ${response.statusText}`);
//       console.error('Login error body:', rawText);

//       let message = 'Login failed';
//       try {
//         if (rawText) {
//           const body = JSON.parse(rawText);
//           message = body?.detail || body?.message || message;
//         }
//       } catch (e) {
//         message = rawText || message;
//       }

//       throw new Error(`Login failed (${response.status}): ${message}`);
//     }

//     return response.json();
//   },

//   async signup(data: SignupData): Promise<AuthResponse> {
//     // Standardize to full_name for backend compatibility
//     const payload = {
//       email: data.email,
//       full_name: data.Full_Name,
//       password: data.password,
//     };

//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const rawText = await response.text().catch(() => '');
//       console.error('Signup error details:', {
//         status: response.status,
//         statusText: response.statusText,
//         url: response.url,
//         body: rawText
//       });

//       let message = 'Signup failed';
//       try {
//         if (rawText) {
//           const body = JSON.parse(rawText);
//           message = body?.detail || body?.message || message;
//         }
//       } catch (e) {
//         message = rawText || message;
//       }

//       throw new Error(message);
//     }

//     return response.json();
//   },
// };



/**
 * Token Management for Authentication
 * Handles storing, retrieving, and clearing auth tokens
 * Works alongside your existing authApi
 */

export const authTokenManager = {
  // Store token in localStorage after successful login
  setToken: (token: string) => {
    if (typeof window === "undefined") return
    console.log("[v0] Storing auth token from login response")
    localStorage.setItem("auth_token", token)
  },

  // Retrieve token for API requests (comments, etc)
  getToken: (): string | null => {
    if (typeof window === "undefined") return null

    // Check localStorage first
    const localToken = localStorage.getItem("auth_token")
    if (localToken) {
      return localToken
    }

    // Fallback: check cookies if backend sets them
    const match = document.cookie.match(/(^| )auth_token=([^;]+)/)
    if (match?.[2]) {
      // Move from cookie to localStorage for consistency
      localStorage.setItem("auth_token", match[2])
      return match[2]
    }

    return null
  },

  // Remove token on logout
  clearToken: () => {
    if (typeof window === "undefined") return
    console.log("[v0] Clearing auth token on logout")
    localStorage.removeItem("auth_token")
    // Also clear cookie if backend set one
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  },

  // Check if user is authenticated
  isLoggedIn: (): boolean => {
    return !!authTokenManager.getToken()
  },

  // Debug helper to verify auth status
  debugAuth: () => {
    const token = localStorage.getItem("auth_token")
    console.log("[v0] Auth Status:", {
      isAuthenticated: !!token,
      tokenLength: token?.length || 0,
      hasLocalStorage: !!token,
    })
  },
}
