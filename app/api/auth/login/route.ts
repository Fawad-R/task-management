import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Please provide email and password" }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user info (without password)
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
