import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 5 database seed...')

  // Create student users and records - Batch 5 (Students 440-551)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'LUBAPIS, CLEA MAY DIZON', email: '2016-1543@bgfc.edu.ph', studentId: '2016-1543', course: 'BEED' },
    { name: 'LUBAPIS, DHANAYA GENZON', email: '2024-0000073@bgfc.edu.ph', studentId: '2024-0000073', course: 'BEED' },
    { name: 'LUBAPIS, JAICA MANTE', email: '2022-0004232@bgfc.edu.ph', studentId: '2022-0004232', course: 'BEED' },
    { name: 'LUBAPIS, SHINDY', email: '2022-0003935@bgfc.edu.ph', studentId: '2022-0003935', course: 'BEED' },
    { name: 'LUSTIVA, MACY L.', email: '2023-0000031@bgfc.edu.ph', studentId: '2023-0000031', course: 'BEED' },
    { name: 'MACABODBOD, ALEXA DIGAL', email: '2024-0000107@bgfc.edu.ph', studentId: '2024-0000107', course: 'BEED' },
    { name: 'MACABODBOD, JANNA C.', email: '2022-0003928@bgfc.edu.ph', studentId: '2022-0003928', course: 'BEED' },
    { name: 'MACABODBOD, JERICK CONSIGNA', email: '2025-0000184@bgfc.edu.ph', studentId: '2025-0000184', course: 'BEED' },
    { name: 'MACABODBOD, REYNAN CORDITA', email: '2023-0000223@bgfc.edu.ph', studentId: '2023-0000223', course: 'BEED' },
    { name: 'MACALOLOT, CLARE PEJAN', email: '2025-0000227@bgfc.edu.ph', studentId: '2025-0000227', course: 'BEED' },
    { name: 'MANLIGUEZ, HANNAH SARNO', email: '2021-0003807@bgfc.edu.ph', studentId: '2021-0003807', course: 'BEED' },
    { name: 'MANTE, AMIEL D', email: '2025-0000142@bgfc.edu.ph', studentId: '2025-0000142', course: 'BEED' },
    { name: 'MANTE, BRILLAN D.', email: '2022-0004132@bgfc.edu.ph', studentId: '2022-0004132', course: 'BEED' },
    { name: 'MANTE, DALE OPEE SANICO', email: '2025-0000008@bgfc.edu.ph', studentId: '2025-0000008', course: 'BEED' },
    { name: 'MANTE, KC ALICAÑA', email: '2025-0000082@bgfc.edu.ph', studentId: '2025-0000082', course: 'BEED' },
    { name: 'MANTE, KHLEA C', email: '2022-0004152@bgfc.edu.ph', studentId: '2022-0004152', course: 'BEED' },
    { name: 'MANTE, MARK JANCENT PADAL', email: '2025-0000053@bgfc.edu.ph', studentId: '2025-0000053', course: 'BEED' },
    { name: 'MANTE, MARK JUSTINE HUMAYLAB', email: '2024-0000152@bgfc.edu.ph', studentId: '2024-0000152', course: 'BEED' },
    { name: 'MANTE, RECHEE Q', email: '2023-0000027@bgfc.edu.ph', studentId: '2023-0000027', course: 'BEED' },
    { name: 'MANTE, SAN CHAI PADAL', email: '2022-0004220@bgfc.edu.ph', studentId: '2022-0004220', course: 'BEED' },
    { name: 'MANTILLA, SHAMRA CALAMBA', email: '2024-0000071@bgfc.edu.ph', studentId: '2024-0000071', course: 'BEED' },
    { name: 'MASCARDO, ARIAN M.', email: '2023-0000116@bgfc.edu.ph', studentId: '2023-0000116', course: 'BEED' },
    { name: 'MASCARDO, DELABRIL D', email: '2022-0004083@bgfc.edu.ph', studentId: '2022-0004083', course: 'BEED' },
    { name: 'MASCARDO, GIO ROBERTINO B', email: '2024-0000124@bgfc.edu.ph', studentId: '2024-0000124', course: 'BEED' },
    { name: 'MASCARDO, HENRY MAISOS', email: '2020-0004214@bgfc.edu.ph', studentId: '2020-0004214', course: 'BEED' },
    { name: 'MASCARDO, JAMIL D', email: '2022-0004107@bgfc.edu.ph', studentId: '2022-0004107', course: 'BEED' },
    { name: 'MASCARDO, JULY LIANNE A.', email: '2024-0000007@bgfc.edu.ph', studentId: '2024-0000007', course: 'BEED' },
    { name: 'MASCARDO, MARIO L.', email: '2023-0000054@bgfc.edu.ph', studentId: '2023-0000054', course: 'BEED' },
    { name: 'MATURAN, CHAILAMAE TINAMBACAN', email: '2025-0000099@bgfc.edu.ph', studentId: '2025-0000099', course: 'BEED' },
    { name: 'MATURAN, CHYNA CONSIGNA', email: '2024-0000079@bgfc.edu.ph', studentId: '2024-0000079', course: 'BEED' },
    { name: 'MATURAN, GENELYN G.', email: '2020-0003262@bgfc.edu.ph', studentId: '2020-0003262', course: 'BEED' },
    { name: 'MATURAN, JACKLET M', email: '2025-0000132@bgfc.edu.ph', studentId: '2025-0000132', course: 'BEED' },
    { name: 'MATURAN, JAMAICA TINAMBACAN', email: '2023-0000149@bgfc.edu.ph', studentId: '2023-0000149', course: 'BEED' },
    { name: 'MATURAN, JANE CHRISTINE P', email: '2022-0003948@bgfc.edu.ph', studentId: '2022-0003948', course: 'BEED' },
    { name: 'MATURAN, JESSA PLAZA', email: '2025-0000225@bgfc.edu.ph', studentId: '2025-0000225', course: 'BEED' },
    { name: 'MATURAN, JORAYA M', email: '2022-0003940@bgfc.edu.ph', studentId: '2022-0003940', course: 'BEED' },
    { name: 'MATURAN, MAISAN D.', email: '2022-0003927@bgfc.edu.ph', studentId: '2022-0003927', course: 'BEED' },
    { name: 'MATURAN, NOVIEN JOHN C', email: '2022-0003974@bgfc.edu.ph', studentId: '2022-0003974', course: 'BEED' },
    { name: 'MATURAN, PATRICK JUANITE', email: '2024-0000126@bgfc.edu.ph', studentId: '2024-0000126', course: 'BEED' },
    { name: 'MATURAN, SHAKIRA IGNALIG', email: '2025-0000086@bgfc.edu.ph', studentId: '2025-0000086', course: 'BEED' },
    { name: 'MAULION, LEONARD ELANDAG', email: '2024-0000090@bgfc.edu.ph', studentId: '2024-0000090', course: 'BEED' },
    { name: 'MAYOR, SHELLY JANE GAYDA', email: '2025-0000094@bgfc.edu.ph', studentId: '2025-0000094', course: 'BEED' },
    { name: 'MEDRANO, ALTHIA LLEVA DAÑAS', email: '2022-0003912@bgfc.edu.ph', studentId: '2022-0003912', course: 'BEED' },
    { name: 'MEDRANO, ERNAN D.', email: '2022-0004031@bgfc.edu.ph', studentId: '2022-0004031', course: 'BEED' },
    { name: 'MEDRANO, JEHARA D', email: '2022-0003956@bgfc.edu.ph', studentId: '2022-0003956', course: 'BEED' },
    { name: 'MEDRANO, JIMMER CONSIGNA', email: '2024-0000091@bgfc.edu.ph', studentId: '2024-0000091', course: 'BEED' },
    { name: 'MEDRANO, JOHN PAUL C.', email: '2022-0004049@bgfc.edu.ph', studentId: '2022-0004049', course: 'BEED' },
    { name: 'MEGULLAS, GERRY D', email: '2023-0000045@bgfc.edu.ph', studentId: '2023-0000045', course: 'BEED' },
    { name: 'MICOMPAL, JAMES AARON GAMBING', email: '2025-0000233@bgfc.edu.ph', studentId: '2025-0000233', course: 'BEED' },
    { name: 'MICOMPAL, LESTER JOHN GAMBING', email: '2024-0000122@bgfc.edu.ph', studentId: '2024-0000122', course: 'BEED' },
    { name: 'MONDRAGON, ANDRIAN E.', email: '2021-0003765@bgfc.edu.ph', studentId: '2021-0003765', course: 'BEED' },
    { name: 'MONDRAGON, GANDANIE CORDITA', email: '2025-0000137@bgfc.edu.ph', studentId: '2025-0000137', course: 'BEED' },
    { name: 'MONDRAGON JR., APPLE DEE C.', email: '2022-0004198@bgfc.edu.ph', studentId: '2022-0004198', course: 'BEED' },
    { name: 'MONTER, ANGEL BATO', email: '2025-0000146@bgfc.edu.ph', studentId: '2025-0000146', course: 'BEED' },
    { name: 'MONTER, LIAN T.', email: '2022-0004021@bgfc.edu.ph', studentId: '2022-0004021', course: 'BEED' },
    { name: 'MONTER, SANDARA GELSANO', email: '2024-0000116@bgfc.edu.ph', studentId: '2024-0000116', course: 'BEED' },
    { name: 'MORGADO, RAYMARK A', email: '2022-0004221@bgfc.edu.ph', studentId: '2022-0004221', course: 'BEED' },
    { name: 'MORIAL, AIVAN DELIMAN', email: '2024-0000144@bgfc.edu.ph', studentId: '2024-0000144', course: 'BEED' },
    { name: 'OCON, JHON DAVE PLAZA', email: '2025-0000113@bgfc.edu.ph', studentId: '2025-0000113', course: 'BEED' },
    { name: 'OCON, LIANNE P.', email: '2023-0000056@bgfc.edu.ph', studentId: '2023-0000056', course: 'BEED' },
    { name: 'OCON, MARK GEMIL E', email: '2022-0004002@bgfc.edu.ph', studentId: '2022-0004002', course: 'BEED' },
    { name: 'OCON, MELISSA B.', email: '2023-0000111@bgfc.edu.ph', studentId: '2023-0000111', course: 'BEED' },
    { name: 'OCON, REYNIE J.', email: '2022-0004174@bgfc.edu.ph', studentId: '2022-0004174', course: 'BEED' },
    { name: 'OGARIO, ANGEL TRISHA MAE SAVANDAL', email: '2024-0000030@bgfc.edu.ph', studentId: '2024-0000030', course: 'BEED' },
    { name: 'OMALA, BENJIE A.', email: '2022-0004039@bgfc.edu.ph', studentId: '2022-0004039', course: 'BEED' },
    { name: 'OMAS-AS, JURAFEL P.', email: '2022-0003981@bgfc.edu.ph', studentId: '2022-0003981', course: 'BEED' },
    { name: 'OMAS-AS, NOVE QUEEN PIEDAD', email: '2024-0000093@bgfc.edu.ph', studentId: '2024-0000093', course: 'BEED' },
    { name: 'OSLOB, ANGEL GALABIN', email: '2025-0000212@bgfc.edu.ph', studentId: '2025-0000212', course: 'BEED' },
    { name: 'OSLOB, IRENE MAE C', email: '2023-0000085@bgfc.edu.ph', studentId: '2023-0000085', course: 'BEED' },
    { name: 'OSLOB, MANUELITO, JR. ARCULAR', email: '2025-0000119@bgfc.edu.ph', studentId: '2025-0000119', course: 'BEED' },
    { name: 'PADAL, CLEOFE ZAIRA J.', email: '2022-0003933@bgfc.edu.ph', studentId: '2022-0003933', course: 'BEED' },
    { name: 'PADAL, DONNALEE Q', email: '2023-0000058@bgfc.edu.ph', studentId: '2023-0000058', course: 'BEED' },
    { name: 'PADESIO, BERNADETTE D.', email: '2021-0003756@bgfc.edu.ph', studentId: '2021-0003756', course: 'BEED' },
    { name: 'PADOHINOG, JUSTICA JAMAICA M.', email: '2023-0000099@bgfc.edu.ph', studentId: '2023-0000099', course: 'BEED' },
    { name: 'PAGALAN, GLYCA GUY-AB', email: '2025-0000057@bgfc.edu.ph', studentId: '2025-0000057', course: 'BEED' },
    { name: 'PAGALAN, SHARA BIANCA H', email: '2023-0000083@bgfc.edu.ph', studentId: '2023-0000083', course: 'BEED' },
    { name: 'PAITAN, JHANNAH VHANISE CALAMBA', email: '2025-0000080@bgfc.edu.ph', studentId: '2025-0000080', course: 'BEED' },
    { name: 'PAJA, BENJACK ADOBAS', email: '2024-0000110@bgfc.edu.ph', studentId: '2024-0000110', course: 'BEED' },
    { name: 'PAJA, DENNIS SAMLOU Q.', email: '2022-0004085@bgfc.edu.ph', studentId: '2022-0004085', course: 'BEED' },
    { name: 'PAJA, IVORY TINAMBACAN', email: '2024-0000057@bgfc.edu.ph', studentId: '2024-0000057', course: 'BEED' },
    { name: 'PAJA, MELJUN J.', email: '2023-0000226@bgfc.edu.ph', studentId: '2023-0000226', course: 'BEED' },
    { name: 'PAJA, PRINCES IWA MARIE D', email: '2022-0004141@bgfc.edu.ph', studentId: '2022-0004141', course: 'BEED' },
    { name: 'PAJOYO, GIAN BALMORIA', email: '2024-0000151@bgfc.edu.ph', studentId: '2024-0000151', course: 'BEED' },
    { name: 'PAJOYO, JHANRA PEARL NIKITA G', email: '2023-0000115@bgfc.edu.ph', studentId: '2023-0000115', course: 'BEED' },
    { name: 'PAJOYO, ROVIE MAE JULIADA', email: '2024-0000052@bgfc.edu.ph', studentId: '2024-0000052', course: 'BEED' },
    { name: 'PAJOYO, SHARRY DIGAL', email: '2025-0000006@bgfc.edu.ph', studentId: '2025-0000006', course: 'BEED' },
    { name: 'PALEN, NEKKA S', email: '2022-0004036@bgfc.edu.ph', studentId: '2022-0004036', course: 'BEED' },
    { name: 'PALEN, SHAINA Q', email: '2014-2271@bgfc.edu.ph', studentId: '2014-2271', course: 'BEED' },
    { name: 'PALMA, NESTLE GUMA', email: '2025-0000092@bgfc.edu.ph', studentId: '2025-0000092', course: 'BEED' },
    { name: 'PANGATONGAN, CHRISTIAN KENTH ALCALA', email: '2024-0000087@bgfc.edu.ph', studentId: '2024-0000087', course: 'BEED' },
    { name: 'PANGATONGAN, KARL DAVE CINCO', email: '2025-0000207@bgfc.edu.ph', studentId: '2025-0000207', course: 'BEED' },
    { name: 'PANGATUNGAN, CHIENA MASCARDO', email: '2024-0000088@bgfc.edu.ph', studentId: '2024-0000088', course: 'BEED' },
    { name: 'PANGATUNGAN, JELIAN TINAMBACAN', email: '2024-0000058@bgfc.edu.ph', studentId: '2024-0000058', course: 'BEED' },
    { name: 'PANGATUNGAN, MEY-ANN SAGA', email: '2022-0003913@bgfc.edu.ph', studentId: '2022-0003913', course: 'BEED' },
    { name: 'PANGATUNGAN, REX E.', email: '2022-0003995@bgfc.edu.ph', studentId: '2022-0003995', course: 'BEED' },
    { name: 'PARO, ALTHEA DENISE GULTIANO', email: '2025-0000199@bgfc.edu.ph', studentId: '2025-0000199', course: 'BEED' },
    { name: 'PELIAS, JUNE DENVER DIZON', email: '2024-0000041@bgfc.edu.ph', studentId: '2024-0000041', course: 'BEED' },
    { name: 'PELIAS, KHIA A.', email: '2022-0004176@bgfc.edu.ph', studentId: '2022-0004176', course: 'BEED' },
    { name: 'PELIAS, SARACHEN DANTES', email: '2024-0000100@bgfc.edu.ph', studentId: '2024-0000100', course: 'BEED' },
    { name: 'PERAMEDI, SHAMEL D.', email: '2023-0000075@bgfc.edu.ph', studentId: '2023-0000075', course: 'BEED' },
    { name: 'PIALES, APRIL MAE', email: '2025-0000013@bgfc.edu.ph', studentId: '2025-0000013', course: 'BEED' },
    { name: 'PIAO, NIÑA KYLA D.', email: '2023-0000021@bgfc.edu.ph', studentId: '2023-0000021', course: 'BEED' },
    { name: 'PLAZA, CHRISTIAN KIM B.', email: '2022-0004080@bgfc.edu.ph', studentId: '2022-0004080', course: 'BEED' },
    { name: 'PLAZA, JAMAICHA M.', email: '2022-0004145@bgfc.edu.ph', studentId: '2022-0004145', course: 'BEED' },
    { name: 'PLAZA, JEFFREY SARONG', email: '2024-0000132@bgfc.edu.ph', studentId: '2024-0000132', course: 'BEED' },
    { name: 'PLAZA, KEN QUIBAN', email: '2022-0004231@bgfc.edu.ph', studentId: '2022-0004231', course: 'BEED' },
    { name: 'PLAZA, KERBY G', email: '2022-0004041@bgfc.edu.ph', studentId: '2022-0004041', course: 'BEED' },
    { name: 'PORTILLO, MISHA RAILY QUISAGAN', email: '2025-0000071@bgfc.edu.ph', studentId: '2025-0000071', course: 'BEED' },
    { name: 'PUEBLOS, APPLE JOY FLORENDO', email: '2025-0000213@bgfc.edu.ph', studentId: '2025-0000213', course: 'BEED' },
    { name: 'PURISIMA, JUMIL JHONE TARTAR', email: '2025-0000196@bgfc.edu.ph', studentId: '2025-0000196', course: 'BEED' },
    { name: 'QUESTERIA, JHON BREGETZ LUBAPIS', email: '2024-0000108@bgfc.edu.ph', studentId: '2024-0000108', course: 'BEED' },
    { name: 'QUESTERIA, MARKEE BOHOL', email: '2024-0000038@bgfc.edu.ph', studentId: '2024-0000038', course: 'BEED' },
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

  console.log('🎉 Batch 5 database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })