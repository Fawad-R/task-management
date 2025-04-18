import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  try {
    await dbConnect()

    // Check if admin exists
    const adminExists = await User.findOne({ role: "admin" })

    return NextResponse.json({
      needsInitialization: !adminExists,
    })
  } catch (error) {
    console.error("Check init error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
