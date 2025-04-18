import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/middleware/auth"
import type { AuthRequest } from "@/middleware/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req as AuthRequest)

    if (!user) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true, user })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 })
  }
}
