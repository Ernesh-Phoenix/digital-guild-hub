import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button-cyber"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock password reset - replace with actual API call
    setTimeout(() => {
      if (email) {
        setSent(true)
        toast({
          title: "Reset Link Sent",
          description: "Check your email for password reset instructions",
        })
      } else {
        toast({
          title: "Email Required",
          description: "Please enter your email address",
          variant: "destructive"
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive reset instructions"
    >
      {!sent ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 cyber-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <Button 
            type="submit" 
            className="w-full" 
            variant="cyber" 
            size="lg"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Back to Login */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-success" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setSent(false)}
              variant="outline" 
              className="w-full"
            >
              Try different email
            </Button>
            
            <Link to="/login">
              <Button variant="cyber" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}