'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, Search, Filter, Download, GraduationCap, Calendar, Mail } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { toast } from 'react-hot-toast'

interface Student {
  id: string
  studentId: string
  qrCodeValue: string
  qrCodeImageUrl: string | null
  createdAt: string
  user: {
    name: string
    email: string
    createdAt: string
  }
  _count: {
    attendance: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function StudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    year: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStudents()
    }
  }, [session, pagination.page, filters])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.year && { year: filters.year }),
      })

      const response = await fetch(`/api/student?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch students')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Error fetching students')
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

  const exportStudents = async () => {
    try {
      const params = new URLSearchParams({
        limit: '1000', // Export all students
        ...(filters.search && { search: filters.search }),
        ...(filters.year && { year: filters.year }),
      })

      const response = await fetch(`/api/student?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        // Convert to CSV
        const csvContent = [
          ['Student ID', 'Name', 'Email', 'QR Code', 'Attendance Count', 'Created Date'],
          ...data.students.map((student: Student) => [
            student.studentId,
            student.user.name,
            student.user.email,
            student.qrCodeValue,
            student._count.attendance,
            new Date(student.createdAt).toLocaleDateString(),
          ])
        ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `students-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast.success('Students exported successfully')
      } else {
        toast.error('Failed to export students')
      }
    } catch (error) {
      console.error('Error exporting students:', error)
      toast.error('Error exporting students')
    }
  }

  const downloadQRCode = (studentId: string, qrCodeImageUrl: string) => {
    const link = document.createElement('a')
    link.href = qrCodeImageUrl
    link.download = `qr-${studentId}.png`
    link.click()
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
              Student Records
            </h1>
            <p className="text-gray-600">
              View and manage student information and QR codes
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    id="year"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  setFilters({ search: '', year: '' })
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>

              <button
                onClick={exportStudents}
                className="inline-flex items-center px-4 py-2 bg-success-600 hover:bg-success-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Students ({pagination.total})
              </h3>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No students found
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
                          QR Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.studentId}
                              </div>
                              <div className="text-sm text-gray-400">
                                {student.user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {student.qrCodeImageUrl && (
                                <img
                                  src={student.qrCodeImageUrl}
                                  alt={`QR Code for ${student.studentId}`}
                                  className="w-12 h-12 border border-gray-200 rounded"
                                />
                              )}
                              <div>
                                <div className="text-sm font-mono text-gray-900">
                                  {student.qrCodeValue}
                                </div>
                                {student.qrCodeImageUrl && (
                                  <button
                                    onClick={() => downloadQRCode(student.studentId, student.qrCodeImageUrl!)}
                                    className="text-xs text-primary-600 hover:text-primary-800"
                                  >
                                    Download QR
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Users className="w-3 h-3 mr-1" />
                              {student._count.attendance}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              {new Date(student.createdAt).toLocaleDateString()}
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
