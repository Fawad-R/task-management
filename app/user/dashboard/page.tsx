"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchUserDashboardStats } from "@/lib/api"
import { CheckSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type UserDashboardStats = {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  upcomingTasks: Array<{
    _id: string
    title: string
    status: string
    dueDate: string
  }>
}

export default function UserDashboardPage() {
  const [stats, setStats] = useState<UserDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUserDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch user dashboard stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "completed":
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <span className="text-red-500">Overdue</span>
    } else if (diffDays === 0) {
      return <span className="text-orange-500">Due today</span>
    } else {
      return <span>{diffDays} days left</span>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Overview of your tasks and progress.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <CardTitle className="h-6 bg-gray-200 rounded"></CardTitle>
                  <CardDescription className="h-4 bg-gray-100 rounded mt-2"></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.completedTasks / stats.totalTasks) * 100 || 0).toFixed(1)}% completion rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.inProgressTasks / stats.totalTasks) * 100 || 0).toFixed(1)}% of all tasks
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.completedTasks / stats.totalTasks) * 100 || 0).toFixed(1)}% of all tasks
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.pendingTasks / stats.totalTasks) * 100 || 0).toFixed(1)}% of all tasks
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.upcomingTasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Time Remaining</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.upcomingTasks.map((task) => (
                        <TableRow key={task._id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getDaysRemaining(task.dueDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <p>No upcoming tasks due in the next 7 days.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>No data available. Please try again later.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
