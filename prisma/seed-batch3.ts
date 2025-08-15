import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 3 database seed...')

  // Create student users and records - Batch 3 (Students 216-327)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'DANTES, KRIZELLE HOPE', email: '2024-0000136@bgfc.edu.ph', studentId: '2024-0000136', course: 'BSE' },
    { name: 'DANTES, NASHEY ANNEZA', email: '2023-0000159@bgfc.edu.ph', studentId: '2023-0000159', course: 'BEED' },
    { name: 'DAPAR, DAVE RALPH ERONG', email: '2025-0000097@bgfc.edu.ph', studentId: '2025-0000097', course: 'BEED' },
    { name: 'DAPAR, NESHE ROSE DELA PEÑA', email: '2025-0000041@bgfc.edu.ph', studentId: '2025-0000041', course: 'BEED' },
    { name: 'DAPAR, ROSEWELL ELANDAG', email: '2025-0000054@bgfc.edu.ph', studentId: '2025-0000054', course: 'BSED - Math' },
    { name: 'DAYTOC, JHON CUBILLAN', email: '2022-0004130@bgfc.edu.ph', studentId: '2022-0004130', course: 'BSBA' },
    { name: 'DEGAMON, GIAN REY ENAGO', email: '2023-0000146@bgfc.edu.ph', studentId: '2023-0000146', course: 'BSBA' },
    { name: 'DEJUMO, ERL-JUN JAVIER', email: '2020-0003219@bgfc.edu.ph', studentId: '2020-0003219', course: 'BSE' },
    { name: 'DELA CRUZ, JUAN M', email: '2025-0000229@bgfc.edu.ph', studentId: '2025-0000229', course: 'BSIT' },
    { name: 'DELA PEÑA, MANNIER JUNE BATO', email: '2024-0000148@bgfc.edu.ph', studentId: '2024-0000148', course: 'BEED' },
    { name: 'DELA PEÑA, MELODY ELANDAG', email: '2025-0000060@bgfc.edu.ph', studentId: '2025-0000060', course: 'BEED' },
    { name: 'DELA PEÑA, MIKE MASCARDO', email: '2025-0000110@bgfc.edu.ph', studentId: '2025-0000110', course: 'BEED' },
    { name: 'DELA PEÑA, REYPO E', email: '2025-0000126@bgfc.edu.ph', studentId: '2025-0000126', course: 'BEED' },
    { name: 'DELA PEÑA, VINCE GENESIS BISAYA', email: '2024-0000114@bgfc.edu.ph', studentId: '2024-0000114', course: 'BSED - English' },
    { name: 'DELA PEÑA, KIVEN M', email: '2022-0004106@bgfc.edu.ph', studentId: '2022-0004106', course: 'BEED' },
    { name: 'DELA PEÑA, PRINCE JAYDEE PAJA', email: '2024-0000092@bgfc.edu.ph', studentId: '2024-0000092', course: 'BSE' },
    { name: 'DELA PEÑA, REGELS P.', email: '2022-0004050@bgfc.edu.ph', studentId: '2022-0004050', course: 'BSED - Math' },
    { name: 'DELIMAN, AVEGIL BATO', email: '2025-0000177@bgfc.edu.ph', studentId: '2025-0000177', course: 'BSCRIM' },
    { name: 'DELIMAN, BERNA JOY B.', email: '2022-0004079@bgfc.edu.ph', studentId: '2022-0004079', course: 'BSBA' },
    { name: 'DELIMAN, FREDDIE ADLAO', email: '2022-0004081@bgfc.edu.ph', studentId: '2022-0004081', course: 'BSIT' },
    { name: 'DELIMAN, GAY MARIE LLANO', email: '2024-0000047@bgfc.edu.ph', studentId: '2024-0000047', course: 'BEED' },
    { name: 'DELIMAN, JIV Q.', email: '2022-0004030@bgfc.edu.ph', studentId: '2022-0004030', course: 'BEED' },
    { name: 'DELIMAN, MARISS J', email: '2022-0004010@bgfc.edu.ph', studentId: '2022-0004010', course: 'BEED' },
    { name: 'DELOLA, LEVIE ROSE ALICANIA', email: '2025-0000034@bgfc.edu.ph', studentId: '2025-0000034', course: 'BSIT' },
    { name: 'DESPOY, ANALYN LORENZO', email: '2025-0000098@bgfc.edu.ph', studentId: '2025-0000098', course: 'BEED' },
    { name: 'DESPOY, EDELBERTO LORENZO', email: '2023-0000221@bgfc.edu.ph', studentId: '2023-0000221', course: 'BSBA' },
    { name: 'DESPOY, LYNDIE L', email: '2022-0004142@bgfc.edu.ph', studentId: '2022-0004142', course: 'BEED' },
    { name: 'DIADULA, BROOKS DARREL BANAYBANAY', email: '2025-0000176@bgfc.edu.ph', studentId: '2025-0000176', course: 'BSBA' },
    { name: 'DIADULA, SHINE APPLE B', email: '2022-0004093@bgfc.edu.ph', studentId: '2022-0004093', course: 'BSED - Math' },
    { name: 'DIAGO, ABEGAIL YAMSON', email: '2025-0000117@bgfc.edu.ph', studentId: '2025-0000117', course: 'BSED - English' },
    { name: 'DIAGO, DECEL DELIMAN', email: '2025-0000138@bgfc.edu.ph', studentId: '2025-0000138', course: 'BSIT' },
    { name: 'DIAGO, JHON RICKS RIVAS', email: '2024-0000113@bgfc.edu.ph', studentId: '2024-0000113', course: 'BSIT' },
    { name: 'DIGAL, GODEFREDO JR. O.', email: '2018-0002575@bgfc.edu.ph', studentId: '2018-0002575', course: 'BEED' },
    { name: 'DIGAL, KRIZZAH T.', email: '2023-0000025@bgfc.edu.ph', studentId: '2023-0000025', course: 'BEED' },
    { name: 'DIGAL, PRINCE ROY TINAMBACAN', email: '2025-0000015@bgfc.edu.ph', studentId: '2025-0000015', course: 'BSED - Math' },
    { name: 'DIZON, BLINKO BORDAS', email: '2022-0004182@bgfc.edu.ph', studentId: '2022-0004182', course: 'BSBA' },
    { name: 'DIZON, CAREL B.', email: '2023-0000140@bgfc.edu.ph', studentId: '2023-0000140', course: 'BEED' },
    { name: 'DIZON, CHARMEL ESPUERTA', email: '2025-0000156@bgfc.edu.ph', studentId: '2025-0000156', course: 'BSBA' },
    { name: 'DIZON, CHARO LOZADA', email: '2024-0000027@bgfc.edu.ph', studentId: '2024-0000027', course: 'BSE' },
    { name: 'DIZON, CYPHORA CAGATIN', email: '2025-0000093@bgfc.edu.ph', studentId: '2025-0000093', course: 'BEED' },
    { name: 'DIZON, DAISY JOY MATURAN', email: '2025-0000087@bgfc.edu.ph', studentId: '2025-0000087', course: 'BEED' },
    { name: 'DIZON, EUG\'Z GOLDWIN ELANDAG', email: '2025-0000236@bgfc.edu.ph', studentId: '2025-0000236', course: 'BEED' },
    { name: 'DIZON, JAKE REY OCON', email: '2024-0000014@bgfc.edu.ph', studentId: '2024-0000014', course: 'BSIT' },
    { name: 'DIZON, JEAN CREZIEL PAGALAN', email: '2018-0002043@bgfc.edu.ph', studentId: '2018-0002043', course: 'BEED' },
    { name: 'DIZON, JHANDIE RAMIREZ', email: '2025-0000181@bgfc.edu.ph', studentId: '2025-0000181', course: 'BSCRIM' },
    { name: 'DIZON, KIANNA A.', email: '2023-0000231@bgfc.edu.ph', studentId: '2023-0000231', course: 'BSE' },
    { name: 'DIZON, SHAMIEL G.', email: '2023-0000179@bgfc.edu.ph', studentId: '2023-0000179', course: 'BSCRIM' },
    { name: 'DIZON, SHANE E.', email: '2023-0000088@bgfc.edu.ph', studentId: '2023-0000088', course: 'BEED' },
    { name: 'DOTILLOS, BLEAN SAVANDAL', email: '2025-0000064@bgfc.edu.ph', studentId: '2025-0000064', course: 'BEED' },
    { name: 'DOTILLOS, JANNAH FRANCINE C', email: '2022-0003976@bgfc.edu.ph', studentId: '2022-0003976', course: 'BEED' },
    { name: 'DOTILLOS, JANNAH TRISHA CONSIGNA', email: '2023-0000147@bgfc.edu.ph', studentId: '2023-0000147', course: 'BEED' },
    { name: 'DOTILLOS, RULLYN-DIYA CUARTERON', email: '2024-0000010@bgfc.edu.ph', studentId: '2024-0000010', course: 'BEED' },
    { name: 'DOVERTE, RHYZA MAE DEGAL', email: '2025-0000232@bgfc.edu.ph', studentId: '2025-0000232', course: 'BEED' },
    { name: 'ELANDAG, AMAYA P.', email: '2023-0000090@bgfc.edu.ph', studentId: '2023-0000090', course: 'BEED' },
    { name: 'ELANDAG, B.J. CULATA', email: '2025-0000224@bgfc.edu.ph', studentId: '2025-0000224', course: 'BSBA' },
    { name: 'ELANDAG, CARL NORMAN BORDAS', email: '2025-0000204@bgfc.edu.ph', studentId: '2025-0000204', course: 'BSCRIM' },
    { name: 'ELANDAG, CHRISTIA MAE O.', email: '2023-0000191@bgfc.edu.ph', studentId: '2023-0000191', course: 'BSED - English' },
    { name: 'ELANDAG, CHRISTIAN DACERA', email: '2022-0004108@bgfc.edu.ph', studentId: '2022-0004108', course: 'BSCRIM' },
    { name: 'ELANDAG, DORIROSE CULATA', email: '2022-0004225@bgfc.edu.ph', studentId: '2022-0004225', course: 'BSBA' },
    { name: 'ELANDAG, EDMAR T', email: '2025-0000014@bgfc.edu.ph', studentId: '2025-0000014', course: 'BEED' },
    { name: 'ELANDAG, GLECA S', email: '2022-0004207@bgfc.edu.ph', studentId: '2022-0004207', course: 'BSED - English' },
    { name: 'ELANDAG, JAMES DACERA', email: '2025-0000067@bgfc.edu.ph', studentId: '2025-0000067', course: 'BSCRIM' },
    { name: 'ELANDAG, JAMES MARK R', email: '2025-0000209@bgfc.edu.ph', studentId: '2025-0000209', course: 'BEED' },
    { name: 'ELANDAG, JANAIRA CAINDOY', email: '2024-0000069@bgfc.edu.ph', studentId: '2024-0000069', course: 'BSED - Math' },
    { name: 'ELANDAG, JEY BALBARINO', email: '2025-0000108@bgfc.edu.ph', studentId: '2025-0000108', course: 'BSCRIM' },
    { name: 'ELANDAG, JODEN P.', email: '2022-0004074@bgfc.edu.ph', studentId: '2022-0004074', course: 'BSCRIM' },
    { name: 'ELANDAG, JUDY-ANN B.', email: '2019-0003007@bgfc.edu.ph', studentId: '2019-0003007', course: 'BEED' },
    { name: 'ELANDAG, RE-ANN TESADO', email: '2023-0000042@bgfc.edu.ph', studentId: '2023-0000042', course: 'BSED - Math' },
    { name: 'ELANDAG, ZAYREL P.', email: '2022-0004191@bgfc.edu.ph', studentId: '2022-0004191', course: 'BSBA' },
    { name: 'ELCAMEL, DAVE JOHNRICK', email: '2025-0000055@bgfc.edu.ph', studentId: '2025-0000055', course: 'BSED - English' },
    { name: 'ENAGO, GENO BARONDAY', email: '2025-0000045@bgfc.edu.ph', studentId: '2025-0000045', course: 'BSBA' },
    { name: 'ENAGO, RICKY, JR. MAKILING', email: '2025-0000211@bgfc.edu.ph', studentId: '2025-0000211', course: 'BSBA' },
    { name: 'ERIGA, JAYMARK D', email: '2025-0000150@bgfc.edu.ph', studentId: '2025-0000150', course: 'BSED - Math' },
    { name: 'ERONG, APRIL SHANE CANTA', email: '2025-0000029@bgfc.edu.ph', studentId: '2025-0000029', course: 'BEED' },
    { name: 'ERONG, BENZ EDWARD P.', email: '2023-0000095@bgfc.edu.ph', studentId: '2023-0000095', course: 'BSBA' },
    { name: 'ERONG, JASMINE JEAN G', email: '2025-0000124@bgfc.edu.ph', studentId: '2025-0000124', course: 'BEED' },
    { name: 'ERONG, PRINCESS - ERIKA PALEN', email: '2024-0000031@bgfc.edu.ph', studentId: '2024-0000031', course: 'BSBA' },
    { name: 'ESAGA, JACK L.', email: '2022-0003979@bgfc.edu.ph', studentId: '2022-0003979', course: 'BSBA' },
    { name: 'ESAGA, KYLA MAE A,', email: '2023-0000061@bgfc.edu.ph', studentId: '2023-0000061', course: 'BEED' },
    { name: 'ESPEDILLA, MERCICRISS J.', email: '2014-2092@bgfc.edu.ph', studentId: '2014-2092', course: 'BSED - English' },
    { name: 'ESPINO, JEROM CAPISTRANO', email: '2025-0000175@bgfc.edu.ph', studentId: '2025-0000175', course: 'BSCRIM' },
    { name: 'ESPINO, NELLY JANE OCON', email: '2024-0000013@bgfc.edu.ph', studentId: '2024-0000013', course: 'BSBA' },
    { name: 'ESPUERTA, CAMERON DACERA', email: '2024-0000141@bgfc.edu.ph', studentId: '2024-0000141', course: 'BSED - English' },
    { name: 'ESPUERTA, JAYSON DEPUTO', email: '2024-0000048@bgfc.edu.ph', studentId: '2024-0000048', course: 'BEED' },
    { name: 'ESPUERTA, JOY ISRAEL A', email: '2022-0004201@bgfc.edu.ph', studentId: '2022-0004201', course: 'BSBA' },
    { name: 'ESPUERTA, NIKO ALABAT', email: '2025-0000194@bgfc.edu.ph', studentId: '2025-0000194', course: 'BEED' },
    { name: 'ESTOSOS, PRINCESS MARCH C', email: '2022-0004155@bgfc.edu.ph', studentId: '2022-0004155', course: 'BEED' },
    { name: 'FLORENDO, KYNTH JEHO P', email: '2022-0003950@bgfc.edu.ph', studentId: '2022-0003950', course: 'BSBA' },
    { name: 'FLORES, BREINNE PEARL B', email: '2025-0000115@bgfc.edu.ph', studentId: '2025-0000115', course: 'BSED - English' },
    { name: 'FLORES, GLYZA V', email: '2023-0000074@bgfc.edu.ph', studentId: '2023-0000074', course: 'BSED - English' },
    { name: 'FLORES, HARRY GEMPARO', email: '2025-0000010@bgfc.edu.ph', studentId: '2025-0000010', course: 'BSBA' },
    { name: 'GALABIA, JAY MARK BATO', email: '2024-0000139@bgfc.edu.ph', studentId: '2024-0000139', course: 'BSIT' },
    { name: 'GALABIA, RACE VINJER D.', email: '2022-0004171@bgfc.edu.ph', studentId: '2022-0004171', course: 'BSBA' },
    { name: 'GALABIA, TEAH ALEXA D', email: '2023-0000039@bgfc.edu.ph', studentId: '2023-0000039', course: 'BEED' },
    { name: 'GALANIDA, MERRY GERALDINE P', email: '2022-0004065@bgfc.edu.ph', studentId: '2022-0004065', course: 'BEED' },
    { name: 'GALANIDA, NICK MICHAEL CONIATO', email: '2023-0000229@bgfc.edu.ph', studentId: '2023-0000229', course: 'BEED' },
    { name: 'GALANIDA, SANDARA GENZON', email: '2024-0000082@bgfc.edu.ph', studentId: '2024-0000082', course: 'BEED' },
    { name: 'GALANIDA, SIM JUSTIN ALABAT', email: '2024-0000106@bgfc.edu.ph', studentId: '2024-0000106', course: 'BEED' },
    { name: 'GALO, JANA CAGATIN', email: '2025-0000161@bgfc.edu.ph', studentId: '2025-0000161', course: 'BSBA' },
    { name: 'GAMBING, BABY ANDREE JUGAR', email: '2024-0000104@bgfc.edu.ph', studentId: '2024-0000104', course: 'BSIT' },
    { name: 'GAMBING, FERDINAND FRENCH BEEMAN JUANITE', email: '2023-0000145@bgfc.edu.ph', studentId: '2023-0000145', course: 'BSBA' },
    { name: 'GARCIA, VANESSA JABAY', email: '2022-0003965@bgfc.edu.ph', studentId: '2022-0003965', course: 'BSBA' },
    { name: 'GARRIDO, CRISLYN S.', email: '2022-0004144@bgfc.edu.ph', studentId: '2022-0004144', course: 'BEED' },
    { name: 'GARRIDO, JAMES MARK SAGA', email: '2025-0000066@bgfc.edu.ph', studentId: '2025-0000066', course: 'BEED' },
    { name: 'GARRIDO, JEMARIE PAULA LLANO', email: '2025-0000153@bgfc.edu.ph', studentId: '2025-0000153', course: 'BSIT' },
    { name: 'GARRIDO, RHEAMIE MATURAN', email: '2025-0000152@bgfc.edu.ph', studentId: '2025-0000152', course: 'BSIT' },
    { name: 'GAZO, CLYJUN M', email: '2023-0000107@bgfc.edu.ph', studentId: '2023-0000107', course: 'BEED' },
    { name: 'GELSANO, ALVINCENT S', email: '2023-0000070@bgfc.edu.ph', studentId: '2023-0000070', course: 'BSBA' },
    { name: 'GELSANO, DIVEN MAGLINTE', email: '2025-0000197@bgfc.edu.ph', studentId: '2025-0000197', course: 'BSED - English' },
    { name: 'GELSANO, ETHAN GL MANTILLA', email: '2025-0000169@bgfc.edu.ph', studentId: '2025-0000169', course: 'BSIT' },
    { name: 'GELSANO, GEISHIA MARIE SAGA', email: '2025-0000223@bgfc.edu.ph', studentId: '2025-0000223', course: 'BEED' },
    { name: 'GELSANO, HARYLL SUTANA', email: '2023-0000046@bgfc.edu.ph', studentId: '2023-0000046', course: 'BSBA' },
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
          course: studentData.course,
        },
      })

      console.log(`✅ Created student: ${studentData.name} (${studentData.studentId}) - ${studentData.course}`)
    } catch (error) {
      console.error(`❌ Error creating student ${studentData.name}:`, error)
    }
  }

  console.log('🎉 Batch 3 database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })