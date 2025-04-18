"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/lib/api"

type User = {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "manager" | "user",
    managerId: "",
  })
  const [managers, setManagers] = useState<User[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    // Filter managers for the dropdown
    if (users.length > 0) {
      setManagers(users.filter((user) => user.role === "manager"))
    }
  }, [users])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
      // If API fails, we'll use mock data for demonstration
      setUsers([
        {
          _id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Manager One",
          email: "manager1@example.com",
          role: "manager",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Manager Two",
          email: "manager2@example.com",
          role: "manager",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "4",
          name: "Regular User One",
          email: "user1@example.com",
          role: "user",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "5",
          name: "Regular User Two",
          email: "user2@example.com",
          role: "user",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as "admin" | "manager" | "user",
    }))
  }

  const handleManagerChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      managerId: value,
    }))
  }

  const handleAddUser = async () => {
    try {
      const newUser = await createUser(formData)
      setUsers((prev) => [...prev, newUser])
      toast({
        title: "Success",
        description: "User created successfully.",
      })
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to create user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      const updatedUser = await updateUser(selectedUser._id, formData)
      setUsers((prev) => prev.map((user) => (user._id === selectedUser._id ? updatedUser : user)))
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUser(selectedUser._id)
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't populate password for security
      role: user.role,
      managerId: "", // This would need to be populated from the backend
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      managerId: "",
    })
    setSelectedUser(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage all users in the system.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. The user will receive an email with login instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === "user" && (
                <div className="grid gap-2">
                  <Label htmlFor="managerId">Assign to Manager</Label>
                  <Select value={formData.managerId} onValueChange={handleManagerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === "user" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-managerId">Assign to Manager</Label>
                  <Select value={formData.managerId} onValueChange={handleManagerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedUser && (
                <p>
                  You are about to delete <strong>{selectedUser.name}</strong> ({selectedUser.email}).
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
