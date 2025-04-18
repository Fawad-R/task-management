import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Task from "@/models/Task"
import User from "@/models/User"
import { isManagerOrAdmin } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Get dashboard stats for admin
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Check if user is manager or admin
    const isAuthorized = await isManagerOrAdmin(req as AuthRequest)

    if (!isAuthorized) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const totalUsers = await User.countDocuments()
    const totalManagers = await User.countDocuments({ role: "manager" })
    const totalRegularUsers = await User.countDocuments({ role: "user" })

    const totalTasks = await Task.countDocuments()
    const completedTasks = await Task.countDocuments({ status: "completed" })
    const pendingTasks = await Task.countDocuments({ status: "pending" })
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" })

    return NextResponse.json({
      totalUsers,
      totalManagers,
      totalRegularUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
