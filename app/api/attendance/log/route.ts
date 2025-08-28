import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateAndSanitizeQR } from '@/utils/qr-validation'
// import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Allow public access for attendance logging (no authentication required)
    // This enables the QR scanner to work at school gates without login

    const { qrCode, gateLocation, sessionType, notes } = await request.json()

    if (!qrCode || !gateLocation) {
      return NextResponse.json(
        { message: 'QR code and gate location are required' },
        { status: 400 }
      )
    }

    // Validate and sanitize QR code format using centralized validation
    const validation = validateAndSanitizeQR(qrCode)
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.error || `Invalid QR code format ${qrCode}` },
        { status: 400 }
      )
    }
    
    const sanitizedQrCode = validation.sanitized

    // Find student by QR code
    const student = await prisma.student.findUnique({
      where: { qrCodeValue: sanitizedQrCode },
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

    // Check for duplicate attendance within 5 minutes (same session type)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        sessionType: sessionType,
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { message: `Attendance already logged for ${sessionType} within the last 5 minutes` },
        { status: 409 }
      )
    }

    // Log attendance
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        gateLocation,
        timestamp: new Date(),
        sessionType,
        notes: notes || null, // Add notes support
      },
    })

    return NextResponse.json({
      id: attendance.id,
      studentId: student.studentId,
      studentName: student.user.name,
      timestamp: attendance.timestamp,
      gateLocation: attendance.gateLocation,
      sessionType: attendance.sessionType, // Return sessionType
      notes: attendance.notes,             // Return notes
      message: 'Attendance logged successfully',
    })

  } catch (error) {
    console.error('Error logging attendance:', error)
    return NextResponse.json(
      { message: JSON.stringify(error) },
      { status: 500 }
    )
  }
}
