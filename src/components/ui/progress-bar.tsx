import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showPercentage?: boolean
  label?: string
  color?: "primary" | "secondary" | "xp" | "success" | "warning"
  size?: "sm" | "md" | "lg"
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    value, 
    max = 100, 
    className, 
    showPercentage = false, 
    label, 
    color = "primary",
    size = "md",
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }
    
    const colorClasses = {
      primary: "bg-gradient-to-r from-primary to-primary-glow",
      secondary: "bg-gradient-to-r from-secondary to-secondary-glow", 
      xp: "bg-gradient-to-r from-xp to-secondary",
      success: "bg-gradient-to-r from-success to-success",
      warning: "bg-gradient-to-r from-warning to-warning"
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {showPercentage && (
              <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div className={cn("progress-bar", sizeClasses[size])}>
          <div
            className={cn(
              "progress-fill transition-all duration-700 ease-out",
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }