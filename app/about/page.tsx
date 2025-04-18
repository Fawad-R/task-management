import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Task Manager</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  About Task Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 dark:text-slate-400 md:text-xl">
                  A comprehensive solution for managing tasks with role-based access control
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Role-Based Access Control</CardTitle>
                  <CardDescription>Different permissions for different user roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Admin</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Full system access to manage all users and tasks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Manager</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage their tasks and oversee assigned regular users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Regular User</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage their own tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>Comprehensive task management capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Task Management</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Create, edit, and delete tasks with status tracking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">User Management</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Admin can create and manage users with different roles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Filtering & Search</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Filter tasks by status, due date, and search by keywords
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="container flex flex-col gap-2 py-6 px-4 md:px-6">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2023 Task Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
