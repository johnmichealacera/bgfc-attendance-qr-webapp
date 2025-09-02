'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Search, Download, Eye, Filter, ChevronLeft, ChevronRight, QrCode } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import PdfImportButton from '@/components/dashboard/PdfImportButton'

interface Student {
  id: string
  studentId: string
  qrCodeValue: string
  qrCodeImageUrl: string
  course: string
  yearLevel: string
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

export default function AllStudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    year: '',
  })
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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
        ...(filters.course && { course: filters.course }),
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
        ...(filters.search && { search: filters.search }),
        ...(filters.course && { course: filters.course }),
        ...(filters.year && { year: filters.year }),
      })

      const response = await fetch(`/api/student/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'students.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Students exported successfully')
      } else {
        toast.error('Failed to export students')
      }
    } catch (error) {
      console.error('Error exporting students:', error)
      toast.error('Error exporting students')
    }
  }

  const viewQRCode = (student: Student) => {
    setSelectedStudent(student)
    setShowQRModal(true)
  }

  const getCourseBadgeColor = (course: string) => {
    const colors: { [key: string]: string } = {
      'BEED': 'bg-green-100 text-green-800 border-green-200',
      'BSED - English': 'bg-blue-100 text-blue-800 border-blue-200',
      'BSED - Math': 'bg-purple-100 text-purple-800 border-purple-200',
      'BSBA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'BSIT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'BSE': 'bg-pink-100 text-pink-800 border-pink-200',
      'BSCRIM': 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[course] || 'bg-gray-100 text-gray-800 border-gray-200'
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
    <div className="bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  All Students Directory
                </h1>
                <p className="text-gray-600">
                  View and manage all students in the system
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total Students:</span> {pagination.total}
                </div>
                <button
                  onClick={exportStudents}
                  className="inline-flex items-center px-4 py-2 bg-success-600 hover:bg-success-700 text-white font-medium rounded-md transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <PdfImportButton />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Students
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name or student ID"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Filter
                </label>
                <select
                  id="course"
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Courses</option>
                  <option value="BEED">BEED</option>
                  <option value="BSED - English">BSED - English</option>
                  <option value="BSED - Math">BSED - Math</option>
                  <option value="BSBA">BSBA</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSE">BSE</option>
                  <option value="BSCRIM">BSCRIM</option>
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year Level Filter
                </label>
                <select
                  id="year"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                  <option value="6">6th Year</option>
                  <option value="7">7th Year</option>
                  <option value="8">8th Year</option>
                  <option value="9">9th Year</option>
                  <option value="10">10th Year</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  setFilters({ search: '', course: '', year: '' })
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>

              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} students
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Students List
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
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
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
                                {student.user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.studentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCourseBadgeColor(student.course)}`}>
                              {/* <GraduationCap className="w-3 h-3 mr-1" /> */}
                              {student.course}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {student.yearLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student._count.attendance} records
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewQRCode(student)}
                                className="text-primary-600 hover:text-primary-900"
                                title="View QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
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
                        Page {pagination.page} of {pagination.pages}
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

      {/* QR Code Modal */}
      {showQRModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Student QR Code</h2>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedStudent.user.name}
                </h3>
                <p className="text-sm text-gray-600">{selectedStudent.studentId}</p>
                <p className="text-sm text-gray-600">{selectedStudent.course}</p>
              </div>
              
              <div className="mb-4">
                <img 
                  src={selectedStudent.qrCodeImageUrl} 
                  alt="QR Code" 
                  className="mx-auto border-2 border-gray-200 rounded-lg"
                  style={{ width: '200px', height: '200px' }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                QR Code Value: {selectedStudent.qrCodeValue}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
