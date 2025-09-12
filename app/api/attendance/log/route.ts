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

    // Validate session type - now only TIME_IN and TIME_OUT
    const validSessionTypes = ['TIME_IN', 'TIME_OUT']
    if (!validSessionTypes.includes(sessionType)) {
      return NextResponse.json({ message: 'Invalid session type' }, { status: 400 })
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

    // Get today's date (start of day) in Philippines timezone
    const philippinesTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"})
    const today = new Date(philippinesTime)
    today.setHours(0, 0, 0, 0)
    
    const currentTime = new Date(philippinesTime)
    const currentHour = currentTime.getHours()

    // Determine if this should be MORNING or AFTERNOON based on current time
    // Morning: 6:00 AM - 12:00 PM (6-11), Afternoon: 12:00 PM - 10:00 PM (12-22)
    const isMorning = currentHour >= 6 && currentHour < 12
    const isAfternoon = currentHour >= 12 && currentHour < 22
    
    if (!isMorning && !isAfternoon) {
      return NextResponse.json({ 
        message: 'Attendance can only be recorded between 6:00 AM and 6:00 PM' 
      }, { status: 400 })
    }

    // Determine the actual session type based on TIME_IN/TIME_OUT and existing records
    let actualSessionType: 'MORNING_IN' | 'MORNING_OUT' | 'AFTERNOON_IN' | 'AFTERNOON_OUT'
    
    if (sessionType === 'TIME_IN') {
      // Check if student already has IN for this time period today
      const inSessionType = isMorning ? 'MORNING_IN' : 'AFTERNOON_IN'
      const existingIn = await prisma.attendance.findFirst({
        where: {
          studentId: student.id,
          sessionType: inSessionType,
          sessionDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      if (existingIn) {
        return NextResponse.json({ 
          message: `Student already has ${inSessionType} recorded today` 
        }, { status: 409 })
      }
      
      actualSessionType = inSessionType
    } else { // TIME_OUT
      // Check if student has IN for this time period today
      const inSessionType = isMorning ? 'MORNING_IN' : 'AFTERNOON_IN'
      const outSessionType = isMorning ? 'MORNING_OUT' : 'AFTERNOON_OUT'
      
      const existingIn = await prisma.attendance.findFirst({
        where: {
          studentId: student.id,
          sessionType: inSessionType,
          sessionDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      if (!existingIn) {
        return NextResponse.json({ 
          message: `Student must have ${inSessionType} before recording ${outSessionType}` 
        }, { status: 400 })
      }
      
      // Check if OUT already exists
      const existingOut = await prisma.attendance.findFirst({
        where: {
          studentId: student.id,
          sessionType: outSessionType,
          sessionDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      if (existingOut) {
        return NextResponse.json({ 
          message: `Student already has ${outSessionType} recorded today` 
        }, { status: 409 })
      }
      
      actualSessionType = outSessionType
    }

    // Check for duplicate attendance within 5 minutes (same session type)
    const fiveMinutesAgo = new Date(new Date(philippinesTime).getTime() - 5 * 60 * 1000)
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        sessionType: actualSessionType,
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { message: `Attendance already logged for ${actualSessionType} within the last 5 minutes` },
        { status: 409 }
      )
    }

    // Log attendance
    const attendance = await prisma.attendance.create({
      data: {
        studentId: student.id,
        gateLocation,
        timestamp: new Date(philippinesTime),
        sessionType: actualSessionType,
        sessionDate: new Date(philippinesTime), // Use Philippines time
        notes: notes || null, // Add notes support
      },
    })

    return NextResponse.json({
      id: attendance.id,
      studentId: student.studentId,
      studentName: student.user.name,
      timestamp: attendance.timestamp,
      gateLocation: attendance.gateLocation,
      sessionType: attendance.sessionType, // Return actual sessionType
      notes: attendance.notes,             // Return notes
      message: `Attendance logged successfully for ${actualSessionType}`,
    })

  } catch (error) {
    console.error('Error logging attendance:', error)
    return NextResponse.json(
      { message: JSON.stringify(error) },
      { status: 500 }
    )
  }
}
