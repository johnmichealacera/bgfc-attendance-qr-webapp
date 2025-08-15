import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 1 database seed...')

  // Create admin user if it doesn't exist
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

  // Create faculty users if they don't exist
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

  // Create student users and records - Batch 1 (Students 1-103)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'BSCRIM 1', email: '2025-0000206@bgfc.edu.ph', studentId: '2025-0000206' },
    { name: 'ABAO, KRISHA MAE M.', email: '2022-0004018@bgfc.edu.ph', studentId: '2022-0004018' },
    { name: 'ABAO, LEAMIE R', email: '2022-0004118@bgfc.edu.ph', studentId: '2022-0004118' },
    { name: 'ABAO, RYZA P.', email: '2023-0000057@bgfc.edu.ph', studentId: '2023-0000057' },
    { name: 'ACEVEDO, JORIAH BOHOL', email: '2022-0003945@bgfc.edu.ph', studentId: '2022-0003945' },
    { name: 'ADLAO, ANGEL BESINGA', email: '2024-0000012@bgfc.edu.ph', studentId: '2024-0000012' },
    { name: 'ADLAO, CHEMIKA D.', email: '2022-0004045@bgfc.edu.ph', studentId: '2022-0004045' },
    { name: 'ADLAO, CHYKIE GELSANO', email: '2024-0000119@bgfc.edu.ph', studentId: '2024-0000119' },
    { name: 'ADLAO, CRISLYN ALONG', email: '2025-0000235@bgfc.edu.ph', studentId: '2025-0000235' },
    { name: 'ADLAO, CRISNA M.', email: '2023-0000152@bgfc.edu.ph', studentId: '2023-0000152' },
    { name: 'ADLAO, DANAYA MEDRANO', email: '2025-0000078@bgfc.edu.ph', studentId: '2025-0000078' },
    { name: 'ADLAO, GOLDA BIA G.', email: '2022-0004004@bgfc.edu.ph', studentId: '2022-0004004' },
    { name: 'ADLAO, JEFFER J.', email: '2020-0003372@bgfc.edu.ph', studentId: '2020-0003372' },
    { name: 'ADLAO, JOHN LLOYD DIGAL', email: '2025-0000171@bgfc.edu.ph', studentId: '2025-0000171' },
    { name: 'ADLAO, KATRINA CHANE D.', email: '2023-0000125@bgfc.edu.ph', studentId: '2023-0000125' },
    { name: 'ADLAO, MAICO V.', email: '2023-0000077@bgfc.edu.ph', studentId: '2023-0000077' },
    { name: 'ADLAO, REGINE T.', email: '2022-0003937@bgfc.edu.ph', studentId: '2022-0003937' },
    { name: 'ADLAO, SHIEKH ZAHED H', email: '2025-0000145@bgfc.edu.ph', studentId: '2025-0000145' },
    { name: 'ADLAO, SHIEKHA JEAN H', email: '2025-0000129@bgfc.edu.ph', studentId: '2025-0000129' },
    { name: 'ADLAO, TESSA A', email: '2023-0000105@bgfc.edu.ph', studentId: '2023-0000105' },
    { name: 'ADLAO, WELBEN, JR. CUBILLAN', email: '2025-0000188@bgfc.edu.ph', studentId: '2025-0000188' },
    { name: 'ALABAT, ICEE CLAIRE P', email: '2022-0003949@bgfc.edu.ph', studentId: '2022-0003949' },
    { name: 'ALABAT, MELJONES CORAMBAO', email: '2022-0003920@bgfc.edu.ph', studentId: '2022-0003920' },
    { name: 'ALABAT, SHEENA KARYLLE Y.', email: '2023-0000161@bgfc.edu.ph', studentId: '2023-0000161' },
    { name: 'ALCALA, MICALEN ILIGAN', email: '2025-0000009@bgfc.edu.ph', studentId: '2025-0000009' },
    { name: 'ALCALA, REYMARK JAMES J.', email: '2022-0004001@bgfc.edu.ph', studentId: '2022-0004001' },
    { name: 'ALICAÑA, SHENA-JEAN T.', email: '2023-0000089@bgfc.edu.ph', studentId: '2023-0000089' },
    { name: 'ALOLOR, IJAY E.', email: '2022-0004193@bgfc.edu.ph', studentId: '2022-0004193' },
    { name: 'ALOLOR, LYKA JEAN ETOM', email: '2025-0000011@bgfc.edu.ph', studentId: '2025-0000011' },
    { name: 'ANGCOG, AIRA JANE A', email: '2022-0004067@bgfc.edu.ph', studentId: '2022-0004067' },
    { name: 'ANGCOG, CHALS DEMBE P', email: '2025-0000141@bgfc.edu.ph', studentId: '2025-0000141' },
    { name: 'ANGCOG, JAMES PANGATUNGAN', email: '2025-0000100@bgfc.edu.ph', studentId: '2025-0000100' },
    { name: 'ANGCOG, RENZ LAURENTE', email: '2024-0000146@bgfc.edu.ph', studentId: '2024-0000146' },
    { name: 'ANGCOG, RICHELLE BEA CAPISTRANO', email: '2025-0000023@bgfc.edu.ph', studentId: '2025-0000023' },
    { name: 'ANTIGRO, CRISIA MAE S.', email: '2022-0004023@bgfc.edu.ph', studentId: '2022-0004023' },
    { name: 'ANTIGRO, DANNA MAE M', email: '2022-0004138@bgfc.edu.ph', studentId: '2022-0004138' },
    { name: 'ANTIGRO, JAYCO R.', email: '2022-0004189@bgfc.edu.ph', studentId: '2022-0004189' },
    { name: 'ANTIGRO, NATHANIEL R', email: '2022-0004077@bgfc.edu.ph', studentId: '2022-0004077' },
    { name: 'ANTIPASADO, GREATCHELL D', email: '2022-0004192@bgfc.edu.ph', studentId: '2022-0004192' },
    { name: 'APORBO, HYRAJANE A.', email: '2022-0004043@bgfc.edu.ph', studentId: '2022-0004043' },
    { name: 'APORBO, LARAMIE C.', email: '2022-0004048@bgfc.edu.ph', studentId: '2022-0004048' },
    { name: 'ARCULAR, DANIELLA KHIA CARDUZA', email: '2025-0000037@bgfc.edu.ph', studentId: '2025-0000037' },
    { name: 'ARCULAR, GLAIVY PAGALAN', email: '2024-0000060@bgfc.edu.ph', studentId: '2024-0000060' },
    { name: 'ARCULAR, JAME HARRY BATO', email: '2024-0000049@bgfc.edu.ph', studentId: '2024-0000049' },
    { name: 'ARCULAR, JAY MARK D', email: '2022-0004071@bgfc.edu.ph', studentId: '2022-0004071' },
    { name: 'ARCULAR, JENICEL P.', email: '2019-0002770@bgfc.edu.ph', studentId: '2019-0002770' },
    { name: 'ARCULAR, JUNEL JR CANTA', email: '2024-0000112@bgfc.edu.ph', studentId: '2024-0000112' },
    { name: 'ARCULAR, JUNERIZ OSLOB', email: '2025-0000190@bgfc.edu.ph', studentId: '2025-0000190' },
    { name: 'ARCULAR, KATE MAITE ESCALANTE', email: '2024-0000099@bgfc.edu.ph', studentId: '2024-0000099' },
    { name: 'ARCULAR, KRISTINE P.', email: '2019-0003021@bgfc.edu.ph', studentId: '2019-0003021' },
    { name: 'ARCULAR, KYLA JANE PLAZA', email: '2022-0003914@bgfc.edu.ph', studentId: '2022-0003914' },
    { name: 'ARCULAR, LYCA MARIE C.', email: '2022-0003943@bgfc.edu.ph', studentId: '2022-0003943' },
    { name: 'ARCULAR, ROBEM A.', email: '2023-0000134@bgfc.edu.ph', studentId: '2023-0000134' },
    { name: 'ARCULAR, SHANA RYZA LAUGO', email: '2024-0000053@bgfc.edu.ph', studentId: '2024-0000053' },
    { name: 'ARCULAR, TWINKLE PLAZA', email: '2025-0000219@bgfc.edu.ph', studentId: '2025-0000219' },
    { name: 'ARREZA, CHRISTOPHER DAVID LIPIO', email: '2025-0000226@bgfc.edu.ph', studentId: '2025-0000226' },
    { name: 'ATAYLAR, JAIRAH JEAN BERBAL', email: '2023-0000176@bgfc.edu.ph', studentId: '2023-0000176' },
    { name: 'BALBARINO, JIA YZEL SANICO', email: '2025-0000042@bgfc.edu.ph', studentId: '2025-0000042' },
    { name: 'BALBARINO, JUDY BOY J', email: '2023-0000171@bgfc.edu.ph', studentId: '2023-0000171' },
    { name: 'BALBARINO, MELAN LOYD M', email: '2025-0000143@bgfc.edu.ph', studentId: '2025-0000143' },
    { name: 'BALBARINO, SANDREA H.', email: '2022-0003969@bgfc.edu.ph', studentId: '2022-0003969' },
    { name: 'BALMORIA, CHERYN O.', email: '2023-0000093@bgfc.edu.ph', studentId: '2023-0000093' },
    { name: 'BALMORIA, CRISHA MARISS CORAY', email: '2024-0000101@bgfc.edu.ph', studentId: '2024-0000101' },
    { name: 'BALMORIA, JANE MARIE A.', email: '2022-0004120@bgfc.edu.ph', studentId: '2022-0004120' },
    { name: 'BALMORIA, MECA ADLAO', email: '2025-0000027@bgfc.edu.ph', studentId: '2025-0000027' },
    { name: 'BALMORIA, SARAHLYN SUTANA', email: '2025-0000083@bgfc.edu.ph', studentId: '2025-0000083' },
    { name: 'BANAYBANAY, ALLEN DOYENOR G.', email: '2023-0000026@bgfc.edu.ph', studentId: '2023-0000026' },
    { name: 'BANAYBANAY, DARB D', email: '2025-0000149@bgfc.edu.ph', studentId: '2025-0000149' },
    { name: 'BANAYBANAY, JHON MARK D.', email: '2022-0004166@bgfc.edu.ph', studentId: '2022-0004166' },
    { name: 'BANAYBANAY, JUSTINE R', email: '2023-0000113@bgfc.edu.ph', studentId: '2023-0000113' },
    { name: 'BANAYBANAY, KC JEAN ENGROBA', email: '2025-0000069@bgfc.edu.ph', studentId: '2025-0000069' },
    { name: 'BANAYBANAY, KEVIN J.', email: '2022-0004100@bgfc.edu.ph', studentId: '2022-0004100' },
    { name: 'BARQUEZ, ROBERT PARO', email: '2025-0000208@bgfc.edu.ph', studentId: '2025-0000208' },
    { name: 'BARRIOS, JERICA ARCULAR', email: '2024-0000135@bgfc.edu.ph', studentId: '2024-0000135' },
    { name: 'BARUNDAY, JUANNA B', email: '2022-0004121@bgfc.edu.ph', studentId: '2022-0004121' },
    { name: 'BARUNDAY, MARVIN ELANDAG', email: '2025-0000135@bgfc.edu.ph', studentId: '2025-0000135' },
    { name: 'BASCO, EMAN SANICO', email: '2025-0000109@bgfc.edu.ph', studentId: '2025-0000109' },
    { name: 'BASCO, JAMAICA SANICO', email: '2022-0003947@bgfc.edu.ph', studentId: '2022-0003947' },
    { name: 'BASCO, JEZAR M', email: '2023-0000137@bgfc.edu.ph', studentId: '2023-0000137' },
    { name: 'BASCO, SHAMELL TARUC', email: '2022-0003953@bgfc.edu.ph', studentId: '2022-0003953' },
    { name: 'BASUL, ARLINDA T.', email: '2022-0004186@bgfc.edu.ph', studentId: '2022-0004186' },
    { name: 'BASUL, LHABELYN T.', email: '2022-0004187@bgfc.edu.ph', studentId: '2022-0004187' },
    { name: 'BATISTIL, ALDRIN DIGAL', email: '2022-0004216@bgfc.edu.ph', studentId: '2022-0004216' },
    { name: 'BATO, ALJUNE-JAY A', email: '2023-0000029@bgfc.edu.ph', studentId: '2023-0000029' },
    { name: 'BATO, ASLI ALYNA', email: '2025-0000056@bgfc.edu.ph', studentId: '2025-0000056' },
    { name: 'BATO, CHABE JEN R.', email: '2022-0004140@bgfc.edu.ph', studentId: '2022-0004140' },
    { name: 'BATO, DAVE REY O', email: '2022-0004008@bgfc.edu.ph', studentId: '2022-0004008' },
    { name: 'BATO, GANTER CAINTOY', email: '2024-0000037@bgfc.edu.ph', studentId: '2024-0000037' },
    { name: 'BATO, JADE MARK D.', email: '2023-0000072@bgfc.edu.ph', studentId: '2023-0000072' },
    { name: 'BATO, JEAN BUYSER', email: '2024-0000005@bgfc.edu.ph', studentId: '2024-0000005' },
    { name: 'BATO, JOLAICA D', email: '2022-0004169@bgfc.edu.ph', studentId: '2022-0004169' },
    { name: 'BATO, KARRY LEE CAINTOY', email: '2025-0000062@bgfc.edu.ph', studentId: '2025-0000062' },
    { name: 'BATO, RAIZA ANTIGRO', email: '2019-0003014@bgfc.edu.ph', studentId: '2019-0003014' },
    { name: 'BATO, RODEL MATURAN', email: '2025-0000174@bgfc.edu.ph', studentId: '2025-0000174' },
    { name: 'BERBAL, CLARINE PANGATUNGAN', email: '2024-0000086@bgfc.edu.ph', studentId: '2024-0000086' },
    { name: 'BESAS, CLEFF GERALD CINCO', email: '2022-0003924@bgfc.edu.ph', studentId: '2022-0003924' },
    { name: 'BESAS, DARRIS C.', email: '2023-0000019@bgfc.edu.ph', studentId: '2023-0000019' },
    { name: 'BESAS, JANELLE ARCULAR', email: '2025-0000030@bgfc.edu.ph', studentId: '2025-0000030' },
    { name: 'BESAS, JHON NATHANIEL LAMPAD', email: '2024-0000145@bgfc.edu.ph', studentId: '2024-0000145' },
    { name: 'BESAS, KATE RELLAH P.', email: '2022-0004212@bgfc.edu.ph', studentId: '2022-0004212' },
    { name: 'BESAS, KENT BRIAN OCON', email: '2025-0000193@bgfc.edu.ph', studentId: '2025-0000193' },
    { name: 'BESAS, KYLAMIE A.', email: '2022-0003955@bgfc.edu.ph', studentId: '2022-0003955' },
    { name: 'BESAS, MARIMAR GARCIA', email: '2025-0000200@bgfc.edu.ph', studentId: '2025-0000200' },
  ]

  console.log(`📚 Creating ${students.length} students...`)

  for (const studentData of students) {
    try {
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
          userId: user.id,
        },
      })

      console.log(`✅ Created student: ${studentData.name} (${studentData.studentId})`)
    } catch (error) {
      console.error(`❌ Error creating student ${studentData.name}:`, error)
    }
  }

  console.log('🎉 Batch 1 database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
