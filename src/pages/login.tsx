import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button-cyber"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock authentication - replace with actual API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Mock successful login
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'John Doe',
          email: formData.email,
          role: 'student' // Default role, could be determined by API
        }))
        
        toast({
          title: "Login Successful",
          description: "Welcome to CyberLearn!",
        })
        
        navigate('/dashboard')
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials",
          variant: "destructive"
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <AuthLayout 
      title="Access Terminal" 
      subtitle="Enter your credentials to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 cyber-input"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10 cyber-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Button 
          type="submit" 
          className="w-full" 
          variant="cyber" 
          size="lg"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Initialize Session"}
        </Button>

        <Separator className="my-6" />

        {/* Links */}
        <div className="text-center space-y-2">
          <div>
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:text-primary-glow transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              Register here
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}