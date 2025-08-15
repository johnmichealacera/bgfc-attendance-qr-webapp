import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')
    const gateLocation = searchParams.get('gateLocation')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (studentId) {
      where.student = {
        studentId: studentId
      }
    }
    
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
      where.timestamp = {
        gte: startDate,
        lt: endDate,
      }
    }
    
    if (gateLocation) {
      where.gateLocation = gateLocation
    }

    // Fetch attendance records with pagination
    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where }),
    ])

    return NextResponse.json({
      attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { studentId, gateLocation, timestamp } = await request.json()

    if (!studentId || !gateLocation) {
      return NextResponse.json(
        { message: 'Student ID and gate location are required' },
        { status: 400 }
      )
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { studentId },
    })

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      )
    }

    // Check for duplicate attendance within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { message: 'Attendance already logged within the last 5 minutes' },
        { status: 409 }
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        gateLocation,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Attendance logged successfully',
      attendance,
    })

  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
