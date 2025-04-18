import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password, role = "user" } = await req.json()

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
    const user = await User.create({
      name,
      email,
      password,
      role,
    })

    // Return user info (without password)
    return NextResponse.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
