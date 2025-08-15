import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 5 database seed...')

  // Create student users and records - Batch 5 (Students 440-551)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'LUBAPIS, CLEA MAY DIZON', email: '2016-1543@bgfc.edu.ph', studentId: '2016-1543' },
    { name: 'LUBAPIS, DHANAYA GENZON', email: '2024-0000073@bgfc.edu.ph', studentId: '2024-0000073' },
    { name: 'LUBAPIS, JAICA MANTE', email: '2022-0004232@bgfc.edu.ph', studentId: '2022-0004232' },
    { name: 'LUBAPIS, SHINDY', email: '2022-0003935@bgfc.edu.ph', studentId: '2022-0003935' },
    { name: 'LUSTIVA, MACY L.', email: '2023-0000031@bgfc.edu.ph', studentId: '2023-0000031' },
    { name: 'MACABODBOD, ALEXA DIGAL', email: '2024-0000107@bgfc.edu.ph', studentId: '2024-0000107' },
    { name: 'MACABODBOD, JANNA C.', email: '2022-0003928@bgfc.edu.ph', studentId: '2022-0003928' },
    { name: 'MACABODBOD, JERICK CONSIGNA', email: '2025-0000184@bgfc.edu.ph', studentId: '2025-0000184' },
    { name: 'MACABODBOD, REYNAN CORDITA', email: '2023-0000223@bgfc.edu.ph', studentId: '2023-0000223' },
    { name: 'MACALOLOT, CLARE PEJAN', email: '2025-0000227@bgfc.edu.ph', studentId: '2025-0000227' },
    { name: 'MANLIGUEZ, HANNAH SARNO', email: '2021-0003807@bgfc.edu.ph', studentId: '2021-0003807' },
    { name: 'MANTE, AMIEL D', email: '2025-0000142@bgfc.edu.ph', studentId: '2025-0000142' },
    { name: 'MANTE, BRILLAN D.', email: '2022-0004132@bgfc.edu.ph', studentId: '2022-0004132' },
    { name: 'MANTE, DALE OPEE SANICO', email: '2025-0000008@bgfc.edu.ph', studentId: '2025-0000008' },
    { name: 'MANTE, KC ALICAÑA', email: '2025-0000082@bgfc.edu.ph', studentId: '2025-0000082' },
    { name: 'MANTE, KHLEA C', email: '2022-0004152@bgfc.edu.ph', studentId: '2022-0004152' },
    { name: 'MANTE, MARK JANCENT PADAL', email: '2025-0000053@bgfc.edu.ph', studentId: '2025-0000053' },
    { name: 'MANTE, MARK JUSTINE HUMAYLAB', email: '2024-0000152@bgfc.edu.ph', studentId: '2024-0000152' },
    { name: 'MANTE, RECHEE Q', email: '2023-0000027@bgfc.edu.ph', studentId: '2023-0000027' },
    { name: 'MANTE, SAN CHAI PADAL', email: '2022-0004220@bgfc.edu.ph', studentId: '2022-0004220' },
    { name: 'MANTILLA, SHAMRA CALAMBA', email: '2024-0000071@bgfc.edu.ph', studentId: '2024-0000071' },
    { name: 'MASCARDO, ARIAN M.', email: '2023-0000116@bgfc.edu.ph', studentId: '2023-0000116' },
    { name: 'MASCARDO, DELABRIL D', email: '2022-0004083@bgfc.edu.ph', studentId: '2022-0004083' },
    { name: 'MASCARDO, GIO ROBERTINO B', email: '2024-0000124@bgfc.edu.ph', studentId: '2024-0000124' },
    { name: 'MASCARDO, HENRY MAISOS', email: '2020-0004214@bgfc.edu.ph', studentId: '2020-0004214' },
    { name: 'MASCARDO, JAMIL D', email: '2022-0004107@bgfc.edu.ph', studentId: '2022-0004107' },
    { name: 'MASCARDO, JULY LIANNE A.', email: '2024-0000007@bgfc.edu.ph', studentId: '2024-0000007' },
    { name: 'MASCARDO, MARIO L.', email: '2023-0000054@bgfc.edu.ph', studentId: '2023-0000054' },
    { name: 'MATURAN, CHAILAMAE TINAMBACAN', email: '2025-0000099@bgfc.edu.ph', studentId: '2025-0000099' },
    { name: 'MATURAN, CHYNA CONSIGNA', email: '2024-0000079@bgfc.edu.ph', studentId: '2024-0000079' },
    { name: 'MATURAN, GENELYN G.', email: '2020-0003262@bgfc.edu.ph', studentId: '2020-0003262' },
    { name: 'MATURAN, JACKLET M', email: '2025-0000132@bgfc.edu.ph', studentId: '2025-0000132' },
    { name: 'MATURAN, JAMAICA TINAMBACAN', email: '2023-0000149@bgfc.edu.ph', studentId: '2023-0000149' },
    { name: 'MATURAN, JANE CHRISTINE P', email: '2022-0003948@bgfc.edu.ph', studentId: '2022-0003948' },
    { name: 'MATURAN, JESSA PLAZA', email: '2025-0000225@bgfc.edu.ph', studentId: '2025-0000225' },
    { name: 'MATURAN, JORAYA M', email: '2022-0003940@bgfc.edu.ph', studentId: '2022-0003940' },
    { name: 'MATURAN, MAISAN D.', email: '2022-0003927@bgfc.edu.ph', studentId: '2022-0003927' },
    { name: 'MATURAN, NOVIEN JOHN C', email: '2022-0003974@bgfc.edu.ph', studentId: '2022-0003974' },
    { name: 'MATURAN, PATRICK JUANITE', email: '2024-0000126@bgfc.edu.ph', studentId: '2024-0000126' },
    { name: 'MATURAN, SHAKIRA IGNALIG', email: '2025-0000086@bgfc.edu.ph', studentId: '2025-0000086' },
    { name: 'MAULION, LEONARD ELANDAG', email: '2024-0000090@bgfc.edu.ph', studentId: '2024-0000090' },
    { name: 'MAYOR, SHELLY JANE GAYDA', email: '2025-0000094@bgfc.edu.ph', studentId: '2025-0000094' },
    { name: 'MEDRANO, ALTHIA LLEVA DAÑAS', email: '2022-0003912@bgfc.edu.ph', studentId: '2022-0003912' },
    { name: 'MEDRANO, ERNAN D.', email: '2022-0004031@bgfc.edu.ph', studentId: '2022-0004031' },
    { name: 'MEDRANO, JEHARA D', email: '2022-0003956@bgfc.edu.ph', studentId: '2022-0003956' },
    { name: 'MEDRANO, JIMMER CONSIGNA', email: '2024-0000091@bgfc.edu.ph', studentId: '2024-0000091' },
    { name: 'MEDRANO, JOHN PAUL C.', email: '2022-0004049@bgfc.edu.ph', studentId: '2022-0004049' },
    { name: 'MEGULLAS, GERRY D', email: '2023-0000045@bgfc.edu.ph', studentId: '2023-0000045' },
    { name: 'MICOMPAL, JAMES AARON GAMBING', email: '2025-0000233@bgfc.edu.ph', studentId: '2025-0000233' },
    { name: 'MICOMPAL, LESTER JOHN GAMBING', email: '2024-0000122@bgfc.edu.ph', studentId: '2024-0000122' },
    { name: 'MONDRAGON, ANDRIAN E.', email: '2021-0003765@bgfc.edu.ph', studentId: '2021-0003765' },
    { name: 'MONDRAGON, GANDANIE CORDITA', email: '2025-0000137@bgfc.edu.ph', studentId: '2025-0000137' },
    { name: 'MONDRAGON JR., APPLE DEE C.', email: '2022-0004198@bgfc.edu.ph', studentId: '2022-0004198' },
    { name: 'MONTER, ANGEL BATO', email: '2025-0000146@bgfc.edu.ph', studentId: '2025-0000146' },
    { name: 'MONTER, LIAN T.', email: '2022-0004021@bgfc.edu.ph', studentId: '2022-0004021' },
    { name: 'MONTER, SANDARA GELSANO', email: '2024-0000116@bgfc.edu.ph', studentId: '2024-0000116' },
    { name: 'MORGADO, RAYMARK A', email: '2022-0004221@bgfc.edu.ph', studentId: '2022-0004221' },
    { name: 'MORIAL, AIVAN DELIMAN', email: '2024-0000144@bgfc.edu.ph', studentId: '2024-0000144' },
    { name: 'OCON, JHON DAVE PLAZA', email: '2025-0000113@bgfc.edu.ph', studentId: '2025-0000113' },
    { name: 'OCON, LIANNE P.', email: '2023-0000056@bgfc.edu.ph', studentId: '2023-0000056' },
    { name: 'OCON, MARK GEMIL E', email: '2022-0004002@bgfc.edu.ph', studentId: '2022-0004002' },
    { name: 'OCON, MELISSA B.', email: '2023-0000111@bgfc.edu.ph', studentId: '2023-0000111' },
    { name: 'OCON, REYNIE J.', email: '2022-0004174@bgfc.edu.ph', studentId: '2022-0004174' },
    { name: 'OGARIO, ANGEL TRISHA MAE SAVANDAL', email: '2024-0000030@bgfc.edu.ph', studentId: '2024-0000030' },
    { name: 'OMALA, BENJIE A.', email: '2022-0004039@bgfc.edu.ph', studentId: '2022-0004039' },
    { name: 'OMAS-AS, JURAFEL P.', email: '2022-0003981@bgfc.edu.ph', studentId: '2022-0003981' },
    { name: 'OMAS-AS, NOVE QUEEN PIEDAD', email: '2024-0000093@bgfc.edu.ph', studentId: '2024-0000093' },
    { name: 'OSLOB, ANGEL GALABIN', email: '2025-0000212@bgfc.edu.ph', studentId: '2025-0000212' },
    { name: 'OSLOB, IRENE MAE C', email: '2023-0000085@bgfc.edu.ph', studentId: '2023-0000085' },
    { name: 'OSLOB, MANUELITO, JR. ARCULAR', email: '2025-0000119@bgfc.edu.ph', studentId: '2025-0000119' },
    { name: 'PADAL, CLEOFE ZAIRA J.', email: '2022-0003933@bgfc.edu.ph', studentId: '2022-0003933' },
    { name: 'PADAL, DONNALEE Q', email: '2023-0000058@bgfc.edu.ph', studentId: '2023-0000058' },
    { name: 'PADESIO, BERNADETTE D.', email: '2021-0003756@bgfc.edu.ph', studentId: '2021-0003756' },
    { name: 'PADOHINOG, JUSTICA JAMAICA M.', email: '2023-0000099@bgfc.edu.ph', studentId: '2023-0000099' },
    { name: 'PAGALAN, GLYCA GUY-AB', email: '2025-0000057@bgfc.edu.ph', studentId: '2025-0000057' },
    { name: 'PAGALAN, SHARA BIANCA H', email: '2023-0000083@bgfc.edu.ph', studentId: '2023-0000083' },
    { name: 'PAITAN, JHANNAH VHANISE CALAMBA', email: '2025-0000080@bgfc.edu.ph', studentId: '2025-0000080' },
    { name: 'PAJA, BENJACK ADOBAS', email: '2024-0000110@bgfc.edu.ph', studentId: '2024-0000110' },
    { name: 'PAJA, DENNIS SAMLOU Q.', email: '2022-0004085@bgfc.edu.ph', studentId: '2022-0004085' },
    { name: 'PAJA, IVORY TINAMBACAN', email: '2024-0000057@bgfc.edu.ph', studentId: '2024-0000057' },
    { name: 'PAJA, MELJUN J.', email: '2023-0000226@bgfc.edu.ph', studentId: '2023-0000226' },
    { name: 'PAJA, PRINCES IWA MARIE D', email: '2022-0004141@bgfc.edu.ph', studentId: '2022-0004141' },
    { name: 'PAJOYO, GIAN BALMORIA', email: '2024-0000151@bgfc.edu.ph', studentId: '2024-0000151' },
    { name: 'PAJOYO, JHANRA PEARL NIKITA G', email: '2023-0000115@bgfc.edu.ph', studentId: '2023-0000115' },
    { name: 'PAJOYO, ROVIE MAE JULIADA', email: '2024-0000052@bgfc.edu.ph', studentId: '2024-0000052' },
    { name: 'PAJOYO, SHARRY DIGAL', email: '2025-0000006@bgfc.edu.ph', studentId: '2025-0000006' },
    { name: 'PALEN, NEKKA S', email: '2022-0004036@bgfc.edu.ph', studentId: '2022-0004036' },
    { name: 'PALEN, SHAINA Q', email: '2014-2271@bgfc.edu.ph', studentId: '2014-2271' },
    { name: 'PALMA, NESTLE GUMA', email: '2025-0000092@bgfc.edu.ph', studentId: '2025-0000092' },
    { name: 'PANGATONGAN, CHRISTIAN KENTH ALCALA', email: '2024-0000087@bgfc.edu.ph', studentId: '2024-0000087' },
    { name: 'PANGATONGAN, KARL DAVE CINCO', email: '2025-0000207@bgfc.edu.ph', studentId: '2025-0000207' },
    { name: 'PANGATUNGAN, CHIENA MASCARDO', email: '2024-0000088@bgfc.edu.ph', studentId: '2024-0000088' },
    { name: 'PANGATUNGAN, JELIAN TINAMBACAN', email: '2024-0000058@bgfc.edu.ph', studentId: '2024-0000058' },
    { name: 'PANGATUNGAN, MEY-ANN SAGA', email: '2022-0003913@bgfc.edu.ph', studentId: '2022-0003913' },
    { name: 'PANGATUNGAN, REX E.', email: '2022-0003995@bgfc.edu.ph', studentId: '2022-0003995' },
    { name: 'PARO, ALTHEA DENISE GULTIANO', email: '2025-0000199@bgfc.edu.ph', studentId: '2025-0000199' },
    { name: 'PELIAS, JUNE DENVER DIZON', email: '2024-0000041@bgfc.edu.ph', studentId: '2024-0000041' },
    { name: 'PELIAS, KHIA A.', email: '2022-0004176@bgfc.edu.ph', studentId: '2022-0004176' },
    { name: 'PELIAS, SARACHEN DANTES', email: '2024-0000100@bgfc.edu.ph', studentId: '2024-0000100' },
    { name: 'PERAMEDI, SHAMEL D.', email: '2023-0000075@bgfc.edu.ph', studentId: '2023-0000075' },
    { name: 'PIALES, APRIL MAE', email: '2025-0000013@bgfc.edu.ph', studentId: '2025-0000013' },
    { name: 'PIAO, NIÑA KYLA D.', email: '2023-0000021@bgfc.edu.ph', studentId: '2023-0000021' },
    { name: 'PLAZA, CHRISTIAN KIM B.', email: '2022-0004080@bgfc.edu.ph', studentId: '2022-0004080' },
    { name: 'PLAZA, JAMAICHA M.', email: '2022-0004145@bgfc.edu.ph', studentId: '2022-0004145' },
    { name: 'PLAZA, JEFFREY SARONG', email: '2024-0000132@bgfc.edu.ph', studentId: '2024-0000132' },
    { name: 'PLAZA, KEN QUIBAN', email: '2022-0004231@bgfc.edu.ph', studentId: '2022-0004231' },
    { name: 'PLAZA, KERBY G', email: '2022-0004041@bgfc.edu.ph', studentId: '2022-0004041' },
    { name: 'PORTILLO, MISHA RAILY QUISAGAN', email: '2025-0000071@bgfc.edu.ph', studentId: '2025-0000071' },
    { name: 'PUEBLOS, APPLE JOY FLORENDO', email: '2025-0000213@bgfc.edu.ph', studentId: '2025-0000213' },
    { name: 'PURISIMA, JUMIL JHONE TARTAR', email: '2025-0000196@bgfc.edu.ph', studentId: '2025-0000196' },
    { name: 'QUESTERIA, JHON BREGETZ LUBAPIS', email: '2024-0000108@bgfc.edu.ph', studentId: '2024-0000108' },
    { name: 'QUESTERIA, MARKEE BOHOL', email: '2024-0000038@bgfc.edu.ph', studentId: '2024-0000038' },
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
