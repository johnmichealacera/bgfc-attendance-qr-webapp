import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const sessionType: any = searchParams.get('sessionType')
    const date = searchParams.get('date')

    if (!studentId || !sessionType || !date) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 })
    }

    // Validate session type
    const validSessionTypes = ['MORNING_IN', 'MORNING_OUT', 'AFTERNOON_IN', 'AFTERNOON_OUT']
    if (!validSessionTypes.includes(sessionType)) {
      return NextResponse.json({ message: 'Invalid session type' }, { status: 400 })
    }

    // Parse date and create range for the day
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)

    // Check if attendance exists
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        student: {
          studentId: studentId
        },
        sessionType,
        sessionDate: {
          gte: targetDate,
          lt: nextDay
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      exists: !!existingAttendance,
      attendance: existingAttendance ? {
        id: existingAttendance.id,
        sessionType: existingAttendance.sessionType,
        timestamp: existingAttendance.timestamp,
        gateLocation: existingAttendance.gateLocation,
        notes: existingAttendance.notes,
        studentName: existingAttendance.student.user.name
      } : null
    })

  } catch (error) {
    console.error('Error checking attendance:', error)
    return NextResponse.json(
      { message: 'Error checking attendance' },
      { status: 500 }
    )
  }
}
