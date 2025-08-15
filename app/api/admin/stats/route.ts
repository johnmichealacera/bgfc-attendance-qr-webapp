import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

    // Fetch statistics
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalAttendance,
      todayAttendance
    ] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.attendance.count(),
      prisma.attendance.count({
        where: {
          timestamp: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalFaculty,
      totalAttendance,
      todayAttendance,
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
