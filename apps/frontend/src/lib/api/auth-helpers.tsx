/**
 * Helper functions for authentication flows
 * Use these in your login/signup pages
 */

import { authTokenManager } from "./auth"

/**
 * Handle successful login
 * Call this after receiving token from backend
 */
export const handleLoginSuccess = (token: string, redirectUrl = "/") => {
  console.log("[v0] Login successful, storing token...")
  authTokenManager.setToken(token)

  // Redirect after a short delay to ensure state is updated
  setTimeout(() => {
    window.location.href = redirectUrl
  }, 100)
}

/**
 * Handle logout
 */
export const handleLogout = (redirectUrl = "/login") => {
  console.log("[v0] Logging out, clearing token...")
  authTokenManager.clearToken()

  // Redirect after a short delay
  setTimeout(() => {
    window.location.href = redirectUrl
  }, 100)
}

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return authTokenManager.isLoggedIn()
}

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  return authTokenManager.getToken()
}

/**
 * Verify token with backend
 */
export const verifyToken = async (): Promise<boolean> => {
  const token = authTokenManager.getToken()

  if (!token) {
    console.warn("[v0] No token to verify")
    return false
  }

  try {
    const response = await fetch("/api/backend/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      console.log("[v0] Token verified successfully")
      return true
    } else if (response.status === 401) {
      console.warn("[v0] Token is invalid or expired")
      authTokenManager.clearToken()
      return false
    }

    return false
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return false
  }
}

/**
 * Refresh token (optional - if your backend supports it)
 */
export const refreshAuthToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/backend/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      authTokenManager.setToken(data.token)
      console.log("[v0] Token refreshed successfully")
      return true
    }

    return false
  } catch (error) {
    console.error("[v0] Token refresh error:", error)
    return false
  }
}
