'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  QrCode, 
  Calendar, 
  TrendingUp,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface StudentStats {
  totalDays: number
  presentDays: number
  absentDays: number
  attendanceRate: number
  currentStreak: number
  longestStreak: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendanceRate: 0,
    currentStreak: 0,
    longestStreak: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only fetch stats in browser environment
    if (typeof window !== 'undefined') {
      fetchStudentStats()
    }
  }, [])

  const fetchStudentStats = async () => {
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/student/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching student stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'My QR Code',
      description: 'View and download your personal QR code',
      icon: QrCode,
      href: '/dashboard/my-qr',
      color: 'bg-primary-500',
    },
    {
      title: 'Attendance History',
      description: 'View your complete attendance record',
      icon: Clock,
      href: '/dashboard/my-attendance',
      color: 'bg-success-500',
    },
    {
      title: 'Download Report',
      description: 'Get your attendance report as PDF',
      icon: Download,
      href: '/dashboard/download-report',
      color: 'bg-warning-500',
    },
  ]

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Track your attendance and access your personal QR code</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.presentDays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 rounded-lg">
              <XCircle className="w-6 h-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.absentDays}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div className={`p-3 ${action.color} rounded-lg w-fit mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Attendance Summary and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Current Streak</span>
              <span className="text-primary-600 font-bold">{stats.currentStreak} days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Longest Streak</span>
              <span className="text-success-600 font-bold">{stats.longestStreak} days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">This Month</span>
              <span className="text-warning-600 font-bold">
                {Math.round((stats.presentDays / Math.max(1, stats.totalDays)) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Overall Performance</span>
              <span className={`font-bold ${
                stats.attendanceRate >= 90 ? 'text-success-600' :
                stats.attendanceRate >= 75 ? 'text-warning-600' : 'text-error-600'
              }`}>
                {stats.attendanceRate >= 90 ? 'Excellent' :
                 stats.attendanceRate >= 75 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Today</p>
                <p className="text-sm text-gray-500">Main Gate • 9:00 AM</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Yesterday</p>
                <p className="text-sm text-gray-500">Main Gate • 8:45 AM</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">2 days ago</p>
                <p className="text-sm text-gray-500">Main Gate • 9:15 AM</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Chart Placeholder */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Attendance chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
