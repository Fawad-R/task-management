"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuthStatus } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const user = await checkAuthStatus()

        if (!user) {
          router.push("/login")
          return
        }

        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "manager":
            router.push("/manager/dashboard")
            break
          case "user":
            router.push("/user/dashboard")
            break
          default:
            router.push("/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    redirectUser()
  }, [router])

  return <div className="flex h-screen items-center justify-center">{isLoading && <p>Loading...</p>}</div>
}
