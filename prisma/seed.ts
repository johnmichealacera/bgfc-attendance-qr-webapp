import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // All data are just for testing purposes and not real/existing data
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@college.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create faculty users
  const facultyPasswordHash = await bcrypt.hash('faculty123', 12)
  const faculty1 = await prisma.user.upsert({
    where: { email: 'prof.smith@college.edu' },
    update: {},
    create: {
      name: 'Professor Smith',
      email: 'prof.smith@college.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
    },
  })

  const faculty2 = await prisma.user.upsert({
    where: { email: 'prof.johnson@college.edu' },
    update: {},
    create: {
      name: 'Professor Johnson',
      email: 'prof.johnson@college.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
    },
  })

  // Create faculty records
  await prisma.faculty.upsert({
    where: { userId: faculty1.id },
    update: {},
    create: { userId: faculty1.id },
  })

  await prisma.faculty.upsert({
    where: { userId: faculty2.id },
    update: {},
    create: { userId: faculty2.id },
  })
  console.log('✅ Faculty users created')

  // Create student users and records
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'Alice Johnson', email: 'alice.johnson@college.edu', studentId: 'S20250001' },
    { name: 'Bob Smith', email: 'bob.smith@college.edu', studentId: 'S20250002' },
    { name: 'Carol Davis', email: 'carol.davis@college.edu', studentId: 'S20250003' },
    { name: 'David Wilson', email: 'david.wilson@college.edu', studentId: 'S20250004' },
    { name: 'Eva Brown', email: 'eva.brown@college.edu', studentId: 'S20250005' },
  ]

  for (const studentData of students) {
    const user = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        name: studentData.name,
        email: studentData.email,
        passwordHash: studentPasswordHash,
        role: 'STUDENT',
      },
    })

    // Generate QR code
    const qrCodeValue = studentData.studentId
    const qrCodeImageUrl = await QRCode.toDataURL(qrCodeValue)

    await prisma.student.upsert({
      where: { studentId: studentData.studentId },
      update: {},
      create: {
        studentId: studentData.studentId,
        qrCodeValue,
        qrCodeImageUrl,
        course: 'BSCRIM', // Default course
        yearLevel: '1st Year', // Default year level
        userId: user.id,
      },
    })
  }
  console.log('✅ Student users created')

  // Create some sample attendance records
  const sampleAttendance = [
    { studentId: 'S20250001', gateLocation: 'Main Gate', hoursAgo: 2 },
    { studentId: 'S20250002', gateLocation: 'Main Gate', hoursAgo: 1 },
    { studentId: 'S20250003', gateLocation: 'Side Gate', hoursAgo: 3 },
    { studentId: 'S20250001', gateLocation: 'Main Gate', hoursAgo: 24 },
    { studentId: 'S20250004', gateLocation: 'Main Gate', hoursAgo: 48 },
  ]

  for (const attendance of sampleAttendance) {
    const timestamp = new Date()
    timestamp.setHours(timestamp.getHours() - attendance.hoursAgo)

    await prisma.attendance.create({
      data: {
        studentId: attendance.studentId,
        timestamp,
        gateLocation: attendance.gateLocation,
      },
    })
  }
  console.log('✅ Sample attendance records created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
