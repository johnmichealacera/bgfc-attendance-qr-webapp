import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'FACULTY') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    // Fetch statistics
    const [
      totalStudents,
      todayAttendance,
      weeklyAttendance,
      monthlyAttendance,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.attendance.count({
        where: {
          timestamp: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          timestamp: {
            gte: weekAgo,
          },
        },
      }),
      prisma.attendance.count({
        where: {
          timestamp: {
            gte: monthAgo,
          },
        },
      }),
    ])

    return NextResponse.json({
      totalStudents,
      todayAttendance,
      weeklyAttendance,
      monthlyAttendance,
    })

  } catch (error) {
    console.error('Error fetching faculty stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
