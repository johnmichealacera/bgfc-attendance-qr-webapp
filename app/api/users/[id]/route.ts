import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can view user details
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            studentId: true,
            qrCodeValue: true,
            qrCodeImageUrl: true,
            course: true,
          },
        },
        faculty: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can update users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { name, email, role, studentId, course } = await request.json()

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      })

      if (emailTaken) {
        return NextResponse.json(
          { message: 'Email is already taken by another user' },
          { status: 409 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        role,
      },
    })

    // Update role-specific records
    if (role === 'STUDENT' && studentId) {
      if (!course) {
        return NextResponse.json(
          { message: 'Course is required for student users' },
          { status: 400 }
        )
      }
      
      // Delete existing faculty record if any
      await prisma.faculty.deleteMany({
        where: { userId: params.id },
      })

      // Update or create student record
      await prisma.student.upsert({
        where: { userId: params.id },
        update: {
          studentId,
          qrCodeValue: studentId,
          course,
        },
        create: {
          studentId,
          qrCodeValue: studentId,
          course,
          yearLevel: '1st Year', // Default year level
          userId: params.id,
        },
      })
    }

    if (role === 'FACULTY') {
      // Delete existing student record if any
      await prisma.student.deleteMany({
        where: { userId: params.id },
      })

      // Update or create faculty record
      await prisma.faculty.upsert({
        where: { userId: params.id },
        update: {},
        create: {
          userId: params.id,
        },
      })
    }

    if (role === 'ADMIN') {
      // Delete existing student and faculty records
      await prisma.student.deleteMany({
        where: { userId: params.id },
      })
      await prisma.faculty.deleteMany({
        where: { userId: params.id },
      })
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prevent deletion of admin users
    if (existingUser.role === 'ADMIN') {
      return NextResponse.json(
        { message: 'Cannot delete admin users' },
        { status: 403 }
      )
    }

    // Delete user (cascades to student/faculty records)
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'User deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
