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
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const course = searchParams.get('course')

    const skip = (page - 1) * limit

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

    // Fetch students with pagination
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        select: {
          id: true,
          studentId: true,
          qrCodeValue: true,
          qrCodeImageUrl: true,
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
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ])

    return NextResponse.json({
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()

    console.log('session', session)
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, name, email, course, yearLevel } = body

    if (!studentId || !name || !email || !course || !yearLevel) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Find the student
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 })
    }

    // Update student data
    const updatedStudent = await prisma.student.update({
      where: { studentId },
      data: {
        course,
        yearLevel,
        user: {
          update: {
            name,
            email
          }
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: {
        id: updatedStudent.id,
        studentId: updatedStudent.studentId,
        course: updatedStudent.course,
        yearLevel: updatedStudent.yearLevel,
        user: updatedStudent.user
      }
    })

  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { message: 'Error updating student' },
      { status: 500 }
    )
  }
}
