import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Task from "@/models/Task"
import User from "@/models/User"
import { authenticate } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Update a task
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { id } = params
    const { title, description, status, dueDate, assignedTo } = await req.json()

    // Find task
    const task = await Task.findById(id)

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Check permissions
    if (user.role === "user" && task.creatorId.toString() !== user.userId) {
      return NextResponse.json({ message: "Not authorized to update this task" }, { status: 403 })
    }

    if (user.role === "manager") {
      // Check if task belongs to manager or a user they manage
      if (task.creatorId.toString() !== user.userId) {
        const managedUser = await User.findOne({
          _id: task.creatorId,
          managerId: user.userId,
        })

        if (!managedUser) {
          return NextResponse.json({ message: "Not authorized to update this task" }, { status: 403 })
        }
      }
    }

    // Update fields
    if (title) task.title = title
    if (description !== undefined) task.description = description
    if (status) task.status = status
    if (dueDate) task.dueDate = dueDate

    // If manager or admin is reassigning the task
    if (assignedTo && (user.role === "admin" || user.role === "manager")) {
      task.creatorId = assignedTo
    }

    await task.save()

    // Populate creator info
    await task.populate("creatorId", "name email role")

    return NextResponse.json(task)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// Delete a task
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { id } = params

    // Find task
    const task = await Task.findById(id)

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Check permissions
    if (user.role === "user" && task.creatorId.toString() !== user.userId) {
      return NextResponse.json({ message: "Not authorized to delete this task" }, { status: 403 })
    }

    if (user.role === "manager") {
      // Check if task belongs to manager or a user they manage
      if (task.creatorId.toString() !== user.userId) {
        const managedUser = await User.findOne({
          _id: task.creatorId,
          managerId: user.userId,
        })

        if (!managedUser) {
          return NextResponse.json({ message: "Not authorized to delete this task" }, { status: 403 })
        }
      }
    }

    await Task.findByIdAndDelete(id)

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
