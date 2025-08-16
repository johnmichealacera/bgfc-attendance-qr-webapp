import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 3 database seed...')

  // Create student users and records - Batch 3 (Students 216-327)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'DANTES, KRIZELLE HOPE', email: '2024-0000136@bgfc.edu.ph', studentId: '2024-0000136', course: 'BSE', yearLevel: '2' },
    { name: 'DANTES, NASHEY ANNEZA', email: '2023-0000159@bgfc.edu.ph', studentId: '2023-0000159', course: 'BEED', yearLevel: '3' },
    { name: 'DAPAR, DAVE RALPH ERONG', email: '2025-0000097@bgfc.edu.ph', studentId: '2025-0000097', course: 'BEED', yearLevel: '1' },
    { name: 'DAPAR, NESHE ROSE DELA PEÑA', email: '2025-0000041@bgfc.edu.ph', studentId: '2025-0000041', course: 'BEED', yearLevel: '1' },
    { name: 'DAPAR, ROSEWELL ELANDAG', email: '2025-0000054@bgfc.edu.ph', studentId: '2025-0000054', course: 'BSED - Math', yearLevel: '1' },
    { name: 'DAYTOC, JHON CUBILLAN', email: '2022-0004130@bgfc.edu.ph', studentId: '2022-0004130', course: 'BSBA', yearLevel: '1' },
    { name: 'DEGAMON, GIAN REY ENAGO', email: '2023-0000146@bgfc.edu.ph', studentId: '2023-0000146', course: 'BSBA', yearLevel: '3' },
    { name: 'DEJUMO, ERL-JUN JAVIER', email: '2020-0003219@bgfc.edu.ph', studentId: '2020-0003219', course: 'BSE', yearLevel: '4' },
    { name: 'DELA CRUZ, JUAN M', email: '2025-0000229@bgfc.edu.ph', studentId: '2025-0000229', course: 'BSIT', yearLevel: '1' },
    { name: 'DELA PEÑA, MANNIER JUNE BATO', email: '2024-0000148@bgfc.edu.ph', studentId: '2024-0000148', course: 'BEED', yearLevel: '2' },
    { name: 'DELA PEÑA, MELODY ELANDAG', email: '2025-0000060@bgfc.edu.ph', studentId: '2025-0000060', course: 'BEED', yearLevel: '1' },
    { name: 'DELA PEÑA, MIKE MASCARDO', email: '2025-0000110@bgfc.edu.ph', studentId: '2025-0000110', course: 'BEED', yearLevel: '1' },
    { name: 'DELA PEÑA, REYPO E', email: '2025-0000126@bgfc.edu.ph', studentId: '2025-0000126', course: 'BEED', yearLevel: '1' },
    { name: 'DELA PEÑA, VINCE GENESIS BISAYA', email: '2024-0000114@bgfc.edu.ph', studentId: '2024-0000114', course: 'BSED - English', yearLevel: '2' },
    { name: 'DELA PEÑA, KIVEN M', email: '2022-0004106@bgfc.edu.ph', studentId: '2022-0004106', course: 'BEED', yearLevel: '3' },
    { name: 'DELA PEÑA, PRINCE JAYDEE PAJA', email: '2024-0000092@bgfc.edu.ph', studentId: '2024-0000092', course: 'BSE', yearLevel: '2' },
    { name: 'DELA PEÑA, REGELS P.', email: '2022-0004050@bgfc.edu.ph', studentId: '2022-0004050', course: 'BSED - Math', yearLevel: '4' },
    { name: 'DELIMAN, AVEGIL BATO', email: '2025-0000177@bgfc.edu.ph', studentId: '2025-0000177', course: 'BSCRIM', yearLevel: '1' },
    { name: 'DELIMAN, BERNA JOY B.', email: '2022-0004079@bgfc.edu.ph', studentId: '2022-0004079', course: 'BSBA', yearLevel: '4' },
    { name: 'DELIMAN, FREDDIE ADLAO', email: '2022-0004081@bgfc.edu.ph', studentId: '2022-0004081', course: 'BSIT', yearLevel: '1' },
    { name: 'DELIMAN, GAY MARIE LLANO', email: '2024-0000047@bgfc.edu.ph', studentId: '2024-0000047', course: 'BEED', yearLevel: '2' },
    { name: 'DELIMAN, JIV Q.', email: '2022-0004030@bgfc.edu.ph', studentId: '2022-0004030', course: 'BEED', yearLevel: '4' },
    { name: 'DELIMAN, MARISS J', email: '2022-0004010@bgfc.edu.ph', studentId: '2022-0004010', course: 'BEED', yearLevel: '4' },
    { name: 'DELOLA, LEVIE ROSE ALICANIA', email: '2025-0000034@bgfc.edu.ph', studentId: '2025-0000034', course: 'BSIT', yearLevel: '1' },
    { name: 'DESPOY, ANALYN LORENZO', email: '2025-0000098@bgfc.edu.ph', studentId: '2025-0000098', course: 'BEED', yearLevel: '1' },
    { name: 'DESPOY, EDELBERTO LORENZO', email: '2023-0000221@bgfc.edu.ph', studentId: '2023-0000221', course: 'BSBA', yearLevel: '3' },
    { name: 'DESPOY, LYNDIE L', email: '2022-0004142@bgfc.edu.ph', studentId: '2022-0004142', course: 'BEED', yearLevel: '4' },
    { name: 'DIADULA, BROOKS DARREL BANAYBANAY', email: '2025-0000176@bgfc.edu.ph', studentId: '2025-0000176', course: 'BSBA', yearLevel: '1' },
    { name: 'DIADULA, SHINE APPLE B', email: '2022-0004093@bgfc.edu.ph', studentId: '2022-0004093', course: 'BSED - Math', yearLevel: '4' },
    { name: 'DIAGO, ABEGAIL YAMSON', email: '2025-0000117@bgfc.edu.ph', studentId: '2025-0000117', course: 'BSED - English', yearLevel: '1' },
    { name: 'DIAGO, DECEL DELIMAN', email: '2025-0000138@bgfc.edu.ph', studentId: '2025-0000138', course: 'BSIT', yearLevel: '1' },
    { name: 'DIAGO, JHON RICKS RIVAS', email: '2024-0000113@bgfc.edu.ph', studentId: '2024-0000113', course: 'BSIT', yearLevel: '2' },
    { name: 'DIGAL, GODEFREDO JR. O.', email: '2018-0002575@bgfc.edu.ph', studentId: '2018-0002575', course: 'BEED', yearLevel: '4' },
    { name: 'DIGAL, KRIZZAH T.', email: '2023-0000025@bgfc.edu.ph', studentId: '2023-0000025', course: 'BEED', yearLevel: '3' },
    { name: 'DIGAL, PRINCE ROY TINAMBACAN', email: '2025-0000015@bgfc.edu.ph', studentId: '2025-0000015', course: 'BSED - Math', yearLevel: '1' },
    { name: 'DIZON, BLINKO BORDAS', email: '2022-0004182@bgfc.edu.ph', studentId: '2022-0004182', course: 'BSBA', yearLevel: '3' },
    { name: 'DIZON, CAREL B.', email: '2023-0000140@bgfc.edu.ph', studentId: '2023-0000140', course: 'BEED', yearLevel: '3' },
    { name: 'DIZON, CHARMEL ESPUERTA', email: '2025-0000156@bgfc.edu.ph', studentId: '2025-0000156', course: 'BSBA', yearLevel: '1' },
    { name: 'DIZON, CHARO LOZADA', email: '2024-0000027@bgfc.edu.ph', studentId: '2024-0000027', course: 'BSE', yearLevel: '2' },
    { name: 'DIZON, CYPHORA CAGATIN', email: '2025-0000093@bgfc.edu.ph', studentId: '2025-0000093', course: 'BEED', yearLevel: '1' },
    { name: 'DIZON, DAISY JOY MATURAN', email: '2025-0000087@bgfc.edu.ph', studentId: '2025-0000087', course: 'BEED', yearLevel: '1' },
    { name: 'DIZON, EUG\'Z GOLDWIN ELANDAG', email: '2025-0000236@bgfc.edu.ph', studentId: '2025-0000236', course: 'BEED', yearLevel: '1' },
    { name: 'DIZON, JAKE REY OCON', email: '2024-0000014@bgfc.edu.ph', studentId: '2024-0000014', course: 'BSIT', yearLevel: '2' },
    { name: 'DIZON, JEAN CREZIEL PAGALAN', email: '2018-0002043@bgfc.edu.ph', studentId: '2018-0002043', course: 'BEED', yearLevel: '4' },
    { name: 'DIZON, JHANDIE RAMIREZ', email: '2025-0000181@bgfc.edu.ph', studentId: '2025-0000181', course: 'BSCRIM', yearLevel: '1' },
    { name: 'DIZON, KIANNA A.', email: '2023-0000231@bgfc.edu.ph', studentId: '2023-0000231', course: 'BSE', yearLevel: '3' },
    { name: 'DIZON, SHAMIEL G.', email: '2023-0000179@bgfc.edu.ph', studentId: '2023-0000179', course: 'BSCRIM', yearLevel: '2' },
    { name: 'DIZON, SHANE E.', email: '2023-0000088@bgfc.edu.ph', studentId: '2023-0000088', course: 'BEED', yearLevel: '2' },
    { name: 'DOTILLOS, BLEAN SAVANDAL', email: '2025-0000064@bgfc.edu.ph', studentId: '2025-0000064', course: 'BEED', yearLevel: '1' },
    { name: 'DOTILLOS, JANNAH FRANCINE C', email: '2022-0003976@bgfc.edu.ph', studentId: '2022-0003976', course: 'BEED', yearLevel: '4' },
    { name: 'DOTILLOS, JANNAH TRISHA CONSIGNA', email: '2023-0000147@bgfc.edu.ph', studentId: '2023-0000147', course: 'BEED', yearLevel: '3' },
    { name: 'DOTILLOS, RULLYN-DIYA CUARTERON', email: '2024-0000010@bgfc.edu.ph', studentId: '2024-0000010', course: 'BEED', yearLevel: '2' },
    { name: 'DOVERTE, RHYZA MAE DEGAL', email: '2025-0000232@bgfc.edu.ph', studentId: '2025-0000232', course: 'BEED', yearLevel: '1' },
    { name: 'ELANDAG, AMAYA P.', email: '2023-0000090@bgfc.edu.ph', studentId: '2023-0000090', course: 'BEED', yearLevel: '3' },
    { name: 'ELANDAG, B.J. CULATA', email: '2025-0000224@bgfc.edu.ph', studentId: '2025-0000224', course: 'BSBA', yearLevel: '1' },
    { name: 'ELANDAG, CARL NORMAN BORDAS', email: '2025-0000204@bgfc.edu.ph', studentId: '2025-0000204', course: 'BSCRIM', yearLevel: '1' },
    { name: 'ELANDAG, CHRISTIA MAE O.', email: '2023-0000191@bgfc.edu.ph', studentId: '2023-0000191', course: 'BSED - English', yearLevel: '1' },
    { name: 'ELANDAG, CHRISTIAN DACERA', email: '2022-0004108@bgfc.edu.ph', studentId: '2022-0004108', course: 'BSCRIM', yearLevel: '4' },
    { name: 'ELANDAG, DORIROSE CULATA', email: '2022-0004225@bgfc.edu.ph', studentId: '2022-0004225', course: 'BSBA', yearLevel: '1' },
    { name: 'ELANDAG, EDMAR T', email: '2025-0000014@bgfc.edu.ph', studentId: '2025-0000014', course: 'BEED', yearLevel: '1' },
    { name: 'ELANDAG, GLECA S', email: '2022-0004207@bgfc.edu.ph', studentId: '2022-0004207', course: 'BSED - English', yearLevel: '4' },
    { name: 'ELANDAG, JAMES DACERA', email: '2025-0000067@bgfc.edu.ph', studentId: '2025-0000067', course: 'BSCRIM', yearLevel: '1' },
    { name: 'ELANDAG, JAMES MARK R', email: '2025-0000209@bgfc.edu.ph', studentId: '2025-0000209', course: 'BEED', yearLevel: '1' },
    { name: 'ELANDAG, JANAIRA CAINDOY', email: '2024-0000069@bgfc.edu.ph', studentId: '2024-0000069', course: 'BSED - Math', yearLevel: '2' },
    { name: 'ELANDAG, JEY BALBARINO', email: '2025-0000108@bgfc.edu.ph', studentId: '2025-0000108', course: 'BSCRIM', yearLevel: '1' },
    { name: 'ELANDAG, JODEN P.', email: '2022-0004074@bgfc.edu.ph', studentId: '2022-0004074', course: 'BSCRIM', yearLevel: '4' },
    { name: 'ELANDAG, JUDY-ANN B.', email: '2019-0003007@bgfc.edu.ph', studentId: '2019-0003007', course: 'BEED', yearLevel: '4' },
    { name: 'ELANDAG, RE-ANN TESADO', email: '2023-0000042@bgfc.edu.ph', studentId: '2023-0000042', course: 'BSED - Math', yearLevel: '3' },
    { name: 'ELANDAG, ZAYREL P.', email: '2022-0004191@bgfc.edu.ph', studentId: '2022-0004191', course: 'BSBA', yearLevel: '4' },
    { name: 'ELCAMEL, DAVE JOHNRICK', email: '2025-0000055@bgfc.edu.ph', studentId: '2025-0000055', course: 'BSED - English', yearLevel: '1' },
    { name: 'ENAGO, GENO BARONDAY', email: '2025-0000045@bgfc.edu.ph', studentId: '2025-0000045', course: 'BSBA', yearLevel: '1' },
    { name: 'ENAGO, RICKY, JR. MAKILING', email: '2025-0000211@bgfc.edu.ph', studentId: '2025-0000211', course: 'BSBA', yearLevel: '1' },
    { name: 'ERIGA, JAYMARK D', email: '2025-0000150@bgfc.edu.ph', studentId: '2025-0000150', course: 'BSED - Math', yearLevel: '1' },
    { name: 'ERONG, APRIL SHANE CANTA', email: '2025-0000029@bgfc.edu.ph', studentId: '2025-0000029', course: 'BEED', yearLevel: '1' },
    { name: 'ERONG, BENZ EDWARD P.', email: '2023-0000095@bgfc.edu.ph', studentId: '2023-0000095', course: 'BSBA', yearLevel: '3' },
    { name: 'ERONG, JASMINE JEAN G', email: '2025-0000124@bgfc.edu.ph', studentId: '2025-0000124', course: 'BEED', yearLevel: '1' },
    { name: 'ERONG, PRINCESS - ERIKA PALEN', email: '2024-0000031@bgfc.edu.ph', studentId: '2024-0000031', course: 'BSBA', yearLevel: '2' },
    { name: 'ESAGA, JACK L.', email: '2022-0003979@bgfc.edu.ph', studentId: '2022-0003979', course: 'BSBA', yearLevel: '4' },
    { name: 'ESAGA, KYLA MAE A,', email: '2023-0000061@bgfc.edu.ph', studentId: '2023-0000061', course: 'BEED', yearLevel: '3' },
    { name: 'ESPEDILLA, MERCICRISS J.', email: '2014-2092@bgfc.edu.ph', studentId: '2014-2092', course: 'BSED - English', yearLevel: '4' },
    { name: 'ESPINO, JEROM CAPISTRANO', email: '2025-0000175@bgfc.edu.ph', studentId: '2025-0000175', course: 'BSCRIM', yearLevel: '1' },
    { name: 'ESPINO, NELLY JANE OCON', email: '2024-0000013@bgfc.edu.ph', studentId: '2024-0000013', course: 'BSBA', yearLevel: '2' },
    { name: 'ESPUERTA, CAMERON DACERA', email: '2024-0000141@bgfc.edu.ph', studentId: '2024-0000141', course: 'BSED - English', yearLevel: '2' },
    { name: 'ESPUERTA, JAYSON DEPUTO', email: '2024-0000048@bgfc.edu.ph', studentId: '2024-0000048', course: 'BEED', yearLevel: '2' },
    { name: 'ESPUERTA, JOY ISRAEL A', email: '2022-0004201@bgfc.edu.ph', studentId: '2022-0004201', course: 'BSBA', yearLevel: '4' },
    { name: 'ESPUERTA, NIKO ALABAT', email: '2025-0000194@bgfc.edu.ph', studentId: '2025-0000194', course: 'BEED', yearLevel: '1' },
    { name: 'ESTOSOS, PRINCESS MARCH C', email: '2022-0004155@bgfc.edu.ph', studentId: '2022-0004155', course: 'BEED', yearLevel: '4' },
    { name: 'FLORENDO, KYNTH JEHO P', email: '2022-0003950@bgfc.edu.ph', studentId: '2022-0003950', course: 'BSBA', yearLevel: '4' },
    { name: 'FLORES, BREINNE PEARL B', email: '2025-0000115@bgfc.edu.ph', studentId: '2025-0000115', course: 'BSED - English', yearLevel: '1' },
    { name: 'FLORES, GLYZA V', email: '2023-0000074@bgfc.edu.ph', studentId: '2023-0000074', course: 'BSED - English', yearLevel: '3' },
    { name: 'FLORES, HARRY GEMPARO', email: '2025-0000010@bgfc.edu.ph', studentId: '2025-0000010', course: 'BSBA', yearLevel: '1' },
    { name: 'GALABIA, JAY MARK BATO', email: '2024-0000139@bgfc.edu.ph', studentId: '2024-0000139', course: 'BSIT', yearLevel: '2' },
    { name: 'GALABIA, RACE VINJER D.', email: '2022-0004171@bgfc.edu.ph', studentId: '2022-0004171', course: 'BSBA', yearLevel: '4' },
    { name: 'GALABIA, TEAH ALEXA D', email: '2023-0000039@bgfc.edu.ph', studentId: '2023-0000039', course: 'BEED', yearLevel: '3' },
    { name: 'GALANIDA, MERRY GERALDINE P', email: '2022-0004065@bgfc.edu.ph', studentId: '2022-0004065', course: 'BEED', yearLevel: '4' },
    { name: 'GALANIDA, NICK MICHAEL CONIATO', email: '2023-0000229@bgfc.edu.ph', studentId: '2023-0000229', course: 'BEED', yearLevel: '3' },
    { name: 'GALANIDA, SANDARA GENZON', email: '2024-0000082@bgfc.edu.ph', studentId: '2024-0000082', course: 'BEED', yearLevel: '2' },
    { name: 'GALANIDA, SIM JUSTIN ALABAT', email: '2024-0000106@bgfc.edu.ph', studentId: '2024-0000106', course: 'BEED', yearLevel: '2' },
    { name: 'GALO, JANA CAGATIN', email: '2025-0000161@bgfc.edu.ph', studentId: '2025-0000161', course: 'BSBA', yearLevel: '1' },
    { name: 'GAMBING, BABY ANDREE JUGAR', email: '2024-0000104@bgfc.edu.ph', studentId: '2024-0000104', course: 'BSIT', yearLevel: '2' },
    { name: 'GAMBING, FERDINAND FRENCH BEEMAN JUANITE', email: '2023-0000145@bgfc.edu.ph', studentId: '2023-0000145', course: 'BSBA', yearLevel: '3' },
    { name: 'GARCIA, VANESSA JABAY', email: '2022-0003965@bgfc.edu.ph', studentId: '2022-0003965', course: 'BSBA', yearLevel: '4' },
    { name: 'GARRIDO, CRISLYN S.', email: '2022-0004144@bgfc.edu.ph', studentId: '2022-0004144', course: 'BEED', yearLevel: '4' },
    { name: 'GARRIDO, JAMES MARK SAGA', email: '2025-0000066@bgfc.edu.ph', studentId: '2025-0000066', course: 'BEED', yearLevel: '1' },
    { name: 'GARRIDO, JEMARIE PAULA LLANO', email: '2025-0000153@bgfc.edu.ph', studentId: '2025-0000153', course: 'BSIT', yearLevel: '1' },
    { name: 'GARRIDO, RHEAMIE MATURAN', email: '2025-0000152@bgfc.edu.ph', studentId: '2025-0000152', course: 'BSIT', yearLevel: '1' },
    { name: 'GAZO, CLYJUN M', email: '2023-0000107@bgfc.edu.ph', studentId: '2023-0000107', course: 'BEED', yearLevel: '3' },
    { name: 'GELSANO, ALVINCENT S', email: '2023-0000070@bgfc.edu.ph', studentId: '2023-0000070', course: 'BSBA', yearLevel: '3' },
    { name: 'GELSANO, DIVEN MAGLINTE', email: '2025-0000197@bgfc.edu.ph', studentId: '2025-0000197', course: 'BSED - English', yearLevel: '1' },
    { name: 'GELSANO, ETHAN GL MANTILLA', email: '2025-0000169@bgfc.edu.ph', studentId: '2025-0000169', course: 'BSIT', yearLevel: '1' },
    { name: 'GELSANO, GEISHIA MARIE SAGA', email: '2025-0000223@bgfc.edu.ph', studentId: '2025-0000223', course: 'BEED', yearLevel: '2' },
    { name: 'GELSANO, HARYLL SUTANA', email: '2023-0000046@bgfc.edu.ph', studentId: '2023-0000046', course: 'BSBA', yearLevel: '3' },
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
          yearLevel: studentData.yearLevel,
        },
      })

      console.log(`✅ Created student: ${studentData.name} (${studentData.studentId}) - ${studentData.course} - Year ${studentData.yearLevel}`)
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