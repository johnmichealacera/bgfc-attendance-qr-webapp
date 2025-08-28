'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  QrCode, 
  Users, 
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface FacultyStats {
  totalStudents: number
  todayAttendance: number
  weeklyAttendance: number
  monthlyAttendance: number
}

export default function FacultyDashboard() {
  const [stats, setStats] = useState<FacultyStats>({
    totalStudents: 0,
    todayAttendance: 0,
    weeklyAttendance: 0,
    monthlyAttendance: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only fetch stats in browser environment
    if (typeof window !== 'undefined') {
      fetchFacultyStats()
    }
  }, [])

  const fetchFacultyStats = async () => {
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/faculty/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching faculty stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'QR Scanner',
      description: 'Advanced scanner with morning/afternoon session tracking',
      icon: QrCode,
      href: '/dashboard/qr-scanner',
      color: 'bg-primary-500',
    },
    {
      title: 'View Attendance',
      description: 'Browse attendance records and reports',
      icon: Clock,
      href: '/dashboard/attendance',
      color: 'bg-success-500',
    },
    {
      title: 'Student List',
      description: 'View list of assigned students',
      icon: Users,
      href: '/dashboard/students',
      color: 'bg-warning-500',
    },
    {
      title: 'Reports',
      description: 'Generate attendance reports',
      icon: BarChart3,
      href: '/dashboard/reports',
      color: 'bg-error-500',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
        <p className="text-gray-600">Monitor student attendance and manage your classes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <Clock className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAttendance}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Calendar className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weeklyAttendance}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyAttendance}</p>
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

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Alice Johnson</p>
                <p className="text-sm text-gray-500">Main Gate • 2 hours ago</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bob Smith</p>
                <p className="text-sm text-gray-500">Main Gate • 1 hour ago</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Carol Davis</p>
                <p className="text-sm text-gray-500">Side Gate • 3 hours ago</p>
              </div>
              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                Present
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Present Today</span>
              <span className="text-success-600 font-bold">{stats.todayAttendance}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Absent Today</span>
              <span className="text-error-600 font-bold">
                {Math.max(0, stats.totalStudents - stats.todayAttendance)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="text-primary-600 font-bold">
                {stats.totalStudents > 0 
                  ? Math.round((stats.todayAttendance / stats.totalStudents) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Weekly Average</span>
              <span className="text-warning-600 font-bold">
                {Math.round(stats.weeklyAttendance / 7)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
