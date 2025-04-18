import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Task from "@/models/Task"
import User from "@/models/User"
import { authenticate } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Get all tasks (filtered by role)
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Admin can see all tasks
    if (user.role === "admin") {
      const tasks = await Task.find().populate("creatorId", "name email role")
      return NextResponse.json(tasks)
    }

    // Manager can see their tasks and tasks of users they manage
    if (user.role === "manager") {
      const managedUsers = await User.find({ managerId: user.userId })
      const managedUserIds = managedUsers.map((user) => user._id)

      const tasks = await Task.find({
        $or: [{ creatorId: user.userId }, { creatorId: { $in: managedUserIds } }],
      }).populate("creatorId", "name email role")

      return NextResponse.json(tasks)
    }

    // Regular users can only see their tasks
    const tasks = await Task.find({ creatorId: user.userId }).populate("creatorId", "name email role")
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// Create a new task
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { title, description, status, dueDate, assignedTo } = await req.json()

    // Validate input
    if (!title) {
      return NextResponse.json({ message: "Please provide a title" }, { status: 400 })
    }

    // If manager or admin is creating a task for another user
    let creatorId = user.userId
    if (assignedTo && (user.role === "admin" || user.role === "manager")) {
      creatorId = assignedTo
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      dueDate,
      creatorId,
    })

    // Populate creator info
    await task.populate("creatorId", "name email role")

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
