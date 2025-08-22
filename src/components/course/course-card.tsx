import { Clock, Users, Trophy, Play } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button-cyber"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail: string
    instructor: string
    duration: string
    enrolledCount: number
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    category: string
    progress?: number
    isEnrolled?: boolean
    xpReward: number
  }
  onEnroll?: (courseId: string) => void
  onContinue?: (courseId: string) => void
}

const difficultyColors = {
  Beginner: "bg-success text-success-foreground",
  Intermediate: "bg-warning text-warning-foreground", 
  Advanced: "bg-destructive text-destructive-foreground"
}

export function CourseCard({ course, onEnroll, onContinue }: CourseCardProps) {
  return (
    <Card className="card-cyber group hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Course Category */}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
          {course.category}
        </Badge>
        
        {/* Difficulty */}
        <Badge className={`absolute top-3 right-3 ${difficultyColors[course.difficulty]}`}>
          {course.difficulty}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.enrolledCount}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            {course.xpReward} XP
          </div>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Instructor: </span>
          <span className="font-medium text-foreground">{course.instructor}</span>
        </div>

        {/* Progress for enrolled courses */}
        {course.isEnrolled && course.progress !== undefined && (
          <ProgressBar 
            value={course.progress} 
            label="Progress"
            showPercentage
            color="xp"
            size="sm"
          />
        )}
      </CardContent>

      <CardFooter>
        {course.isEnrolled ? (
          <Button 
            className="w-full" 
            variant="cyber"
            onClick={() => onContinue?.(course.id)}
          >
            <Play className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="gradient"
            onClick={() => onEnroll?.(course.id)}
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}