import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting batch 6 (final batch) database seed...')

  // Create student users and records - Batch 6 (Students 552-677)
  const studentPasswordHash = await bcrypt.hash('student123', 12)
  
  const students = [
    { name: 'QUESTERIA, SHA-MAY D', email: '2023-0000169@bgfc.edu.ph', studentId: '2023-0000169', course: 'BEED' },
    { name: 'QUIBAN, GLOMART P.', email: '2023-0000032@bgfc.edu.ph', studentId: '2023-0000032', course: 'BEED' },
    { name: 'QUIBAN, JUSREY TELIN', email: '2023-0000142@bgfc.edu.ph', studentId: '2023-0000142', course: 'BEED' },
    { name: 'QUIBAN, SHENKIA ZAIRA ABAO', email: '2025-0000139@bgfc.edu.ph', studentId: '2025-0000139', course: 'BEED' },
    { name: 'QUILARIO, CYRIL JHON L.', email: '2025-0000222@bgfc.edu.ph', studentId: '2025-0000222', course: 'BSCRIM' },
    { name: 'QUILARIO, GEMALYN ALONG', email: '2024-0000118@bgfc.edu.ph', studentId: '2024-0000118', course: 'BEED' },
    { name: 'QUILARIO, GENALYN A.', email: '2024-0000008@bgfc.edu.ph', studentId: '2024-0000008', course: 'BEED' },
    { name: 'QUILARIO, MARK KENJIE ANGCOG', email: '2024-0000051@bgfc.edu.ph', studentId: '2024-0000051', course: 'BEED' },
    { name: 'QUIRIDO, HORACE MIGUEL DACERA', email: '2025-0000228@bgfc.edu.ph', studentId: '2025-0000228', course: 'BSCRIM' },
    { name: 'QUISADA, HONEYLET', email: '2024-0000055@bgfc.edu.ph', studentId: '2024-0000055', course: 'BEED' },
    { name: 'QUISADA, MICHAELLA QUILARIO', email: '2024-0000034@bgfc.edu.ph', studentId: '2024-0000034', course: 'BEED' },
    { name: 'QUISADA, RHAMCES C', email: '2022-0004091@bgfc.edu.ph', studentId: '2022-0004091', course: 'BSBA' },
    { name: 'QUISADA, VENCE JAREL Q.', email: '2022-0004042@bgfc.edu.ph', studentId: '2022-0004042', course: 'BSBA' },
    { name: 'QUISAGAN, CYRON G.', email: '2023-0000023@bgfc.edu.ph', studentId: '2023-0000023', course: 'BEED' },
    { name: 'QUISAGAN, JUNYX P.', email: '2022-0004024@bgfc.edu.ph', studentId: '2022-0004024', course: 'BSBA' },
    { name: 'QUISAGAN, KERBY ADLAO', email: '2025-0000158@bgfc.edu.ph', studentId: '2025-0000158', course: 'BEED' },
    { name: 'QUISAGAN, KIAN JHON C.', email: '2021-0003539@bgfc.edu.ph', studentId: '2021-0003539', course: 'BSBA' },
    { name: 'QUISAGAN, KITCHIE ADLAO', email: '2025-0000173@bgfc.edu.ph', studentId: '2025-0000173', course: 'BEED' },
    { name: 'QUISAGAN, MARJHON C', email: '2022-0004029@bgfc.edu.ph', studentId: '2022-0004029', course: 'BSBA' },
    { name: 'RAMIREZ, CHARLES STEVE JR DELA PEÑA', email: '2024-0000063@bgfc.edu.ph', studentId: '2024-0000063', course: 'BEED' },
    { name: 'RAMIREZ, JEVPOBIE DACERA', email: '2024-0000109@bgfc.edu.ph', studentId: '2024-0000109', course: 'BEED' },
    { name: 'RAMIREZ, KIMBER NOVY BUYSER', email: '2025-0000091@bgfc.edu.ph', studentId: '2025-0000091', course: 'BEED' },
    { name: 'RAMIREZ, LARA JEAN CAWALING', email: '2021-0003639@bgfc.edu.ph', studentId: '2021-0003639', course: 'BEED' },
    { name: 'RAMIREZ, LIZA MAE S', email: '2023-0000101@bgfc.edu.ph', studentId: '2023-0000101', course: 'BEED' },
    { name: 'RAMIREZ, MALYN OCON', email: '2025-0000081@bgfc.edu.ph', studentId: '2025-0000081', course: 'BEED' },
    { name: 'RAMIREZ, RONETTE PORTILLO', email: '2025-0000032@bgfc.edu.ph', studentId: '2025-0000032', course: 'BEED' },
    { name: 'RAMIREZ, RYAN KENTH C.', email: '2025-0000210@bgfc.edu.ph', studentId: '2025-0000210', course: 'BEED' },
    { name: 'RAMIREZ JR., CHARLITO C.', email: '2022-0004160@bgfc.edu.ph', studentId: '2022-0004160', course: 'BSBA' },
    { name: 'RAVELO, SHEENA JANEL POLAN', email: '2024-0000083@bgfc.edu.ph', studentId: '2024-0000083', course: 'BEED' },
    { name: 'RIVAS, AQUERA RODILA', email: '2025-0000002@bgfc.edu.ph', studentId: '2025-0000002', course: 'BEED' },
    { name: 'RIVAS, JOVELYN SUTANA', email: '2022-0003951@bgfc.edu.ph', studentId: '2022-0003951', course: 'BEED' },
    { name: 'RIVAS, JOYLYN CRELIGO', email: '2024-0000035@bgfc.edu.ph', studentId: '2024-0000035', course: 'BEED' },
    { name: 'RIVAS, UREKA THISSA C.', email: '2023-0000139@bgfc.edu.ph', studentId: '2023-0000139', course: 'BEED' },
    { name: 'ROCOLCOL, MARVIN JR. FLORES', email: '2025-0000012@bgfc.edu.ph', studentId: '2025-0000012', course: 'BEED' },
    { name: 'ROLLORATA, VJ DESPOY', email: '2025-0000065@bgfc.edu.ph', studentId: '2025-0000065', course: 'BEED' },
    { name: 'ROSILLO, AIRA GEMPARO', email: '2023-0000129@bgfc.edu.ph', studentId: '2023-0000129', course: 'BEED' },
    { name: 'ROSILLO, ARNOLD C.', email: '2023-0000138@bgfc.edu.ph', studentId: '2023-0000138', course: 'BSBA' },
    { name: 'ROSILLO, AYESSAH B.', email: '2023-0000065@bgfc.edu.ph', studentId: '2023-0000065', course: 'BEED' },
    { name: 'ROSILLO, ELLA ALABAT', email: '2024-0000068@bgfc.edu.ph', studentId: '2024-0000068', course: 'BEED' },
    { name: 'ROSILLO, KIMLY H', email: '2023-0000067@bgfc.edu.ph', studentId: '2023-0000067', course: 'BEED' },
    { name: 'ROSILLO, MAE JEIANA QUISAGAN', email: '2025-0000191@bgfc.edu.ph', studentId: '2025-0000191', course: 'BEED' },
    { name: 'ROSILLO, NEZZARYN IGLORIA', email: '2025-0000114@bgfc.edu.ph', studentId: '2025-0000114', course: 'BEED' },
    { name: 'RUAYA, JANET MATURAN', email: '2025-0000162@bgfc.edu.ph', studentId: '2025-0000162', course: 'BEED' },
    { name: 'RUAYA, JAYFOL', email: '2022-0004057@bgfc.edu.ph', studentId: '2022-0004057', course: 'BSBA' },
    { name: 'RUAYA, JUSTIN MATURAN', email: '2025-0000090@bgfc.edu.ph', studentId: '2025-0000090', course: 'BEED' },
    { name: 'RUDELA, BRAILE SMITH J', email: '2025-0000217@bgfc.edu.ph', studentId: '2025-0000217', course: 'BEED' },
    { name: 'RUDELA, CHRISTIAN ROSILLO', email: '2025-0000165@bgfc.edu.ph', studentId: '2025-0000165', course: 'BEED' },
    { name: 'RUDELA, JUANA MARIE E.', email: '2023-0000076@bgfc.edu.ph', studentId: '2023-0000076', course: 'BEED' },
    { name: 'RUDELA, KENNETH YAMSON', email: '2025-0000218@bgfc.edu.ph', studentId: '2025-0000218', course: 'BEED' },
    { name: 'RUDELA, PHEVIE M', email: '2022-0004098@bgfc.edu.ph', studentId: '2022-0004098', course: 'BSBA' },
    { name: 'RUDELA, REN MARK JOAQUINO', email: '2025-0000101@bgfc.edu.ph', studentId: '2025-0000101', course: 'BEED' },
    { name: 'RUDELA, SHARMAINE YAMSON', email: '2024-0000089@bgfc.edu.ph', studentId: '2024-0000089', course: 'BEED' },
    { name: 'RUDELA, VINCE JOSEPH G.', email: '2022-0003946@bgfc.edu.ph', studentId: '2022-0003946', course: 'BSBA' },
    { name: 'SABALO, GROWIE A.', email: '2023-0000117@bgfc.edu.ph', studentId: '2023-0000117', course: 'BEED' },
    { name: 'SAGA, QUEEN MARYLOU', email: '2025-0000033@bgfc.edu.ph', studentId: '2025-0000033', course: 'BEED' },
    { name: 'SALOMA, LORDY ESPUERTA', email: '2024-0000026@bgfc.edu.ph', studentId: '2024-0000026', course: 'BEED' },
    { name: 'SANICO, JOPEE B.', email: '2023-0000047@bgfc.edu.ph', studentId: '2023-0000047', course: 'BEED' },
    { name: 'SANICO, KISSHA DANNA BISAYA', email: '2025-0000111@bgfc.edu.ph', studentId: '2025-0000111', course: 'BEED' },
    { name: 'SANICO, KJ BARUNDAY', email: '2024-0000033@bgfc.edu.ph', studentId: '2024-0000033', course: 'BEED' },
    { name: 'SANICO, NOPE BARUNDAY', email: '2025-0000076@bgfc.edu.ph', studentId: '2025-0000076', course: 'BEED' },
    { name: 'SANTUYA, CRECIAVEL QUIRIDO', email: '2020-0003209@bgfc.edu.ph', studentId: '2020-0003209', course: 'BEED' },
    { name: 'SAPURAS, JENNYLYN G.', email: '2023-0000018@bgfc.edu.ph', studentId: '2023-0000018', course: 'BEED' },
    { name: 'SARMEN, EDNALYN YAMSON', email: '2022-0004070@bgfc.edu.ph', studentId: '2022-0004070', course: 'BEED' },
    { name: 'SARNO, AIMEA MEDRANO', email: '2023-0000002@bgfc.edu.ph', studentId: '2023-0000002', course: 'BEED' },
    { name: 'SARNO, KRISTEL P.', email: '2022-0004078@bgfc.edu.ph', studentId: '2022-0004078', course: 'BSBA' },
    { name: 'SARNO, MANILYN LAUGO', email: '2023-0000034@bgfc.edu.ph', studentId: '2023-0000034', course: 'BEED' },
    { name: 'SARONG, CLARISH JUALO', email: '2025-0000084@bgfc.edu.ph', studentId: '2025-0000084', course: 'BEED' },
    { name: 'SARONG, LAARNIE APORBO', email: '2017-0003484@bgfc.edu.ph', studentId: '2017-0003484', course: 'BEED' },
    { name: 'SARONG, NICA LOREN T.', email: '2022-0004154@bgfc.edu.ph', studentId: '2022-0004154', course: 'BEED' },
    { name: 'SAVANDAL, IAN MYRA VIRTUDAZO', email: '2025-0000214@bgfc.edu.ph', studentId: '2025-0000214', course: 'BEED' },
    { name: 'SAVANDAL, MACKY CONSIGNA', email: '2024-0000011@bgfc.edu.ph', studentId: '2024-0000011', course: 'BEED' },
    { name: 'SAVANDAL, NIKKA FLOR R', email: '2022-0003978@bgfc.edu.ph', studentId: '2022-0003978', course: 'BEED' },
    { name: 'SEVILLA, RHEA S', email: '2022-0004146@bgfc.edu.ph', studentId: '2022-0004146', course: 'BEED' },
    { name: 'SINOC, JAMES BONE', email: '2022-0004175@bgfc.edu.ph', studentId: '2022-0004175', course: 'BSBA' },
    { name: 'SKAJ, ZIANTAN SAVANDAL', email: '2025-0000043@bgfc.edu.ph', studentId: '2025-0000043', course: 'BEED' },
    { name: 'SUTANA, C-JAY J.', email: '2023-0000227@bgfc.edu.ph', studentId: '2023-0000227', course: 'BSBA' },
    { name: 'SUTANA, GRACIANN-MAE T.', email: '2022-0003932@bgfc.edu.ph', studentId: '2022-0003932', course: 'BEED' },
    { name: 'TAMAYO, ALEA MIKA TARO', email: '2025-0000004@bgfc.edu.ph', studentId: '2025-0000004', course: 'BEED' },
    { name: 'TAMAYO, BERANO JR. ALONG', email: '2025-0000234@bgfc.edu.ph', studentId: '2025-0000234', course: 'BSCRIM' },
    { name: 'TAMAYO, JHON MICHAEL BESAS', email: '2025-0000159@bgfc.edu.ph', studentId: '2025-0000159', course: 'BEED' },
    { name: 'TAMAYO, MARJORY CANTA', email: '2024-0000097@bgfc.edu.ph', studentId: '2024-0000097', course: 'BEED' },
    { name: 'TAMAYO, NIKKI P', email: '2014-2278@bgfc.edu.ph', studentId: '2014-2278', course: 'BEED' },
    { name: 'TAMAYO, RIAN CHATTO', email: '2025-0000134@bgfc.edu.ph', studentId: '2025-0000134', course: 'BEED' },
    { name: 'TAMAYO, SHARIE PUEBLOS', email: '2025-0000154@bgfc.edu.ph', studentId: '2025-0000154', course: 'BEED' },
    { name: 'TAMAYO, TRECIA SABALO', email: '2025-0000221@bgfc.edu.ph', studentId: '2025-0000221', course: 'BEED' },
    { name: 'TARO, ASHLEY ANTIGRO', email: '2025-0000103@bgfc.edu.ph', studentId: '2025-0000103', course: 'BEED' },
    { name: 'TARO, BUBBIES SANICO', email: '2025-0000059@bgfc.edu.ph', studentId: '2025-0000059', course: 'BEED' },
    { name: 'TARO, CHRISTINE MARIE S.', email: '2022-0004148@bgfc.edu.ph', studentId: '2022-0004148', course: 'BEED' },
    { name: 'TARO, HAZZEL MEDRANO', email: '2023-0000098@bgfc.edu.ph', studentId: '2023-0000098', course: 'BEED' },
    { name: 'TARO, MARK JHONRIC M.', email: '2023-0000096@bgfc.edu.ph', studentId: '2023-0000096', course: 'BEED' },
    { name: 'TARO, SHANYEN ALEYAH PALEN', email: '2024-0000070@bgfc.edu.ph', studentId: '2024-0000070', course: 'BEED' },
    { name: 'TARTAR, BEA LAVENIA QUIBAN', email: '2025-0000163@bgfc.edu.ph', studentId: '2025-0000163', course: 'BEED' },
    { name: 'TARTAR, DEAN BRYLE Q.', email: '2022-0004133@bgfc.edu.ph', studentId: '2022-0004133', course: 'BEED' },
    { name: 'TARTAR, JOHN MICHEAL Q.', email: '2023-0000225@bgfc.edu.ph', studentId: '2023-0000225', course: 'BEED' },
    { name: 'TARTAR, KENT ZIMRI QUIBAN', email: '2025-0000155@bgfc.edu.ph', studentId: '2025-0000155', course: 'BEED' },
    { name: 'TARTAR, RHICKEA SHANE BUNTAD', email: '2025-0000021@bgfc.edu.ph', studentId: '2025-0000021', course: 'BEED' },
    { name: 'TARTAR, SHAN AEROMMEL RAMIREZ', email: '2025-0000007@bgfc.edu.ph', studentId: '2025-0000007', course: 'BEED' },
    { name: 'TARTAR, TOOTCHE A.', email: '2022-0003926@bgfc.edu.ph', studentId: '2022-0003926', course: 'BEED' },
    { name: 'TARUC, GWYNETH KHELA LOZADA', email: '2025-0000085@bgfc.edu.ph', studentId: '2025-0000085', course: 'BEED' },
    { name: 'TELIN, APPLE JUNE P.', email: '2023-0000228@bgfc.edu.ph', studentId: '2023-0000228', course: 'BEED' },
    { name: 'TELIN, CYRIL T', email: '2022-0003961@bgfc.edu.ph', studentId: '2022-0003961', course: 'BEED' },
    { name: 'TESADO, AILA H.', email: '2024-0000019@bgfc.edu.ph', studentId: '2024-0000019', course: 'BEED' },
    { name: 'TESADO, EZEL V.', email: '2022-0003930@bgfc.edu.ph', studentId: '2022-0003930', course: 'BEED' },
    { name: 'TESADO, KERVIE VERTICAL', email: '2025-0000183@bgfc.edu.ph', studentId: '2025-0000183', course: 'BEED' },
    { name: 'TESADO, MARIAN GALO', email: '2025-0000051@bgfc.edu.ph', studentId: '2025-0000051', course: 'BEED' },
    { name: 'TESADO, RULD CORT B', email: '2023-0000060@bgfc.edu.ph', studentId: '2023-0000060', course: 'BEED' },
    { name: 'TIGUISTIGUIS, JEPZER Q', email: '2023-0000028@bgfc.edu.ph', studentId: '2023-0000028', course: 'BEED' },
    { name: 'TINAMBACAN, CIEGH LAUGO', email: '2025-0000048@bgfc.edu.ph', studentId: '2025-0000048', course: 'BEED' },
    { name: 'TINAMBACAN, HARRY JABAY', email: '2024-0000075@bgfc.edu.ph', studentId: '2024-0000075', course: 'BEED' },
    { name: 'TINAMBACAN, JAIRA SANICO', email: '2025-0000077@bgfc.edu.ph', studentId: '2025-0000077', course: 'BEED' },
    { name: 'TIO, JHON-ARLOU D.', email: '2022-0003938@bgfc.edu.ph', studentId: '2022-0003938', course: 'BEED' },
    { name: 'TUSCANO, JADE RYLE SARNO', email: '2025-0000031@bgfc.edu.ph', studentId: '2025-0000031', course: 'BEED' },
    { name: 'VERANO, MAGELLAN J', email: '2014-0455@bgfc.edu.ph', studentId: '2014-0455', course: 'BEED' },
    { name: 'VERANO, VERONICA JUANITE', email: '2024-0000016@bgfc.edu.ph', studentId: '2024-0000016', course: 'BEED' },
    { name: 'VERTICAL, ALTHEA MEE DELIMAN', email: '2024-0000095@bgfc.edu.ph', studentId: '2024-0000095', course: 'BEED' },
    { name: 'VERTICAL, CARLRICK Q', email: '2025-0000038@bgfc.edu.ph', studentId: '2025-0000038', course: 'BEED' },
    { name: 'VERTICAL, VINCE DEVAN DELIMAN', email: '2025-0000201@bgfc.edu.ph', studentId: '2025-0000201', course: 'BEED' },
    { name: 'VERTUDAZO, BENJIE', email: '2018-0002392@bgfc.edu.ph', studentId: '2018-0002392', course: 'BEED' },
    { name: 'VILLAS, GELY C.', email: '2022-0004000@bgfc.edu.ph', studentId: '2022-0004000', course: 'BEED' },
    { name: 'VIRTUDAZO, JANNA GROMACON', email: '2023-0000051@bgfc.edu.ph', studentId: '2023-0000051', course: 'BEED' },
    { name: 'VIRTUDAZO, JINGGO Q.', email: '2022-0004159@bgfc.edu.ph', studentId: '2022-0004159', course: 'BEED' },
    { name: 'VIRTUDAZO, SAM G', email: '2024-0000125@bgfc.edu.ph', studentId: '2024-0000125', course: 'BEED' },
    { name: 'YAMSON, HARVY DACERA', email: '2024-0000077@bgfc.edu.ph', studentId: '2024-0000077', course: 'BEED' },
    { name: 'YAMSON, ROBERT JULES S.', email: '2023-0000121@bgfc.edu.ph', studentId: '2023-0000121', course: 'BEED' },
    { name: 'YAMSON, SHAWN', email: '2025-0000112@bgfc.edu.ph', studentId: '2025-0000112', course: 'BEED' },
    { name: 'YBAÑEZ, JOERA J', email: '2022-0004226@bgfc.edu.ph', studentId: '2022-0004226', course: 'BEED' },
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

  console.log('🎉 Batch 6 (final batch) database seeding completed successfully!')
  console.log('🎊 All students have been seeded to the database!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })