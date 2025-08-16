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
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const course = searchParams.get('course')

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          studentId: {
            contains: search,
          },
        },
      ]
    }
    
    if (year) {
      where.yearLevel = year
    }

    if (course) {
      where.course = course
    }

    // Fetch all students for export
    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        studentId: true,
        qrCodeValue: true,
        course: true,
        yearLevel: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            attendance: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    })

    // Convert to CSV
    const csvContent = [
      ['Name', 'Email', 'Student ID', 'Course', 'Year Level', 'QR Code Value', 'Attendance Records', 'Created Date'],
      ...students.map((student) => [
        student.user.name,
        student.user.email,
        student.studentId,
        student.course,
        student.yearLevel,
        student.qrCodeValue,
        student._count.attendance,
        new Date(student.createdAt).toLocaleDateString(),
      ])
    ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n')

    // Return CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="students.csv"',
      },
    })

  } catch (error) {
    console.error('Error exporting students:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
