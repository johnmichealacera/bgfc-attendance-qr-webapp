'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, QrCode, GraduationCap, Users, Clock } from 'lucide-react'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Login successful!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
                  <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              QR Attendance System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline college attendance tracking with modern QR technology. 
              Fast, secure, and efficient for students, faculty, and administrators.
            </p>
            
            {/* Public QR Scanner Access */}
            <div className="mt-8">
              <a
                href="/qr-scanner"
                className="inline-flex items-center px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Access Public QR Scanner
              </a>
              <p className="text-sm text-gray-500 mt-2">
                No login required - Perfect for school gates
              </p>
            </div>
          </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Login Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Sign In to Your Account
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Demo Accounts:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@college.edu / admin123</p>
                <p><strong>Faculty:</strong> prof.smith@college.edu / faculty123</p>
                <p><strong>Student:</strong> alice.johnson@college.edu / student123</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    QR Code Technology
                  </h3>
                  <p className="text-gray-600">
                    Each student gets a unique QR code for quick and secure attendance tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-success-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Real-time Tracking
                  </h3>
                  <p className="text-gray-600">
                    Monitor attendance in real-time with instant notifications and updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Role-based Access
                  </h3>
                  <p className="text-gray-600">
                    Secure access control with different permissions for students, faculty, and administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
