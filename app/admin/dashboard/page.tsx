"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDashboardStats } from "@/lib/api"
import { Users, CheckSquare, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type DashboardStats = {
  totalUsers: number
  totalManagers: number
  totalRegularUsers: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the task management system.</p>
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
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalManagers} managers, {stats.totalRegularUsers} regular users
                  </p>
                </CardContent>
              </Card>
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
                  <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingTasks} tasks still pending</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Task Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="flex items-center space-x-8">
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                          <span className="text-2xl font-bold">{stats.pendingTasks}</span>
                        </div>
                        <span className="mt-2 text-sm font-medium">Pending</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-32 rounded-full border-8 border-yellow-500 flex items-center justify-center">
                          <span className="text-2xl font-bold">{stats.inProgressTasks}</span>
                        </div>
                        <span className="mt-2 text-sm font-medium">In Progress</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                          <span className="text-2xl font-bold">{stats.completedTasks}</span>
                        </div>
                        <span className="mt-2 text-sm font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admins</span>
                      <span className="text-sm font-medium">
                        {stats.totalUsers - stats.totalManagers - stats.totalRegularUsers}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${((stats.totalUsers - stats.totalManagers - stats.totalRegularUsers) / stats.totalUsers) * 100 || 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Managers</span>
                      <span className="text-sm font-medium">{stats.totalManagers}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500"
                        style={{
                          width: `${(stats.totalManagers / stats.totalUsers) * 100 || 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Regular Users</span>
                      <span className="text-sm font-medium">{stats.totalRegularUsers}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(stats.totalRegularUsers / stats.totalUsers) * 100 || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
