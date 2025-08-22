import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  Trophy, 
  PlusCircle,
  BarChart3,
  Shield,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button-cyber"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userRole: 'student' | 'instructor' | 'admin'
}

const menuItems = {
  student: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/achievements", icon: Trophy, label: "Achievements" },
    { href: "/profile", icon: Settings, label: "Profile" }
  ],
  instructor: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/courses", icon: BookOpen, label: "My Courses" },
    { href: "/create-course", icon: PlusCircle, label: "Create Course" },
    { href: "/students", icon: Users, label: "Students" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" }
  ],
  admin: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/users", icon: Users, label: "User Management" },
    { href: "/courses", icon: BookOpen, label: "Course Management" },
    { href: "/roles", icon: Shield, label: "Role Management" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" }
  ]
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const items = menuItems[userRole]

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold gradient-text-primary">
              CyberLearn
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-primary/10"
          >
            {isCollapsed ? <Menu /> : <X />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 glow-primary" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Role Badge */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Role
            </div>
            <div className="text-sm font-semibold text-foreground capitalize">
              {userRole}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}