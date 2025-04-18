// API functions for tasks and users
import axios from "axios"

// Create axios instance with base URL
const API_BASE_URL = "/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// User API functions
export async function fetchUsers() {
  try {
    const response = await api.get("/users")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function createUser(userData: any) {
  try {
    const response = await api.post("/users", userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(userId: string, userData: any) {
  try {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export async function fetchAssignedUsers() {
  try {
    const response = await api.get("/users/assigned")
    return response.data
  } catch (error) {
    console.error("Error fetching assigned users:", error)
    throw error
  }
}

// Task API functions
export async function fetchTasks() {
  try {
    const response = await api.get("/tasks")
    return response.data
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export async function fetchUserTasks() {
  try {
    const response = await api.get("/tasks")
    return response.data
  } catch (error) {
    console.error("Error fetching user tasks:", error)
    throw error
  }
}

export async function createTask(taskData: any) {
  try {
    const response = await api.post("/tasks", taskData)
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export async function updateTask(taskId: string, taskData: any) {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    return response.data
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  try {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

// Dashboard stats API functions
export async function fetchDashboardStats() {
  try {
    const response = await api.get("/tasks/admin/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

export async function fetchManagerDashboardStats() {
  try {
    // For manager dashboard, we'll use the tasks endpoint and process the data
    const response = await api.get("/tasks")
    const tasks = response.data

    // Get assigned users
    const usersResponse = await api.get("/users/assigned")
    const assignedUsers = usersResponse.data

    // Process data for dashboard
    const totalAssignedUsers = assignedUsers.length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task: any) => task.status === "completed").length
    const pendingTasks = tasks.filter((task: any) => task.status === "pending").length
    const inProgressTasks = tasks.filter((task: any) => task.status === "in-progress").length

    // Calculate tasks per user
    const userTasks = assignedUsers.map((user: any) => {
      const userTaskList = tasks.filter((task: any) => task.creatorId === user._id || task.creatorId._id === user._id)

      return {
        userId: user._id,
        userName: user.name,
        totalTasks: userTaskList.length,
        completedTasks: userTaskList.filter((task: any) => task.status === "completed").length,
      }
    })

    return {
      totalAssignedUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      userTasks,
    }
  } catch (error) {
    console.error("Error fetching manager dashboard stats:", error)
    throw error
  }
}

export async function fetchUserDashboardStats() {
  try {
    // For user dashboard, we'll use the tasks endpoint and process the data
    const response = await api.get("/tasks")
    const tasks = response.data

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task: any) => task.status === "completed").length
    const pendingTasks = tasks.filter((task: any) => task.status === "pending").length
    const inProgressTasks = tasks.filter((task: any) => task.status === "in-progress").length

    // Get upcoming tasks (due in the next 7 days)
    const now = new Date()
    const oneWeekLater = new Date(now)
    oneWeekLater.setDate(now.getDate() + 7)

    const upcomingTasks = tasks
      .filter((task: any) => {
        const dueDate = new Date(task.dueDate)
        return dueDate >= now && dueDate <= oneWeekLater
      })
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5) // Get top 5 upcoming tasks

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      upcomingTasks,
    }
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error)
    throw error
  }
}
