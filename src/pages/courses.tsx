import { useState, useEffect } from "react"
import { Search, Filter, BookOpen, Users, Clock } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { CourseCard } from "@/components/course/course-card"
import { Button } from "@/components/ui/button-cyber"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { api, Course } from "@/services/api"
import { useNavigate } from "react-router-dom"

const categories = ["All", "Security", "Hacking", "Networking", "Forensics", "Programming"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function Courses() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, selectedCategory, selectedDifficulty])

  const loadCourses = async () => {
    try {
      const data = await api.courses.getAll()
      setCourses(data)
    } catch (error) {
      console.error('Failed to load courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty)
    }

    setFilteredCourses(filtered)
  }

  const handleEnroll = async (courseId: string) => {
    if (!user) return
    try {
      await api.courses.enroll(courseId, user.id)
      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true, enrolledCount: course.enrolledCount + 1 }
          : course
      ))
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  const handleContinue = (courseId: string) => {
    navigate(`/course/${courseId}`)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  <span className="gradient-text-primary">Course</span> Catalog
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover and master cybersecurity skills
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Card className="card-cyber p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-semibold">{courses.length} courses</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="card-cyber p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 cyber-input"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((difficulty) => (
                        <Badge
                          key={difficulty}
                          variant={selectedDifficulty === difficulty ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => setSelectedDifficulty(difficulty)}
                        >
                          {difficulty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Sort by: Popular
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="card-cyber animate-pulse">
                      <div className="h-48 bg-muted rounded-t-lg" />
                      <CardContent className="p-6 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      onContinue={handleContinue}
                    />
                  ))}
                </div>
              )}

              {!loading && filteredCourses.length === 0 && (
                <Card className="card-cyber p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}