import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession();
    
    if (!session || session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch statistics
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalAttendance,
      todayAttendance,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.attendance.count(),
      prisma.attendance.count({
        where: {
          timestamp: {
            gte: today,
            lt: tomorrow,
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
