'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { 
  QrCode, 
  Users, 
  Clock, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Download
} from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getNavItems = () => {
    if (!session) return []

    switch (session.user.role) {
      case 'ADMIN':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
          { href: '/dashboard/users', label: 'Manage Users', icon: Users },
          { href: '/dashboard/attendance', label: 'Attendance Records', icon: Clock },
          { href: '/dashboard/qr-scanner', label: 'QR Scanner', icon: QrCode },
        ]
      case 'FACULTY':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
          { href: '/dashboard/attendance', label: 'View Attendance', icon: Clock },
          { href: '/dashboard/qr-scanner', label: 'QR Scanner', icon: QrCode },
        ]
      case 'STUDENT':
        return [
          { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
          { href: '/dashboard/my-qr', label: 'My QR Code', icon: QrCode },
          { href: '/dashboard/my-attendance', label: 'My Attendance', icon: Clock },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">QR Attendance</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session?.user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{session?.user.role?.toLowerCase()}</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-error-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{session?.user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{session?.user.role?.toLowerCase()}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-error-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
