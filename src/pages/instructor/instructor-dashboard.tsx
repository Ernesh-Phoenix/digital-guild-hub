import { useState, useEffect } from "react"
import { BookOpen, Users, Plus, Upload, BarChart3, Star } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button-cyber"
import { Badge } from "@/components/ui/badge"
import { CourseCard } from "@/components/course/course-card"
import { useAuth } from "@/context/AuthContext"
import { api, Course } from "@/services/api"
import { useNavigate } from "react-router-dom"

const mockStats = [
  { title: "My Courses", value: "12", icon: BookOpen, color: "primary" },
  { title: "Total Students", value: "1,834", icon: Users, color: "success" },
  { title: "Avg Rating", value: "4.8", icon: Star, color: "warning" },
  { title: "Total Revenue", value: "$8,420", icon: BarChart3, color: "secondary" }
]

const mockInstructorCourses = [
  {
    id: '1',
    title: 'Advanced Web Security',
    description: 'Learn advanced techniques for securing web applications against modern threats.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    instructor: 'You',
    duration: '6h 30m',
    enrolledCount: 1247,
    difficulty: 'Advanced' as const,
    category: 'Security',
    xpReward: 500,
    tags: ['Web Security', 'XSS', 'CSRF']
  },
  {
    id: '2',
    title: 'Ethical Hacking Fundamentals',
    description: 'Introduction to ethical hacking principles and penetration testing methodologies.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    instructor: 'You',
    duration: '4h 15m',
    enrolledCount: 2103,
    difficulty: 'Beginner' as const,
    category: 'Hacking',
    xpReward: 300,
    tags: ['Ethical Hacking', 'Penetration Testing']
  }
]

export default function InstructorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'instructor') {
      navigate('/dashboard')
      return
    }
    loadCourses()
  }, [user, navigate])

  const loadCourses = async () => {
    try {
      // In real app, filter by instructor ID
      setCourses(mockInstructorCourses)
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'instructor') {
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
                  Instructor <span className="gradient-text-primary">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user.name}! Ready to inspire learners?
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/instructor/upload')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
                </Button>
                <Button 
                  variant="gradient"
                  onClick={() => navigate('/instructor/courses/new')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
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
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Courses */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Courses</h2>
                <Button variant="outline" onClick={() => navigate('/instructor/courses')}>
                  View All Courses
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course}
                    onContinue={(id) => navigate(`/instructor/courses/${id}/edit`)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="gradient" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/instructor/courses/new')}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Create New Course
                  </Button>
                  <Button 
                    variant="matrix" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/instructor/students')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    Manage Students
                  </Button>
                  <Button 
                    variant="neon" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/instructor/analytics')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm">New student enrolled in "Advanced Web Security"</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">Course "Ethical Hacking" received new review</span>
                    </div>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-sm">Assignment submitted for review</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
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