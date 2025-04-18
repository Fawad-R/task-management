"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, UserCheck, Clock, Users } from "lucide-react"
import { fetchManagerDashboardStats } from "@/lib/api"

type DashboardStats = {
  totalAssignedUsers: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  userTasks: {
    userId: string
    userName: string
    totalTasks: number
    completedTasks: number
  }[]
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchManagerDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    )
  }

  // Mock data if API call fails
  const dashboardData = stats || {
    totalAssignedUsers: 5,
    totalTasks: 24,
    completedTasks: 10,
    pendingTasks: 9,
    inProgressTasks: 5,
    userTasks: [
      { userId: "1", userName: "Regular User One", totalTasks: 8, completedTasks: 3 },
      { userId: "2", userName: "Regular User Two", totalTasks: 6, completedTasks: 2 },
      { userId: "3", userName: "Regular User Three", totalTasks: 5, completedTasks: 3 },
      { userId: "4", userName: "Regular User Four", totalTasks: 3, completedTasks: 1 },
      { userId: "5", userName: "Regular User Five", totalTasks: 2, completedTasks: 1 },
    ],
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">Overview of your tasks and assigned users.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Assigned Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalAssignedUsers}</div>
                  <p className="text-xs text-muted-foreground">Users under your management</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">Your tasks and assigned users' tasks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((dashboardData.completedTasks / dashboardData.totalTasks) * 100)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">{dashboardData.inProgressTasks} in progress</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent activity for you and your assigned users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Task completed</p>
                        <p className="text-sm text-muted-foreground">
                          Regular User One completed "Client presentation" - 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">New task assigned</p>
                        <p className="text-sm text-muted-foreground">
                          You assigned "Update documentation" to Regular User Two - 4 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Task status updated</p>
                        <p className="text-sm text-muted-foreground">
                          Regular User Three changed "Code review" to In Progress - 6 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Task created</p>
                        <p className="text-sm text-muted-foreground">You created "Weekly report" - 1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Task Distribution</CardTitle>
                  <CardDescription>Current task status across all assigned users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.completedTasks} tasks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.inProgressTasks} tasks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.pendingTasks} tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Users</CardTitle>
                <CardDescription>Users assigned to you and their task progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.userTasks.map((user) => (
                    <div key={user.userId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{user.userName}</h3>
                        <span className="text-sm text-muted-foreground">
                          {user.completedTasks} / {user.totalTasks} tasks completed
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${Math.round((user.completedTasks / user.totalTasks) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
