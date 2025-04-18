import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { isAdmin } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Check if user is admin
    const isAdminUser = await isAdmin(req as AuthRequest)

    if (!isAdminUser) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    // Get all users
    const users = await User.find().select("-password")

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// Create a new user (admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Check if user is admin
    const isAdminUser = await isAdmin(req as AuthRequest)

    if (!isAdminUser) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const { name, email, password, role, managerId } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide name, email, and password" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: role || "user",
    }

    if (managerId && role === "user") {
      userData.managerId = managerId
    }

    const user = await User.create(userData)

    // Return user info (without password)
    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
