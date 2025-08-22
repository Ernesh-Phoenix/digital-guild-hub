// Mock API service - replace with actual API calls later
export interface Course {
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
  lessons?: Lesson[]
  tags: string[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  videoUrl?: string
  duration: string
  isCompleted?: boolean
  xpReward: number
  order: number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  avatar?: string
  level?: number
  xp?: number
  enrolledCourses?: string[]
  createdAt: string
  lastActive: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Web Security',
    description: 'Learn advanced techniques for securing web applications against modern threats including XSS, CSRF, and injection attacks.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    instructor: 'Sarah Mitchell',
    duration: '6h 30m',
    enrolledCount: 1247,
    difficulty: 'Advanced',
    category: 'Security',
    xpReward: 500,
    tags: ['Web Security', 'XSS', 'CSRF', 'Authentication']
  },
  {
    id: '2',
    title: 'Ethical Hacking Fundamentals',
    description: 'Introduction to ethical hacking principles and penetration testing methodologies.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    instructor: 'Marcus Rodriguez',
    duration: '4h 15m',
    enrolledCount: 2103,
    difficulty: 'Beginner',
    category: 'Hacking',
    xpReward: 300,
    tags: ['Ethical Hacking', 'Penetration Testing', 'Reconnaissance']
  },
  {
    id: '3',
    title: 'Network Security Analysis',
    description: 'Deep dive into network protocols, traffic analysis, and intrusion detection systems.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    instructor: 'Dr. Jennifer Park',
    duration: '8h 45m',
    enrolledCount: 856,
    difficulty: 'Intermediate',
    category: 'Networking',
    xpReward: 400,
    tags: ['Network Security', 'IDS', 'Traffic Analysis', 'Protocols']
  },
  {
    id: '4',
    title: 'Digital Forensics',
    description: 'Learn how to investigate digital crimes and analyze evidence from various digital sources.',
    thumbnail: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400',
    instructor: 'Michael Chen',
    duration: '5h 20m',
    enrolledCount: 634,
    difficulty: 'Intermediate',
    category: 'Forensics',
    xpReward: 450,
    tags: ['Digital Forensics', 'Evidence Analysis', 'Investigation']
  }
]

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    role: 'student',
    level: 15,
    xp: 2450,
    enrolledCourses: ['1', '2'],
    createdAt: '2024-01-15',
    lastActive: '2024-03-10'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    role: 'instructor',
    createdAt: '2023-09-20',
    lastActive: '2024-03-09'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01',
    lastActive: '2024-03-10'
  }
]

// API functions
export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      const user = mockUsers.find(u => u.email === email)
      if (user && password) {
        return { success: true, user }
      }
      throw new Error('Invalid credentials')
    },
    
    register: async (name: string, email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'student',
        level: 1,
        xp: 0,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
      mockUsers.push(newUser)
      return { success: true, user: newUser }
    }
  },

  // Courses
  courses: {
    getAll: async (): Promise<Course[]> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockCourses
    },
    
    getById: async (id: string): Promise<Course> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const course = mockCourses.find(c => c.id === id)
      if (!course) throw new Error('Course not found')
      return course
    },
    
    create: async (courseData: Omit<Course, 'id' | 'enrolledCount'>): Promise<Course> => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        enrolledCount: 0
      }
      mockCourses.push(newCourse)
      return newCourse
    },
    
    update: async (id: string, courseData: Partial<Course>): Promise<Course> => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = mockCourses.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Course not found')
      mockCourses[index] = { ...mockCourses[index], ...courseData }
      return mockCourses[index]
    },
    
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockCourses.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Course not found')
      mockCourses.splice(index, 1)
    },
    
    enroll: async (courseId: string, userId: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const course = mockCourses.find(c => c.id === courseId)
      if (course) {
        course.enrolledCount += 1
        course.isEnrolled = true
      }
    }
  },

  // Users
  users: {
    getAll: async (): Promise<User[]> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockUsers
    },
    
    getById: async (id: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const user = mockUsers.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      return user
    },
    
    update: async (id: string, userData: Partial<User>): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = mockUsers.findIndex(u => u.id === id)
      if (index === -1) throw new Error('User not found')
      mockUsers[index] = { ...mockUsers[index], ...userData }
      return mockUsers[index]
    },
    
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockUsers.findIndex(u => u.id === id)
      if (index === -1) throw new Error('User not found')
      mockUsers.splice(index, 1)
    }
  },

  // Progress
  progress: {
    getUserProgress: async (userId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        totalXP: 2450,
        level: 15,
        completedCourses: 8,
        currentStreak: 12,
        certificates: ['web-security-basic', 'ethical-hacking-101']
      }
    }
  }
}