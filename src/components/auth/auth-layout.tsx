import { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import heroImage from "@/assets/hero-bg.jpg"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(1px)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-md">
        <Card className="card-cyber p-8 backdrop-blur-lg border-primary/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text-primary mb-2">
              CyberLearn
            </h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </Card>
      </div>
    </div>
  )
}