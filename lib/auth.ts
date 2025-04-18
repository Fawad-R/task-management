// Authentication functions
import axios from "axios"

const API_BASE_URL = "/api"

export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    })

    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function registerUser(userData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    return response.data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function initializeAdmin(adminData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/init-admin`, adminData)
    return response.data
  } catch (error) {
    console.error("Initialize admin error:", error)
    throw error
  }
}

export async function checkAuthStatus() {
  // Check if user is logged in by verifying token
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (!token || !user) {
    return null
  }

  try {
    // Verify token with backend
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.valid) {
      return JSON.parse(user)
    } else {
      // Token is invalid, clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return null
    }
  } catch (error) {
    console.error("Token verification error:", error)
    // Clear localStorage on error
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return null
  }
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return
  }

  // Call logout API to clear cookies
  axios.post(`${API_BASE_URL}/auth/logout`).catch((error) => {
    console.error("Logout error:", error)
  })

  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
