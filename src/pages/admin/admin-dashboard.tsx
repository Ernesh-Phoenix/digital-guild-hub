import { useState, useEffect } from "react"
import { Users, BookOpen, Shield, BarChart3, TrendingUp, UserPlus } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button-cyber"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { api, User, Course } from "@/services/api"
import { useNavigate } from "react-router-dom"

const mockStats = [
  { title: "Total Users", value: "1,247", icon: Users, color: "primary", change: "+12%" },
  { title: "Active Courses", value: "89", icon: BookOpen, color: "success", change: "+5%" },
  { title: "System Roles", value: "3", icon: Shield, color: "warning", change: "0%" },
  { title: "Monthly Signups", value: "156", icon: TrendingUp, color: "secondary", change: "+23%" }
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    try {
      const [usersData, coursesData] = await Promise.all([
        api.users.getAll(),
        api.courses.getAll()
      ])
      setUsers(usersData)
      setCourses(coursesData)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Admin <span className="gradient-text-primary">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  System overview and management controls
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="gradient"
                  onClick={() => navigate('/admin/users/new')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockStats.map((stat, index) => (
                <Card key={index} className="card-cyber">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={stat.change.startsWith('+') ? 'text-success' : 'text-muted-foreground'}>
                        {stat.change}
                      </span>
                      {' '}from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Management */}
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant={
                          user.role === 'admin' ? 'destructive' : 
                          user.role === 'instructor' ? 'default' : 'secondary'
                        }>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/admin/users')}
                  >
                    View All Users
                  </Button>
                </CardContent>
              </Card>

              {/* Course Management */}
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.enrolledCount} students • {course.instructor}
                          </p>
                        </div>
                        <Badge variant={
                          course.difficulty === 'Advanced' ? 'destructive' : 
                          course.difficulty === 'Intermediate' ? 'default' : 'secondary'
                        }>
                          {course.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/admin/courses')}
                  >
                    Manage Courses
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">245ms</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">2.1GB</div>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}