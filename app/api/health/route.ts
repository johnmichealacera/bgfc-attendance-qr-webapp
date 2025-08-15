import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Simple query to keep connection alive and test database
    await prisma.$queryRaw`SELECT 1`
    
    const dbResponseTime = Date.now() - startTime
    
    // Get basic system stats
    const [userCount, studentCount, facultyCount, attendanceCount] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.attendance.count(),
    ])

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`,
        stats: {
          users: userCount,
          students: studentCount,
          faculty: facultyCount,
          attendance: attendanceCount,
        }
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        status: 'disconnected',
      }
    }, { status: 500 })
  }
}
