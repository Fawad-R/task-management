"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, CheckSquare, LogOut, Menu, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { logoutUser } from "@/lib/auth"

type DashboardLayoutProps = {
  children: React.ReactNode
}

type UserType = {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logoutUser()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderNavLinks = () => {
    if (user.role === "admin") {
      return (
        <>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
          <Link
            href="/admin/tasks"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <CheckSquare className="h-4 w-4" />
            Tasks
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </>
      )
    } else if (user.role === "manager") {
      return (
        <>
          <Link
            href="/manager/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/manager/users"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <Users className="h-4 w-4" />
            Assigned Users
          </Link>
          <Link
            href="/manager/tasks"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <CheckSquare className="h-4 w-4" />
            Tasks
          </Link>
        </>
      )
    } else {
      return (
        <>
          <Link
            href="/user/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/user/tasks"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50"
          >
            <CheckSquare className="h-4 w-4" />
            My Tasks
          </Link>
        </>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="grid gap-2 py-6">
              <div className="flex items-center gap-2 px-2">
                <User className="h-6 w-6" />
                <span className="text-lg font-semibold">{user.name}</span>
              </div>
              <nav className="grid gap-1 px-2 text-lg font-medium">{renderNavLinks()}</nav>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CheckSquare className="h-6 w-6" />
            <span className="hidden md:inline-block">Task Management</span>
          </Link>
          <nav className="hidden flex-1 md:flex">
            <div className="flex gap-4 text-sm font-medium">{renderNavLinks()}</div>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
