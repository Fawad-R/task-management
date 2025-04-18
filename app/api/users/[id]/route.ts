import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Task from "@/models/Task"
import { isAdmin } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

// Update a user (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Check if user is admin
    const isAdminUser = await isAdmin(req as AuthRequest)

    if (!isAdminUser) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const { id } = params
    const { name, email, password, role, managerId } = await req.json()

    // Find user
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update fields
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (managerId && role === "user") user.managerId = managerId

    // Update password if provided
    if (password) {
      user.password = password
    }

    await user.save()

    // Return updated user (without password)
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      managerId: user.managerId,
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// Delete a user (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Check if user is admin
    const isAdminUser = await isAdmin(req as AuthRequest)

    if (!isAdminUser) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const { id } = params

    // Delete user
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Delete all tasks created by this user
    await Task.deleteMany({ creatorId: id })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
