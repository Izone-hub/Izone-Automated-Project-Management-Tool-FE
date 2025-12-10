// /**
//  * Session management utilities for authentication
//  */

// export const validateCurrentSession = (): boolean => {
//   if (typeof window === 'undefined') return false;
  
//   const token = localStorage.getItem('auth_token');
//   const user = localStorage.getItem('user');
  
//   if (!token || !user) return false;
  
//   try {
//     JSON.parse(user); // Validate JSON
//     return true;
//   } catch {
//     // Clear corrupted data
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('user');
//     return false;
//   }
// };

// export const clearAllAuthData = (): void => {
//   if (typeof window === 'undefined') return;
  
//   localStorage.removeItem('auth_token');
//   localStorage.removeItem('user');
//   localStorage.removeItem('lastWorkspaceId');
  
//   // Clear any other auth-related keys
//   Object.keys(localStorage).forEach(key => {
//     if (key.includes('auth') || key.includes('token') || key.includes('session')) {
//       localStorage.removeItem(key);
//     }
//   });
  
//   // If using cookies
//   document.cookie.split(";").forEach(cookie => {
//     const [name] = cookie.trim().split("=");
//     if (name.includes('auth') || name.includes('token')) {
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     }
//   });
// };

// export const getCurrentUser = (): { email: string; full_name: string } | null => {
//   if (typeof window === 'undefined') return null;
  
//   const user = localStorage.getItem('user');
//   if (!user) return null;
  
//   try {
//     return JSON.parse(user);
//   } catch {
//     clearAllAuthData();
//     return null;
//   }
// };

// export const isTokenExpired = async (): Promise<boolean> => {
//   const token = localStorage.getItem('auth_token');
//   if (!token) return true;
  
//   // You can add token expiration logic here
//   // For now, we'll just validate it exists
//   return false;
// };