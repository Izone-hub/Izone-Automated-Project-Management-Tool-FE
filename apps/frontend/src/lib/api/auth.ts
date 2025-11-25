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
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Try to parse the JSON body and prefer FastAPI's `detail` field
      let body: any = {};
      try {
        body = await response.json();
      } catch (e) {
        // If JSON parsing fails, capture raw text for debugging
        const raw = await response.text().catch(() => null);
        console.error('login error raw response:', { status: response.status, raw });
        const message = raw || 'Login failed';
        throw new Error(message);
      }
      const message = body?.detail || body?.message || 'Login failed';
      // log parsed body for debugging
      console.error('login error body:', { status: response.status, body });
      throw new Error(message);
    }

    return response.json();
  },

  async signup(data: SignupData): Promise<AuthResponse> {
      //  Combine first and last name into full_name for backend
  const payload = {
    email: data.email,
    full_name: data.Full_Name,
    password: data.password,
  };
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Prefer FastAPI's `detail` when available so the UI shows a useful message
      let body: any = {};
      try {
        body = await response.json();
      } catch (e) {
        // If JSON parsing fails, capture raw text for debugging
        const raw = await response.text().catch(() => null);
        console.error('signup error raw response:', { status: response.status, raw });
        const message = raw || 'Signup failed';
        throw new Error(message);
      }
      const message = body?.detail || body?.message || 'Signup failed';
      console.error('signup error body:', { status: response.status, body });
      throw new Error(message);
    }

    return response.json();
  },
};

/**
 * Mock implementation for development
 * Remove when real API is integrated
 */
// export const mockAuthApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
    
//     // Mock successful response
//     return {
//       access_token: 'mock-token',
//       token_type: 'bearer',
//       user: {
//         id: '1',
//         email: credentials.email,
//       full_name: 'John Doe',
//       },
//     };
//   },

//   async signup(data: SignupData): Promise<AuthResponse> {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
    
//     // Mock successful response
//     return {
//       access_token: 'mock-token',
//       token_type: 'bearer',
//       user: {
//         id: '1',
//         email: data.email,
//          full_name:data.full_name,
//       },
//     };
//   },
// };




// // src/lib/api/auth.ts

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   token: string;
//   user: any;
// }

// export const authApi = {
//   async login(data: LoginCredentials): Promise<AuthResponse> {
//     const response = await fetch("http://localhost:3000/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     // ---- FIX: safely parse JSON or return empty object ----
//     let body: any = {};
//     try {
//       body = await response.json();
//     } catch (err) {
//       // Backend returned no JSON body
//       console.warn("No JSON returned from backend");
//     }

//     // ---- CHECK FOR ERROR ----
//     if (!response.ok) {
//       console.error("login error:", {
//         status: response.status,
//         statusText: response.statusText,
//         body,
//       });

//       const message =
//         body?.detail ||
//         body?.message ||
//         response.statusText ||
//         "Login failed";

//       throw new Error(message);
//     }

//     // ---- SUCCESS ----
//     return body as AuthResponse;
//   },
// };






// /**
//  * Authentication API Service
//  * Centralized API calls for authentication operations
//  */

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface SignupData {
//    email: string;
//    Full_Name: string;
//    password: string;
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

/**
 * Mock authentication service for development
 * Replace with real API calls when backend is ready
 */
// export const authApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     // TODO: Replace with actual API call
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });

//     if (!response.ok) {
//       // Try to parse the JSON body and prefer FastAPI's `detail` field
//       let body: any = {};
//       try {
//         body = await response.json();
//       } catch (e) {
//         // If JSON parsing fails, capture raw text for debugging
//         const raw = await response.text().catch(() => null);
//         console.error('login error raw response:', { status: response.status, raw });
//         const message = raw || 'Login failed';
//         throw new Error(message);
//       }
//       const message = body?.detail || body?.message || 'Login failed';
//       // log parsed body for debugging
//       console.error('login error body:', { status: response.status, body });
//       throw new Error(message);
//     }

//     return response.json();
//   },

//   async signup(data: SignupData): Promise<AuthResponse> {
//       //  Combine first and last name into full_name for backend
//   const payload = {
//     email: data.email,
//     full_name: data.Full_Name,
//     password: data.password,
//   };
//     // TODO: Replace with actual API call
//     const response = await fetch(`${API_BASE_URL}/auth/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       // Prefer FastAPI's `detail` when available so the UI shows a useful message
//       let body: any = {};
//       try {
//         body = await response.json();
//       } catch (e) {
//         // If JSON parsing fails, capture raw text for debugging
//         const raw = await response.text().catch(() => null);
//         console.error('signup error raw response:', { status: response.status, raw });
//         const message = raw || 'Signup failed';
//         throw new Error(message);
//       }
//       const message = body?.detail || body?.message || 'Signup failed';
//       console.error('signup error body:', { status: response.status, body });
//       throw new Error(message);
//     }

//     return response.json();
//   },
// };

/**
 * Mock implementation for development
 * Remove when real API is integrated
 */
// export const mockAuthApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
    
//     // Mock successful response
//     return {
//       access_token: 'mock-token',
//       token_type: 'bearer',
//       user: {
//         id: '1',
//         email: credentials.email,
//       full_name: 'John Doe',
//       },
//     };
//   },

//   async signup(data: SignupData): Promise<AuthResponse> {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
    
//     // Mock successful response
//     return {
//       access_token: 'mock-token',
//       token_type: 'bearer',
//       user: {
//         id: '1',
//         email: data.email,
//          full_name:data.full_name,
//       },
//     };
//   },
// };

