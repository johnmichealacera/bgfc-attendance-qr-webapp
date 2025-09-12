import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only faculty and admins can record attendance
    if (session.user.role !== 'FACULTY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { studentId, sessionType, gateLocation, notes } = body

    if (!studentId || !sessionType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate session type - now only MORNING and AFTERNOON
    const validSessionTypes = ['MORNING', 'AFTERNOON']
    if (!validSessionTypes.includes(sessionType)) {
      return NextResponse.json({ message: 'Invalid session type' }, { status: 400 })
    }

    // Get today's date (start of day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Determine if this should be IN or OUT based on existing attendance
    let actualSessionType: 'MORNING_IN' | 'MORNING_OUT' | 'AFTERNOON_IN' | 'AFTERNOON_OUT'
    if (sessionType === 'MORNING') {
      // Check if student already has MORNING_IN today
      const morningInExists = await prisma.attendance.findFirst({
        where: {
          studentId,
          sessionType: 'MORNING_IN',
          sessionDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      actualSessionType = morningInExists ? 'MORNING_OUT' : 'MORNING_IN'
    } else { // AFTERNOON
      // Check if student already has AFTERNOON_IN today
      const afternoonInExists = await prisma.attendance.findFirst({
        where: {
          studentId,
          sessionType: 'AFTERNOON_IN',
          sessionDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      actualSessionType = afternoonInExists ? 'AFTERNOON_OUT' : 'AFTERNOON_IN'
    }

    // Check if attendance already exists for this student, session type, and date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        sessionType: actualSessionType,
        sessionDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
        }
      }
    })

    if (existingAttendance) {
      return NextResponse.json({ 
        message: `Attendance already recorded for ${actualSessionType} today` 
      }, { status: 409 })
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        sessionType: actualSessionType,
        sessionDate: today,
        gateLocation: gateLocation || null,
        notes: notes || null,
        timestamp: new Date()
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Attendance recorded successfully for ${actualSessionType}`,
      attendance: {
        id: attendance.id,
        studentId: attendance.student.studentId,
        studentName: attendance.student.user.name,
        sessionType: actualSessionType,
        timestamp: attendance.timestamp,
        gateLocation: attendance.gateLocation,
        notes: attendance.notes
      }
    })

  } catch (error) {
    console.error('Error recording attendance:', error)
    return NextResponse.json(
      { message: JSON.stringify(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const date = searchParams.get('date')
    const sessionType = searchParams.get('sessionType')
    const gateLocation = searchParams.get('gateLocation')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        {
          student: {
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          student: {
            studentId: {
              contains: search,
            },
          },
        },
      ]
    }
    
    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
      
      where.sessionDate = {
        gte: startDate,
        lt: endDate
      }
    }

    if (sessionType) {
      where.sessionType = sessionType
    }

    if (gateLocation) {
      where.gateLocation = gateLocation
    }

    // Get all attendance records for grouping
    const allAttendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: [
        { student: { user: { name: 'asc' } } },
        { sessionDate: 'desc' },
        { timestamp: 'desc' }
      ]
    })

    // Group attendance by student and date
    const groupedAttendance = new Map<string, any>()

    allAttendance.forEach(record => {
      const studentKey = `${record.student.studentId}-${record.sessionDate.toISOString().split('T')[0]}`
      
      if (!groupedAttendance.has(studentKey)) {
        groupedAttendance.set(studentKey, {
          studentId: record.student.studentId,
          studentName: record.student.user.name,
          studentEmail: record.student.user.email,
          course: record.student.course,
          yearLevel: record.student.yearLevel,
          date: record.sessionDate.toISOString().split('T')[0],
          MORNING_IN: null,
          MORNING_OUT: null,
          AFTERNOON_IN: null,
          AFTERNOON_OUT: null,
          gateLocation: record.gateLocation,
          notes: record.notes
        })
      }

      const group = groupedAttendance.get(studentKey)
      group[record.sessionType] = {
        timestamp: record.timestamp,
        gateLocation: record.gateLocation,
        notes: record.notes,
        id: record.id
      }
    })

    // Convert to array and apply pagination
    const groupedArray = Array.from(groupedAttendance.values())
    const total = groupedArray.length
    const pages = Math.ceil(total / limit)
    const paginatedAttendance = groupedArray.slice(skip, skip + limit)

    return NextResponse.json({
      attendance: paginatedAttendance,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { message: 'Error fetching attendance records' },
      { status: 500 }
    )
  }
}
