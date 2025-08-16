import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 2 database seed...')

  // Create student users and records - Batch 2 (Students 104-215)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'BESAS, MARIMAR GARCIA', email: '2025-0000200@bgfc.edu.ph', studentId: '2025-0000200', course: 'BSE', yearLevel: '1' },
    { name: 'BESINGA, DARREN MANTILLA', email: '2025-0000215@bgfc.edu.ph', studentId: '2025-0000215', course: 'BEED', yearLevel: '1' },
    { name: 'BESINGA, LANCE QUISADA', email: '2025-0000187@bgfc.edu.ph', studentId: '2025-0000187', course: 'BEED', yearLevel: '1' },
    { name: 'BIOL, BRIX ADLAO', email: '2025-0000180@bgfc.edu.ph', studentId: '2025-0000180', course: 'BSIT', yearLevel: '1' },
    { name: 'BOHOL, JERICK PIAO', email: '2024-0000133@bgfc.edu.ph', studentId: '2024-0000133', course: 'BSE', yearLevel: '2' },
    { name: 'BOHOL, KARYL J', email: '2023-0000103@bgfc.edu.ph', studentId: '2023-0000103', course: 'BEED', yearLevel: '3' },
    { name: 'BOHOL, PAUL-ACE B.', email: '2022-0003958@bgfc.edu.ph', studentId: '2022-0003958', course: 'BEED', yearLevel: '4' },
    { name: 'BORDAS, ARMANDO C.', email: '2023-0000133@bgfc.edu.ph', studentId: '2023-0000133', course: 'BSE', yearLevel: '3' },
    { name: 'BORDAS, CLEO DACERA', email: '2022-0004073@bgfc.edu.ph', studentId: '2022-0004073', course: 'BSCRIM', yearLevel: '4' },
    { name: 'BORDAS, JUHARI BOBI GUMA', email: '2024-0000059@bgfc.edu.ph', studentId: '2024-0000059', course: 'BSED - English', yearLevel: '2' },
    { name: 'BORDAS, KATIA JANE C', email: '2023-0000091@bgfc.edu.ph', studentId: '2023-0000091', course: 'BEED', yearLevel: '3' },
    { name: 'BORDAS, KEMLO BOHOL', email: '2024-0000056@bgfc.edu.ph', studentId: '2024-0000056', course: 'BEED', yearLevel: '2' },
    { name: 'BORDAS, SANIBOY JR. B.', email: '2023-0000086@bgfc.edu.ph', studentId: '2023-0000086', course: 'BEED', yearLevel: '3' },
    { name: 'BORDAS, TRESIA JANE C.', email: '2022-0003997@bgfc.edu.ph', studentId: '2022-0003997', course: 'BEED', yearLevel: '4' },
    { name: 'BOU, SHELAMAE ESTORIA', email: '2024-0000130@bgfc.edu.ph', studentId: '2024-0000130', course: 'BSCRIM', yearLevel: '2' },
    { name: 'BUNTAD, JERELYN VERTICAL', email: '2025-0000237@bgfc.edu.ph', studentId: '2025-0000237', course: 'BSCRIM', yearLevel: '1' },
    { name: 'BUNTAD, JOHN PAUL A.', email: '2022-0004015@bgfc.edu.ph', studentId: '2022-0004015', course: 'BSE', yearLevel: '4' },
    { name: 'BUO, JUSTINE ANGCOG', email: '2025-0000168@bgfc.edu.ph', studentId: '2025-0000168', course: 'BSIT', yearLevel: '1' },
    { name: 'BUYSER, OWEN-KIM JOAQUINO', email: '2025-0000102@bgfc.edu.ph', studentId: '2025-0000102', course: 'BSIT', yearLevel: '1' },
    { name: 'BUYSER, SHIMBERLYN DAÑAS', email: '2023-0000144@bgfc.edu.ph', studentId: '2023-0000144', course: 'BSBA', yearLevel: '2' },
    { name: 'CABAHUG, AXELROSE G', email: '2025-0000127@bgfc.edu.ph', studentId: '2025-0000127', course: 'BEED', yearLevel: '1' },
    { name: 'CABAHUG, MERRY JOY GAJUMAN', email: '2024-0000103@bgfc.edu.ph', studentId: '2024-0000103', course: 'BSBA', yearLevel: '1' },
    { name: 'CAGATIN, ANGEL CANTA', email: '2025-0000128@bgfc.edu.ph', studentId: '2025-0000128', course: 'BEED', yearLevel: '1' },
    { name: 'CAGATIN, JAIRA P', email: '2025-0000144@bgfc.edu.ph', studentId: '2025-0000144', course: 'BEED', yearLevel: '1' },
    { name: 'CAGATIN, JAMARA P', email: '2024-0000018@bgfc.edu.ph', studentId: '2024-0000018', course: 'BEED', yearLevel: '2' },
    { name: 'CAGATIN, ZANDER HINGPIT', email: '2025-0000131@bgfc.edu.ph', studentId: '2025-0000131', course: 'BSBA', yearLevel: '1' },
    { name: 'CAINDOY, SHAINA ALCALA', email: '2024-0000078@bgfc.edu.ph', studentId: '2024-0000078', course: 'BSBA', yearLevel: '2' },
    { name: 'CAINTOY, SUNSHINE CRUIZ', email: '2024-0000043@bgfc.edu.ph', studentId: '2024-0000043', course: 'BSED - English', yearLevel: '2' },
    { name: 'CALAMBA, JINILYN L.', email: '2023-0000050@bgfc.edu.ph', studentId: '2023-0000050', course: 'BEED', yearLevel: '3' },
    { name: 'CALAMBA, SHARMEL GARCIA', email: '2025-0000096@bgfc.edu.ph', studentId: '2025-0000096', course: 'BEED', yearLevel: '1' },
    { name: 'CAMBAYA, ROSE BEE C.', email: '2023-0000053@bgfc.edu.ph', studentId: '2023-0000053', course: 'BSED - English', yearLevel: '3' },
    { name: 'CANONOY, ALLYZA MAE MANLIGUEZ', email: '2024-0000140@bgfc.edu.ph', studentId: '2024-0000140', course: 'BSED - Math', yearLevel: '2' },
    { name: 'CANOY, LEAHNDREY BERBAL', email: '2025-0000205@bgfc.edu.ph', studentId: '2025-0000205', course: 'BSIT', yearLevel: '1' },
    { name: 'CANTA, ARKINTH ROSILLO', email: '2025-0000160@bgfc.edu.ph', studentId: '2025-0000160', course: 'BSIT', yearLevel: '1' },
    { name: 'CANTA, CRIAH CARDUZA', email: '2025-0000003@bgfc.edu.ph', studentId: '2025-0000003', course: 'BEED', yearLevel: '2' },
    { name: 'CANTA, GEOFFREY MATURAN', email: '2024-0000115@bgfc.edu.ph', studentId: '2024-0000115', course: 'BSED - English', yearLevel: '2' },
    { name: 'CANTA, KRISHNER JHON D.', email: '2022-0003983@bgfc.edu.ph', studentId: '2022-0003983', course: 'BSED - Math', yearLevel: '4' },
    { name: 'CANTA, RAQUIM GELSANO', email: '2024-0000050@bgfc.edu.ph', studentId: '2024-0000050', course: 'BEED', yearLevel: '2' },
    { name: 'CAPISTRANO, KIERTJUN', email: '2022-0004014@bgfc.edu.ph', studentId: '2022-0004014', course: 'BSIT', yearLevel: '4' },
    { name: 'CAPISTRANO, RIJON-KIRVEN HINGPIT', email: '2025-0000203@bgfc.edu.ph', studentId: '2025-0000203', course: 'BEED', yearLevel: '1' },
    { name: 'CARDUZA, EVELYN JICA PAITAN', email: '2025-0000039@bgfc.edu.ph', studentId: '2025-0000039', course: 'BSED - English', yearLevel: '1' },
    { name: 'CARDUZA, NEIL VHEENE R.', email: '2022-0004005@bgfc.edu.ph', studentId: '2022-0004005', course: 'BEED', yearLevel: '4' },
    { name: 'CARDUZA, RHON FREDRICH E.', email: '2023-0000109@bgfc.edu.ph', studentId: '2023-0000109', course: 'BEED', yearLevel: '3' },
    { name: 'CARIAGA, JANNA ROSE D', email: '2022-0004069@bgfc.edu.ph', studentId: '2022-0004069', course: 'BEED', yearLevel: '4' },
    { name: 'CAWALING, JAKITSAN BANAYBANAY', email: '2025-0000172@bgfc.edu.ph', studentId: '2025-0000172', course: 'BSIT', yearLevel: '1' },
    { name: 'CONIATO, ELMO M.', email: '2022-0004185@bgfc.edu.ph', studentId: '2022-0004185', course: 'BSED - English', yearLevel: '4' },
    { name: 'CONIATO, HAROLD B', email: '2022-0004026@bgfc.edu.ph', studentId: '2022-0004026', course: 'BEED', yearLevel: '2' },
    { name: 'CONIATO, JULES KHADAFFY Q', email: '2022-0003968@bgfc.edu.ph', studentId: '2022-0003968', course: 'BEED', yearLevel: '4' },
    { name: 'CONIATO, SAM NATHANIEL C.', email: '2023-0000080@bgfc.edu.ph', studentId: '2023-0000080', course: 'BEED', yearLevel: '3' },
    { name: 'CONSIGNA, ALEXCHO C.', email: '2022-0003975@bgfc.edu.ph', studentId: '2022-0003975', course: 'BEED', yearLevel: '4' },
    { name: 'CONSIGNA, ANGEL BEA Q', email: '2025-0000140@bgfc.edu.ph', studentId: '2025-0000140', course: 'BEED', yearLevel: '1' },
    { name: 'CONSIGNA, APO AMJE GLENE E.', email: '2022-0004033@bgfc.edu.ph', studentId: '2022-0004033', course: 'BEED', yearLevel: '4' },
    { name: 'CONSIGNA, BERT WARREN T', email: '2022-0004058@bgfc.edu.ph', studentId: '2022-0004058', course: 'BEED', yearLevel: '4' },
    { name: 'CONSIGNA, CHAIKA ME MEDRANO', email: '2025-0000019@bgfc.edu.ph', studentId: '2025-0000019', course: 'BSIT', yearLevel: '1' },
    { name: 'CONSIGNA, CHAMARIAN S', email: '2022-0004143@bgfc.edu.ph', studentId: '2022-0004143', course: 'BSE', yearLevel: '3' },
    { name: 'CONSIGNA, CHAMSHYNA B', email: '2022-0004003@bgfc.edu.ph', studentId: '2022-0004003', course: 'BEED', yearLevel: '4' },
    { name: 'CONSIGNA, DALY JANE BUYSER', email: '2025-0000178@bgfc.edu.ph', studentId: '2025-0000178', course: 'BSED - English', yearLevel: '1' },
    { name: 'CONSIGNA, JASMINE MAISOS', email: '2022-0003916@bgfc.edu.ph', studentId: '2022-0003916', course: 'BEED', yearLevel: '4' },
    { name: 'CONSIGNA, JENILYN SAGA', email: '2024-0000029@bgfc.edu.ph', studentId: '2024-0000029', course: 'BEED', yearLevel: '2' },
    { name: 'CONSIGNA, KENLEE HARAH S.', email: '2023-0000135@bgfc.edu.ph', studentId: '2023-0000135', course: 'BEED', yearLevel: '3' },
    { name: 'CONSIGNA, KIA JANE MONDRAGON', email: '2023-0000102@bgfc.edu.ph', studentId: '2023-0000102', course: 'BSED - English', yearLevel: '3' },
    { name: 'CONSIGNA, KYLE PIEDAD', email: '2025-0000106@bgfc.edu.ph', studentId: '2025-0000106', course: 'BSBA', yearLevel: '1' },
    { name: 'CONSIGNA, LENETH A', email: '2024-0000128@bgfc.edu.ph', studentId: '2024-0000128', course: 'BEED', yearLevel: '2' },
    { name: 'CONSIGNA, MARCH IYA HUMAYLAB', email: '2024-0000062@bgfc.edu.ph', studentId: '2024-0000062', course: 'BEED', yearLevel: '2' },
    { name: 'CONSIGNA, MARY JOY', email: '2025-0000120@bgfc.edu.ph', studentId: '2025-0000120', course: 'BSIT', yearLevel: '1' },
    { name: 'CONSIGNA, RHAMS EJIE LLANO', email: '2022-0003985@bgfc.edu.ph', studentId: '2022-0003985', course: 'BSED - Math', yearLevel: '4' },
    { name: 'CONSIGNA, SHIANE JANE B.', email: '2023-0000119@bgfc.edu.ph', studentId: '2023-0000119', course: 'BEED', yearLevel: '3' },
    { name: 'CONSIGNA, SPAGETTI LUBAPIS', email: '2022-0003966@bgfc.edu.ph', studentId: '2022-0003966', course: 'BSBA', yearLevel: '4' },
    { name: 'CONSIGNA, STEPHANIE DOREN L', email: '2024-0000020@bgfc.edu.ph', studentId: '2024-0000020', course: 'BEED', yearLevel: '2' },
    { name: 'CONSIGNA, YASHING', email: '2024-0000032@bgfc.edu.ph', studentId: '2024-0000032', course: 'BEED', yearLevel: '2' },
    { name: 'CORAY, KEIRT JOHN D.', email: '2023-0000043@bgfc.edu.ph', studentId: '2023-0000043', course: 'BEED', yearLevel: '3' },
    { name: 'CORAY, TRESHA BETH D.', email: '2023-0000040@bgfc.edu.ph', studentId: '2023-0000040', course: 'BEED', yearLevel: '3' },
    { name: 'CORDITA, ANGELOU B.', email: '2021-0003801@bgfc.edu.ph', studentId: '2021-0003801', course: 'BSE', yearLevel: '4' },
    { name: 'CORDITA, CALVIN KLEIN U', email: '2022-0004195@bgfc.edu.ph', studentId: '2022-0004195', course: 'BSED - English', yearLevel: '4' },
    { name: 'CORDITA, CRISANTHONY JOAQUINO', email: '2025-0000116@bgfc.edu.ph', studentId: '2025-0000116', course: 'BSED - English', yearLevel: '1' },
    { name: 'CORDITA, MC GARVIE DIZON', email: '2025-0000025@bgfc.edu.ph', studentId: '2025-0000025', course: 'BSED - Math', yearLevel: '1' },
    { name: 'CORDITA, SHEENA J.', email: '2022-0004087@bgfc.edu.ph', studentId: '2022-0004087', course: 'BSBA', yearLevel: '3' },
    { name: 'CORNITES, ERLYN CORTINA', email: '2021-0003798@bgfc.edu.ph', studentId: '2021-0003798', course: 'BSBA', yearLevel: '4' },
    { name: 'CORO, ALDRIN BATISTIL', email: '2025-0000189@bgfc.edu.ph', studentId: '2025-0000189', course: 'BSE', yearLevel: '1' },
    { name: 'CRUIZ, LADY ANN LYNOR GULTIANO', email: '2025-0000089@bgfc.edu.ph', studentId: '2025-0000089', course: 'BEED', yearLevel: '1' },
    { name: 'CRUIZ, PRINCE CHARLES L.', email: '2022-0003996@bgfc.edu.ph', studentId: '2022-0003996', course: 'BSBA', yearLevel: '4' },
    { name: 'CUADERA, CRENGCRENG BATO', email: '2025-0000088@bgfc.edu.ph', studentId: '2025-0000088', course: 'BSE', yearLevel: '1' },
    { name: 'CUBILLAN, BEA ATHEA HUMAYLAB', email: '2025-0000058@bgfc.edu.ph', studentId: '2025-0000058', course: 'BEED', yearLevel: '1' },
    { name: 'CUBILLAN, HARVEY KHENJE RUDELA', email: '2024-0000074@bgfc.edu.ph', studentId: '2024-0000074', course: 'BSIT', yearLevel: '2' },
    { name: 'CUBILLAN, HENMARK CANTA', email: '2025-0000035@bgfc.edu.ph', studentId: '2025-0000035', course: 'BEED', yearLevel: '1' },
    { name: 'CUBILLAN, JANDORF A.', email: '2022-0004062@bgfc.edu.ph', studentId: '2022-0004062', course: 'BEED', yearLevel: '4' },
    { name: 'CUBILLAN, JEOFF CHRISTIAN ANGCOG', email: '2024-0000066@bgfc.edu.ph', studentId: '2024-0000066', course: 'BEED', yearLevel: '2' },
    { name: 'CUBILLAN, JYLE MARIE PIAO', email: '2024-0000015@bgfc.edu.ph', studentId: '2024-0000015', course: 'BSE', yearLevel: '2' },
    { name: 'CUBILLAN, LJ MAY PIAO', email: '2025-0000105@bgfc.edu.ph', studentId: '2025-0000105', course: 'BEED', yearLevel: '1' },
    { name: 'CULATA, DEVIN CART B.', email: '2018-0002578@bgfc.edu.ph', studentId: '2018-0002578', course: 'BSBA', yearLevel: '4' },
    { name: 'CULATA, GEN KENETH UBOS', email: '2024-0000076@bgfc.edu.ph', studentId: '2024-0000076', course: 'BEED', yearLevel: '2' },
    { name: 'CULATA, JAMAICA AINIE E.', email: '2022-0004178@bgfc.edu.ph', studentId: '2022-0004178', course: 'BSED - English', yearLevel: '4' },
    { name: 'CULATA, JAMES ADAM C.', email: '2022-0004179@bgfc.edu.ph', studentId: '2022-0004179', course: 'BSED - Math', yearLevel: '1' },
    { name: 'CULATA, JESTONIE MEDRANO', email: '2025-0000046@bgfc.edu.ph', studentId: '2025-0000046', course: 'BSBA', yearLevel: '1' },
    { name: 'CULATA, JHON FRANCE BESAS', email: '2025-0000179@bgfc.edu.ph', studentId: '2025-0000179', course: 'BSIT', yearLevel: '1' },
    { name: 'CULATA, NEW HERRA BEOZEL BESAS', email: '2022-0004151@bgfc.edu.ph', studentId: '2022-0004151', course: 'BSBA', yearLevel: '1' },
    { name: 'CURAY, JANEN GEDE', email: '2025-0000198@bgfc.edu.ph', studentId: '2025-0000198', course: 'BEED', yearLevel: '1' },
    { name: 'DAÑAS, QP S.', email: '2023-0000049@bgfc.edu.ph', studentId: '2023-0000049', course: 'BEED', yearLevel: '3' },
    { name: 'DACERA, CLENT CAPISTRANO', email: '2025-0000231@bgfc.edu.ph', studentId: '2025-0000231', course: 'BSIT', yearLevel: '2' },
    { name: 'DACERA, KENT ARJHON D.', email: '2022-0004215@bgfc.edu.ph', studentId: '2022-0004215', course: 'BEED', yearLevel: '3' },
    { name: 'DACERA, MARK KEVIN ARCULAR', email: '2022-0004027@bgfc.edu.ph', studentId: '2022-0004027', course: 'BSCRIM', yearLevel: '4' },
    { name: 'DACERA, PRINCE EFRAIM JUALO', email: '2025-0000148@bgfc.edu.ph', studentId: '2025-0000148', course: 'BSCRIM', yearLevel: '1' },
    { name: 'DACERA, SHAMEL CONSIGNA', email: '2024-0000098@bgfc.edu.ph', studentId: '2024-0000098', course: 'BSED - English', yearLevel: '2' },
    { name: 'DACERA, SHANARAIA PLAZA', email: '2024-0000096@bgfc.edu.ph', studentId: '2024-0000096', course: 'BEED', yearLevel: '2' },
    { name: 'DALANGIN, DE MARIE ARCULAR', email: '2024-0000021@bgfc.edu.ph', studentId: '2024-0000021', course: 'BEED', yearLevel: '2' },
    { name: 'DANO, ARIXON BARONDAY', email: '2025-0000044@bgfc.edu.ph', studentId: '2025-0000044', course: 'BEED', yearLevel: '1' },
    { name: 'DANO, CHAREIS D.', email: '2022-0004044@bgfc.edu.ph', studentId: '2022-0004044', course: 'BSBA', yearLevel: '4' },
    { name: 'DANO, JAMAICA QUISADA', email: '2024-0000004@bgfc.edu.ph', studentId: '2024-0000004', course: 'BEED', yearLevel: '3' },
    { name: 'DANO, JERICO C', email: '2023-0000030@bgfc.edu.ph', studentId: '2023-0000030', course: 'BEED', yearLevel: '3' },
    { name: 'DANO, SHAMEL D.', email: '2023-0000112@bgfc.edu.ph', studentId: '2023-0000112', course: 'BSED - English', yearLevel: '3' },
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

  console.log('🎉 Batch 2 database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })