import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Find student record
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
    })

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 })
    }

    // Get date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    // Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: student.id,
        timestamp: {
          gte: monthAgo,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    // Calculate statistics
    const totalDays = attendanceRecords.length
    const presentDays = totalDays
    const absentDays = 0 // Simplified - in real app, you'd calculate based on expected attendance days
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Sort by date ascending for streak calculation
    const sortedRecords = [...attendanceRecords].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    for (let i = 0; i < sortedRecords.length; i++) {
      if (i === 0) {
        tempStreak = 1
      } else {
        const prevDate = new Date(sortedRecords[i - 1].timestamp)
        const currDate = new Date(sortedRecords[i].timestamp)
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dayDiff === 1) {
          tempStreak++
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak
          }
          tempStreak = 1
        }
      }
    }

    // Check final streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }

    // Current streak (consecutive days from today)
    const todayRecord = attendanceRecords.find(record => {
      const recordDate = new Date(record.timestamp)
      return recordDate.toDateString() === today.toDateString()
    })

    if (todayRecord) {
      currentStreak = 1
      // Count backwards for current streak
      for (let i = 1; i < sortedRecords.length; i++) {
        const prevDate = new Date(sortedRecords[sortedRecords.length - i - 1].timestamp)
        const currDate = new Date(sortedRecords[sortedRecords.length - i].timestamp)
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dayDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      totalDays,
      presentDays,
      absentDays,
      attendanceRate,
      currentStreak,
      longestStreak,
    })

  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
