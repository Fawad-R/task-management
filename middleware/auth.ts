import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export async function authenticate(req: AuthRequest) {
  try {
    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }

    return req.user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function isAdmin(req: AuthRequest) {
  const user = await authenticate(req)

  if (!user || user.role !== "admin") {
    return false
  }

  return true
}

export async function isManagerOrAdmin(req: AuthRequest) {
  const user = await authenticate(req)

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    return false
  }

  return true
}
