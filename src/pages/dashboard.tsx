import { useState, useEffect } from "react"
import { BookOpen, Trophy, Clock, TrendingUp, Users, Star } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { CourseCard } from "@/components/course/course-card"
import { Button } from "@/components/ui/button-cyber"
import { useNavigate } from "react-router-dom"

// Mock data - replace with actual API calls
const mockUser = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@cyberlearn.com',
  role: 'student' as const,
  level: 15,
  xp: 2450,
  xpToNext: 550,
  completedCourses: 8,
  currentStreak: 12
}

const mockStats = [
  { title: "Courses Completed", value: "8", icon: BookOpen, color: "primary" },
  { title: "Total XP Earned", value: "2,450", icon: Trophy, color: "xp" },
  { title: "Learning Streak", value: "12 days", icon: TrendingUp, color: "success" },
  { title: "Study Time", value: "34h", icon: Clock, color: "secondary" }
]

const mockRecentCourses = [
  {
    id: '1',
    title: 'Advanced Web Security',
    description: 'Learn advanced techniques for securing web applications against modern threats.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    instructor: 'Sarah Mitchell',
    duration: '6h 30m',
    enrolledCount: 1247,
    difficulty: 'Advanced' as const,
    category: 'Security',
    progress: 65,
    isEnrolled: true,
    xpReward: 500
  },
  {
    id: '2', 
    title: 'Ethical Hacking Basics',
    description: 'Introduction to ethical hacking principles and penetration testing fundamentals.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    instructor: 'Marcus Rodriguez',
    duration: '4h 15m',
    enrolledCount: 2103,
    difficulty: 'Beginner' as const,
    category: 'Hacking',
    progress: 25,
    isEnrolled: true,
    xpReward: 300
  }
]

export default function Dashboard() {
  const [user] = useState(mockUser)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const xpProgress = (user.xp / (user.xp + user.xpToNext)) * 100

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, <span className="gradient-text-primary">{user.name}</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Ready to continue your cyber learning journey?
                </p>
              </div>
              
              {/* Level & XP */}
              <Card className="card-cyber p-4 lg:w-80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-level text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {user.level}
                    </div>
                    <span className="font-semibold">Level {user.level}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user.xp} / {user.xp + user.xpToNext} XP
                  </span>
                </div>
                <ProgressBar 
                  value={xpProgress} 
                  color="xp"
                  size="sm"
                />
              </Card>
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

            {/* Current Courses */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Continue Learning</h2>
                <Button variant="outline" onClick={() => navigate('/courses')}>
                  View All Courses
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockRecentCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course}
                    onContinue={(id) => navigate(`/course/${id}`)}
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
                    onClick={() => navigate('/courses')}
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    Browse Courses
                  </Button>
                  <Button 
                    variant="matrix" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/achievements')}
                  >
                    <Trophy className="h-6 w-6 mb-2" />
                    View Achievements
                  </Button>
                  <Button 
                    variant="neon" 
                    className="h-20 flex-col"
                    onClick={() => navigate('/profile')}
                  >
                    <Star className="h-6 w-6 mb-2" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}