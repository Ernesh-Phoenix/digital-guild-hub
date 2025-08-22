import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Play, Clock, Users, Trophy, CheckCircle, Lock } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button-cyber"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/course/video-player"
import { useAuth } from "@/context/AuthContext"
import { api, Course, Lesson } from "@/services/api"

const mockLessons: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Introduction to Web Security',
    content: '# Introduction to Web Security\n\nWeb security is a critical aspect of modern application development...',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '15 min',
    isCompleted: true,
    xpReward: 50,
    order: 1
  },
  {
    id: '2',
    courseId: '1',
    title: 'Understanding XSS Attacks',
    content: '# Cross-Site Scripting (XSS)\n\nXSS attacks are one of the most common...',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '22 min',
    isCompleted: true,
    xpReward: 75,
    order: 2
  },
  {
    id: '3',
    courseId: '1',
    title: 'CSRF Protection Methods',
    content: '# CSRF Protection\n\nCross-Site Request Forgery attacks...',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '18 min',
    isCompleted: false,
    xpReward: 60,
    order: 3
  },
  {
    id: '4',
    courseId: '1',
    title: 'SQL Injection Prevention',
    content: '# SQL Injection\n\nSQL injection is a code injection technique...',
    duration: '25 min',
    isCompleted: false,
    xpReward: 80,
    order: 4
  }
]

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    if (!courseId) return
    
    try {
      const courseData = await api.courses.getById(courseId)
      setCourse(courseData)
      setLessons(mockLessons.filter(l => l.courseId === courseId))
      setCurrentLesson(mockLessons.find(l => l.courseId === courseId) || null)
    } catch (error) {
      console.error('Failed to load course:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedLessons = lessons.filter(l => l.isCompleted).length
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  if (!user) {
    navigate('/login')
    return null
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userRole={user.role} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar userRole={user.role} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Back Button & Course Header */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Courses
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                {currentLesson?.videoUrl && (
                  <Card className="card-cyber overflow-hidden">
                    <VideoPlayer videoUrl={currentLesson.videoUrl} />
                  </Card>
                )}

                {/* Course Content */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{currentLesson?.title || course.title}</span>
                      {currentLesson && (
                        <Badge variant={currentLesson.isCompleted ? "default" : "outline"}>
                          {currentLesson.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="content" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="quiz">Quiz</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content" className="mt-6">
                        <div className="prose prose-invert max-w-none">
                          {currentLesson ? (
                            <div dangerouslySetInnerHTML={{ 
                              __html: currentLesson.content.replace(/\n/g, '<br>') 
                            }} />
                          ) : (
                            <div>
                              <h2>{course.title}</h2>
                              <p>{course.description}</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="quiz" className="mt-6">
                        <div className="text-center py-8">
                          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Quiz Coming Soon</h3>
                          <p className="text-muted-foreground">
                            Complete the lesson to unlock the quiz
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources" className="mt-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Additional Resources</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• OWASP Top 10 Security Risks</li>
                            <li>• Web Security Testing Guide</li>
                            <li>• Secure Coding Best Practices</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Info */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrolledCount}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProgressBar 
                      value={progressPercentage}
                      label="Course Progress"
                      showPercentage
                      color="xp"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Lessons</span>
                      <span>{completedLessons}/{lessons.length} completed</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson List */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="text-lg">Course Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          currentLesson?.id === lesson.id 
                            ? 'bg-primary/20 border border-primary/30' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setCurrentLesson(lesson)}
                      >
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : lesson.videoUrl ? (
                            <Play className="h-5 w-5 text-primary" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration} • {lesson.xpReward} XP
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Instructor */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {course.instructor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{course.instructor}</h4>
                        <p className="text-sm text-muted-foreground">Security Expert</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}