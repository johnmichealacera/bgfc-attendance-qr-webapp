import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { qrCode, gateLocation } = await request.json()

    if (!qrCode || !gateLocation) {
      return NextResponse.json(
        { message: 'QR code and gate location are required' },
        { status: 400 }
      )
    }

    // Validate QR code format
    if (!/^S\d{8}$/.test(qrCode)) {
      return NextResponse.json(
        { message: 'Invalid QR code format' },
        { status: 400 }
      )
    }

    // Find student by QR code
    const student = await prisma.student.findUnique({
      where: { qrCodeValue: qrCode },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
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

    // Log attendance
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        gateLocation,
        timestamp: new Date(),
      },
    })

    return NextResponse.json({
      id: attendance.id,
      studentId: student.studentId,
      studentName: student.user.name,
      timestamp: attendance.timestamp,
      gateLocation: attendance.gateLocation,
      message: 'Attendance logged successfully',
    })

  } catch (error) {
    console.error('Error logging attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
