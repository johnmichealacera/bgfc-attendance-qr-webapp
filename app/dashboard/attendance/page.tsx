'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Clock, Search, Filter, Download, Calendar, MapPin, User } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { toast } from 'react-hot-toast'

interface AttendanceRecord {
  id: string
  timestamp: string
  gateLocation: string
  student: {
    studentId: string
    user: {
      name: string
      email: string
    }
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AttendancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    gateLocation: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchAttendance()
    }
  }, [session, pagination.page, filters])

  const fetchAttendance = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.date && { date: filters.date }),
        ...(filters.gateLocation && { gateLocation: filters.gateLocation }),
      })

      const response = await fetch(`/api/attendance?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAttendance(data.attendance)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch attendance records')
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      toast.error('Error fetching attendance records')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const exportAttendance = async () => {
    try {
      const params = new URLSearchParams({
        limit: '1000', // Export all records
        ...(filters.search && { search: filters.search }),
        ...(filters.date && { date: filters.date }),
        ...(filters.gateLocation && { gateLocation: filters.gateLocation }),
      })

      const response = await fetch(`/api/attendance?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        // Convert to CSV
        const csvContent = [
          ['Student ID', 'Student Name', 'Email', 'Gate Location', 'Timestamp'],
          ...data.attendance.map((record: AttendanceRecord) => [
            record.student.studentId,
            record.student.user.name,
            record.student.user.email,
            record.gateLocation,
            new Date(record.timestamp).toLocaleString(),
          ])
        ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast.success('Attendance exported successfully')
      } else {
        toast.error('Failed to export attendance')
      }
    } catch (error) {
      console.error('Error exporting attendance:', error)
      toast.error('Error exporting attendance')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Attendance Records
            </h1>
            <p className="text-gray-600">
              View and manage student attendance records
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Student
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name or ID"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    id="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gateLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Gate Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    id="gateLocation"
                    value={filters.gateLocation}
                    onChange={(e) => handleFilterChange('gateLocation', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Gates</option>
                    <option value="Main Gate">Main Gate</option>
                    <option value="Back Gate">Back Gate</option>
                    <option value="Side Gate">Side Gate</option>
                    <option value="Faculty Entrance">Faculty Entrance</option>
                    <option value="Student Entrance">Student Entrance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  setFilters({ search: '', date: '', gateLocation: '' })
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>

              <button
                onClick={exportAttendance}
                className="inline-flex items-center px-4 py-2 bg-success-600 hover:bg-success-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Attendance Records ({pagination.total})
              </h3>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading attendance records...</p>
              </div>
            ) : attendance.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No attendance records found
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gate Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendance.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.student.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.student.studentId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <MapPin className="w-3 h-3 mr-1" />
                              {record.gateLocation}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              {new Date(record.timestamp).toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} results
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
