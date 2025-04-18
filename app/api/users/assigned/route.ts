import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { authenticate, isManagerOrAdmin } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Get users assigned to a manager
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Check if user is manager or admin
    const isAuthorized = await isManagerOrAdmin(req as AuthRequest)

    if (!isAuthorized) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    if (user.role === "admin") {
      // Admin can see all regular users
      const users = await User.find({ role: "user" }).select("-password")
      return NextResponse.json(users)
    }

    // Manager can see users assigned to them
    const users = await User.find({
      managerId: user.userId,
      role: "user",
    }).select("-password")

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get assigned users error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
