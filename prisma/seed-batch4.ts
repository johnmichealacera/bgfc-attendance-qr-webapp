import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 4 database seed...')

  // Create student users and records - Batch 4 (Students 328-439)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'GELSANO, JAY-VAN DAPAR', email: '2023-0000073@bgfc.edu.ph', studentId: '2023-0000073' },
    { name: 'GELSANO, JOSEPH LAURENTE', email: '2025-0000036@bgfc.edu.ph', studentId: '2025-0000036' },
    { name: 'GELSANO, JUSTINE JAMES KIAN MANTE', email: '2024-0000102@bgfc.edu.ph', studentId: '2024-0000102' },
    { name: 'GELSANO, KC PAJA', email: '2024-0000117@bgfc.edu.ph', studentId: '2024-0000117' },
    { name: 'GELSANO, KENMARK RODNEY J.', email: '2023-0000118@bgfc.edu.ph', studentId: '2023-0000118' },
    { name: 'GELSANO, KIM JUSTINE B', email: '2023-0000082@bgfc.edu.ph', studentId: '2023-0000082' },
    { name: 'GELSANO, MAYJUNE MONTER', email: '2025-0000125@bgfc.edu.ph', studentId: '2025-0000125' },
    { name: 'GELSANO, RHIA MARICA BARUNDAY', email: '2025-0000095@bgfc.edu.ph', studentId: '2025-0000095' },
    { name: 'GELSANO, TRIXIE NICOLE PONTIVEDRA', email: '2025-0000052@bgfc.edu.ph', studentId: '2025-0000052' },
    { name: 'GEMOLA, ZARITA T', email: '2022-0004149@bgfc.edu.ph', studentId: '2022-0004149' },
    { name: 'GENSON, JANA DELIMAN', email: '2024-0000080@bgfc.edu.ph', studentId: '2024-0000080' },
    { name: 'GENZON, REJENALD S.', email: '2023-0000063@bgfc.edu.ph', studentId: '2023-0000063' },
    { name: 'GINSON, HANNA LEAH E.', email: '2023-0000232@bgfc.edu.ph', studentId: '2023-0000232' },
    { name: 'GODINEZ, WENDEL GONZALES', email: '2023-0000001@bgfc.edu.ph', studentId: '2023-0000001' },
    { name: 'GOLANDRINA, EDIL T.', email: '2022-0003960@bgfc.edu.ph', studentId: '2022-0003960' },
    { name: 'GOLIAT, JACKIM BOHOL', email: '2025-0000195@bgfc.edu.ph', studentId: '2025-0000195' },
    { name: 'GOLIAT, KENTHLYMAE BOHOL', email: '2025-0000192@bgfc.edu.ph', studentId: '2025-0000192' },
    { name: 'GROMACON, ANTONETE E', email: '2023-0000164@bgfc.edu.ph', studentId: '2023-0000164' },
    { name: 'GROMACON, GERALD', email: '2022-0004022@bgfc.edu.ph', studentId: '2022-0004022' },
    { name: 'GUERRERO, JAKE PALATE', email: '2025-0000220@bgfc.edu.ph', studentId: '2025-0000220' },
    { name: 'GUIMARE, MAY INCIERTO', email: '2025-0000130@bgfc.edu.ph', studentId: '2025-0000130' },
    { name: 'GUIRAL, RONALD JR. C.', email: '2021-0003589@bgfc.edu.ph', studentId: '2021-0003589' },
    { name: 'GULTIANO, INDIA P.', email: '2022-0004088@bgfc.edu.ph', studentId: '2022-0004088' },
    { name: 'GULTIANO, PRINCE LEO DEGAMON', email: '2025-0000063@bgfc.edu.ph', studentId: '2025-0000063' },
    { name: 'GUMA, ELANICA A', email: '2025-0000121@bgfc.edu.ph', studentId: '2025-0000121' },
    { name: 'GUMA, GIAN PHILIP DINOY', email: '2025-0000122@bgfc.edu.ph', studentId: '2025-0000122' },
    { name: 'GUMA, GLAICA-MAY TARO', email: '2025-0000151@bgfc.edu.ph', studentId: '2025-0000151' },
    { name: 'GUMA, HEART NOVY GENSON', email: '2025-0000016@bgfc.edu.ph', studentId: '2025-0000016' },
    { name: 'GUMA, JAMES RENIE DANTES', email: '2023-0000154@bgfc.edu.ph', studentId: '2023-0000154' },
    { name: 'GUMA, KIAN-LEO D', email: '2025-0000133@bgfc.edu.ph', studentId: '2025-0000133' },
    { name: 'GUMA, MARK JOSHUA DANTES', email: '2024-0000129@bgfc.edu.ph', studentId: '2024-0000129' },
    { name: 'GUMA, REXMON V', email: '2022-0004032@bgfc.edu.ph', studentId: '2022-0004032' },
    { name: 'HEMPARO, LHOJIE SAVANDAL', email: '2024-0000017@bgfc.edu.ph', studentId: '2024-0000017' },
    { name: 'HIJARA, JENNY INJAPE', email: '2025-0000068@bgfc.edu.ph', studentId: '2025-0000068' },
    { name: 'HINGGO, ANDRIA NICA BARONDAY', email: '2025-0000026@bgfc.edu.ph', studentId: '2025-0000026' },
    { name: 'HINGGO, REYMARK JUANITE', email: '2024-0000040@bgfc.edu.ph', studentId: '2024-0000040' },
    { name: 'HINGPIT, KYLA RAMIREZ', email: '2025-0000136@bgfc.edu.ph', studentId: '2025-0000136' },
    { name: 'HINGPIT, MARRA JEAN RAMIREZ', email: '2022-0003971@bgfc.edu.ph', studentId: '2022-0003971' },
    { name: 'HINGPIT, NICOLE SABALO', email: '2023-0000081@bgfc.edu.ph', studentId: '2023-0000081' },
    { name: 'HINGPIT, SAM MACALOLOT', email: '2024-0000065@bgfc.edu.ph', studentId: '2024-0000065' },
    { name: 'HUMAYLAB, ANGEL MAE TINAMBACAN', email: '2025-0000075@bgfc.edu.ph', studentId: '2025-0000075' },
    { name: 'HUMAYLAB, GERIC BATO', email: '2025-0000170@bgfc.edu.ph', studentId: '2025-0000170' },
    { name: 'HUMAYLAB, JOHN CARLSON S.', email: '2022-0004092@bgfc.edu.ph', studentId: '2022-0004092' },
    { name: 'HUMAYLAB, MAYRA GLENN L', email: '2024-0000147@bgfc.edu.ph', studentId: '2024-0000147' },
    { name: 'IGNALIG, CRYSTAL VIEN PAJA', email: '2025-0000166@bgfc.edu.ph', studentId: '2025-0000166' },
    { name: 'ILIGAN, JOUNREY DELOSO', email: '2025-0000230@bgfc.edu.ph', studentId: '2025-0000230' },
    { name: 'ILIGAN, JUNCART DIGAL', email: '2024-0000131@bgfc.edu.ph', studentId: '2024-0000131' },
    { name: 'JACOBE, GWEN STEPHANIE P.', email: '2024-0000006@bgfc.edu.ph', studentId: '2024-0000006' },
    { name: 'JACOBE, JOHARY ELANDAG', email: '2024-0000024@bgfc.edu.ph', studentId: '2024-0000024' },
    { name: 'JACOBE, LUJILLE HEART PIAO', email: '2023-0000106@bgfc.edu.ph', studentId: '2023-0000106' },
    { name: 'JACOBE, PRINCESS KATE NARYL LOZADA', email: '2024-0000003@bgfc.edu.ph', studentId: '2024-0000003' },
    { name: 'JACOL, KYLA GEORENA CUBILLAN', email: '2025-0000185@bgfc.edu.ph', studentId: '2025-0000185' },
    { name: 'JOAQUINO, AREIS ENZO OCON', email: '2024-0000054@bgfc.edu.ph', studentId: '2024-0000054' },
    { name: 'JOAQUINO, CYRILL BESINGA', email: '2024-0000046@bgfc.edu.ph', studentId: '2024-0000046' },
    { name: 'JOAQUINO, DENVIER BISINGA', email: '2022-0004206@bgfc.edu.ph', studentId: '2022-0004206' },
    { name: 'JOAQUINO, RHEXA CAINDOY', email: '2024-0000045@bgfc.edu.ph', studentId: '2024-0000045' },
    { name: 'JUALO, ALFEI LOUIS PAJOYO', email: '2024-0000064@bgfc.edu.ph', studentId: '2024-0000064' },
    { name: 'JUALO, CHERRY JEAN B', email: '2022-0004119@bgfc.edu.ph', studentId: '2022-0004119' },
    { name: 'JUALO, DIVINA R.', email: '2022-0004012@bgfc.edu.ph', studentId: '2022-0004012' },
    { name: 'JUALO, KYLA ABAO', email: '2025-0000061@bgfc.edu.ph', studentId: '2025-0000061' },
    { name: 'JUALO, MONICA MEDRANO', email: '2022-0003915@bgfc.edu.ph', studentId: '2022-0003915' },
    { name: 'JUALO, RENZ DACERA', email: '2025-0000024@bgfc.edu.ph', studentId: '2025-0000024' },
    { name: 'JUANITE, HANNAH CRYSTAL M', email: '2023-0000100@bgfc.edu.ph', studentId: '2023-0000100' },
    { name: 'JUANITE, IRHA GAMUTAN', email: '2025-0000118@bgfc.edu.ph', studentId: '2025-0000118' },
    { name: 'JUANITE, JEMMY G', email: '2023-0000052@bgfc.edu.ph', studentId: '2023-0000052' },
    { name: 'JUANITE, LADY JOY PAJA', email: '2025-0000017@bgfc.edu.ph', studentId: '2025-0000017' },
    { name: 'JUANITE, LENA MAE D', email: '2022-0004147@bgfc.edu.ph', studentId: '2022-0004147' },
    { name: 'JUANITE, MISHEL PAJA', email: '2023-0000108@bgfc.edu.ph', studentId: '2023-0000108' },
    { name: 'JUANITE, NATHANIEL M.', email: '2022-0004047@bgfc.edu.ph', studentId: '2022-0004047' },
    { name: 'JUANITE, RONALYN AMARILLE', email: '2024-0000081@bgfc.edu.ph', studentId: '2024-0000081' },
    { name: 'JUANITE, YAHJIE D.', email: '2022-0004090@bgfc.edu.ph', studentId: '2022-0004090' },
    { name: 'JUANITE, YASMIEN PAGALAN', email: '2025-0000147@bgfc.edu.ph', studentId: '2025-0000147' },
    { name: 'JUGAR, MAYRISH MIGULLAS', email: '2025-0000182@bgfc.edu.ph', studentId: '2025-0000182' },
    { name: 'JUMADAS, JASMINE RHIZ C', email: '2024-0000120@bgfc.edu.ph', studentId: '2024-0000120' },
    { name: 'JUSTOL, HERSHEY N.', email: '2022-0004025@bgfc.edu.ph', studentId: '2022-0004025' },
    { name: 'JUSTOL, JONREL PAJA', email: '2025-0000186@bgfc.edu.ph', studentId: '2025-0000186' },
    { name: 'JUSTOL, RENIER E', email: '2022-0004109@bgfc.edu.ph', studentId: '2022-0004109' },
    { name: 'LABE, CHRISTA MARIE C.', email: '2022-0003977@bgfc.edu.ph', studentId: '2022-0003977' },
    { name: 'LABE, HERA PAJA', email: '2024-0000023@bgfc.edu.ph', studentId: '2024-0000023' },
    { name: 'LAID, CHARLIE JEAN CURAMBAO', email: '2022-0003934@bgfc.edu.ph', studentId: '2022-0003934' },
    { name: 'LAID, JASMEN CURAMBAO', email: '2025-0000202@bgfc.edu.ph', studentId: '2025-0000202' },
    { name: 'LAMPAD, JAME RICK B.', email: '2022-0004053@bgfc.edu.ph', studentId: '2022-0004053' },
    { name: 'LASALA, YRIXIE STEFFANNE G.', email: '2022-0003988@bgfc.edu.ph', studentId: '2022-0003988' },
    { name: 'LAUGO, BEA SANICO', email: '2025-0000157@bgfc.edu.ph', studentId: '2025-0000157' },
    { name: 'LAUGO, BEA SAMANTHA CAINDOY', email: '2024-0000072@bgfc.edu.ph', studentId: '2024-0000072' },
    { name: 'LAUGO, CARLA FE ALABAT', email: '2025-0000050@bgfc.edu.ph', studentId: '2025-0000050' },
    { name: 'LAUGO, CARRY ALABAT', email: '2025-0000049@bgfc.edu.ph', studentId: '2025-0000049' },
    { name: 'LAUGO, CHUCK NECHO TARO', email: '2025-0000047@bgfc.edu.ph', studentId: '2025-0000047' },
    { name: 'LAUGO, GEMARIE E', email: '2022-0004110@bgfc.edu.ph', studentId: '2022-0004110' },
    { name: 'LAUGO, KEJIE ELANDAG', email: '2024-0000084@bgfc.edu.ph', studentId: '2024-0000084' },
    { name: 'LAUGO, KIM DARYL PLAZA', email: '2024-0000105@bgfc.edu.ph', studentId: '2024-0000105' },
    { name: 'LAZARTE, JOANNA T.', email: '2023-0000087@bgfc.edu.ph', studentId: '2023-0000087' },
    { name: 'LAZARTE, KYRO QUESTERIA', email: '2024-0000036@bgfc.edu.ph', studentId: '2024-0000036' },
    { name: 'LEGASPI, CRISTY MAE E.', email: '2023-0000022@bgfc.edu.ph', studentId: '2023-0000022' },
    { name: 'LINAGA, ROSE ANN P.', email: '2021-0003795@bgfc.edu.ph', studentId: '2021-0003795' },
    { name: 'LIRAY, GERALD ROSILLO', email: '2024-0000094@bgfc.edu.ph', studentId: '2024-0000094' },
    { name: 'LLANO, BOOTS JOSHUA G', email: '2023-0000153@bgfc.edu.ph', studentId: '2023-0000153' },
    { name: 'LLANO, IRHON PARO', email: '2025-0000167@bgfc.edu.ph', studentId: '2025-0000167' },
    { name: 'LLANO, JEFRY H', email: '2025-0000123@bgfc.edu.ph', studentId: '2025-0000123' },
    { name: 'LLANO, JHEN MICHELLE PAJA', email: '2024-0000061@bgfc.edu.ph', studentId: '2024-0000061' },
    { name: 'LLANO, JIGZ ALLE R.', email: '2016-0001659@bgfc.edu.ph', studentId: '2016-0001659' },
    { name: 'LLANO, JOHN MICHAEL PAJA', email: '2024-0000111@bgfc.edu.ph', studentId: '2024-0000111' },
    { name: 'LLANO, LEBRON BHEMS PORTILLO', email: '2025-0000070@bgfc.edu.ph', studentId: '2025-0000070' },
    { name: 'LLANO, LOVELY NOVANJIE B.', email: '2023-0000078@bgfc.edu.ph', studentId: '2023-0000078' },
    { name: 'LLANO, RHYNEE BRETT G', email: '2022-0004064@bgfc.edu.ph', studentId: '2022-0004064' },
    { name: 'LLANO, SANDARA CONIATO', email: '2024-0000022@bgfc.edu.ph', studentId: '2024-0000022' },
    { name: 'LLANO, SHARA SANICO', email: '2023-0000048@bgfc.edu.ph', studentId: '2023-0000048' },
    { name: 'LONGOS, ACE RYEL JUANITE', email: '2025-0000040@bgfc.edu.ph', studentId: '2025-0000040' },
    { name: 'LONGOS, BEBECRIS R', email: '2023-0000163@bgfc.edu.ph', studentId: '2023-0000163' },
    { name: 'LONGOS, GAIL J.', email: '2022-0004190@bgfc.edu.ph', studentId: '2022-0004190' },
    { name: 'LOZADA, JEBOY YAMSON', email: '2022-0003931@bgfc.edu.ph', studentId: '2022-0003931' },
    { name: 'LUBAPIS, APPLE OJIE C', email: '2022-0004167@bgfc.edu.ph', studentId: '2022-0004167' },
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

  console.log('🎉 Batch 4 database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
