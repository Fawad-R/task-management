"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchAssignedUsers } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

type User = {
  _id: string
  name: string
  email: string
  role: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
}

export default function AssignedUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewTasksDialogOpen, setIsViewTasksDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAssignedUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch assigned users:", error)
      toast({
        title: "Error",
        description: "Failed to load assigned users. Please try again.",
        variant: "destructive",
      })
      // Mock data for demonstration
      setUsers([
        {
          _id: "1",
          name: "Regular User One",
          email: "user1@example.com",
          role: "user",
          totalTasks: 8,
          completedTasks: 3,
          pendingTasks: 5,
        },
        {
          _id: "2",
          name: "Regular User Two",
          email: "user2@example.com",
          role: "user",
          totalTasks: 6,
          completedTasks: 2,
          pendingTasks: 4,
        },
        {
          _id: "3",
          name: "Regular User Three",
          email: "user3@example.com",
          role: "user",
          totalTasks: 5,
          completedTasks: 3,
          pendingTasks: 2,
        },
        {
          _id: "4",
          name: "Regular User Four",
          email: "user4@example.com",
          role: "user",
          totalTasks: 3,
          completedTasks: 1,
          pendingTasks: 2,
        },
        {
          _id: "5",
          name: "Regular User Five",
          email: "user5@example.com",
          role: "user",
          totalTasks: 2,
          completedTasks: 1,
          pendingTasks: 1,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredUsers(filtered)
  }

  const viewUserTasks = (user: User) => {
    setSelectedUser(user)
    setIsViewTasksDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assigned Users</h1>
          <p className="text-muted-foreground">Manage users assigned to you.</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.totalTasks}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${Math.round((user.completedTasks / user.totalTasks) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((user.completedTasks / user.totalTasks) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => viewUserTasks(user)}>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            View Tasks
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View User Tasks Dialog */}
        <Dialog open={isViewTasksDialogOpen} onOpenChange={setIsViewTasksDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedUser?.name}'s Tasks</DialogTitle>
              <DialogDescription>View and manage tasks for this user.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedUser?.totalTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{selectedUser?.completedTasks}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{selectedUser?.pendingTasks}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock task data for the selected user */}
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Complete project documentation</div>
                        <div className="text-sm text-muted-foreground">
                          Finalize all documentation for the Q3 project
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Client presentation</div>
                        <div className="text-sm text-muted-foreground">Prepare slides for the client meeting</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          In Progress
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(Date.now() + 86400000 * 1).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Weekly report</div>
                        <div className="text-sm text-muted-foreground">Submit weekly progress report</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(Date.now() - 86400000 * 1).toLocaleDateString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewTasksDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
