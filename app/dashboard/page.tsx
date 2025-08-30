'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import FacultyDashboard from '@/components/dashboard/FacultyDashboard'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import Navigation from '@/components/layout/Navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { data: session, status }: any = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const renderDashboard = () => {
    switch (session.user.role) {
      case 'ADMIN':
        return <AdminDashboard />
      // case 'FACULTY':
      //   return <FacultyDashboard />
      case 'STUDENT':
        return <StudentDashboard />
      default:
        return <div>Unknown role</div>
    }
  }

  return (
    <div className="bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  )
}
