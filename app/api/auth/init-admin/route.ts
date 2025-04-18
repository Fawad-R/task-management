import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" })

    if (adminExists) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 })
    }

    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide name, email, and password" }, { status: 400 })
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    })

    // Return admin info (without password)
    return NextResponse.json(
      {
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Init admin error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
