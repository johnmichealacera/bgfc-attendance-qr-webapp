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

    // Only admins can export users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }
    
    if (role) {
      where.role = role
    }

    // Fetch all users for export
    const users = await prisma.user.findMany({
      where,
      include: {
        student: {
          select: {
            studentId: true,
            qrCodeValue: true,
            course: true,
          },
        },
        faculty: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Convert to CSV
    const csvContent = [
      ['Name', 'Email', 'Role', 'Student ID', 'Course', 'Created Date'],
      ...users.map((user) => [
        user.name,
        user.email,
        user.role,
        user.student?.studentId || '',
        user.student?.course || '',
        new Date(user.createdAt).toLocaleDateString(),
      ])
    ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n')

    // Return CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="users.csv"',
      },
    })

  } catch (error) {
    console.error('Error exporting users:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
