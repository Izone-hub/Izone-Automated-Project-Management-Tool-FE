// lib/auth.ts
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

export const clearAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};


// import Cookies from 'js-cookie';


// const TOKEN_KEY = 'token';


// export function setToken(token: string) {
// // for simple usage; prefer httpOnly cookies from backend
// Cookies.set(TOKEN_KEY, token, { secure: true });
// }


// export function getToken(): string | undefined {
// return Cookies.get(TOKEN_KEY);
// }


// export function removeToken() {
// Cookies.remove(TOKEN_KEY);
