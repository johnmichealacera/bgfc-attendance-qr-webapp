import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can import students
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    // }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    }

    console.log('file', file)

    // Check if it's a PDF file
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 })
    }

    // For now, we'll return sample data that matches the expected format
    // This allows testing of the UI while we resolve PDF parsing issues
    console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`)

    try {
      // Try to parse PDF if possible, otherwise use sample data
      const students = await processPdfFile(file)
      
      return NextResponse.json({ 
        success: true, 
        students,
        totalExtracted: students.length,
        message: students.length > 5 ? 'PDF processed successfully' : 'PDF processing unavailable, showing sample data for testing'
      })

    } catch (pdfError) {
      console.error('PDF processing error:', pdfError)
      
      // Fallback to sample data
      const sampleStudents = generateSampleStudents()
      return NextResponse.json({ 
        success: true, 
        students: sampleStudents,
        totalExtracted: sampleStudents.length,
        message: 'PDF processing temporarily unavailable, showing sample data for testing'
      })
    }

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { message: 'Error processing PDF file. Please try again.' },
      { status: 500 }
    )
  }
}

async function processPdfFile(file: File) {
  let pdfParse: any = null
  
  try {
    // Try to dynamically import pdf-parse
    pdfParse = (await import('pdf-parse')).default
  } catch (importError) {
    console.log('PDF parsing library not available, using sample data')
    return generateSampleStudents()
  }

  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Parse PDF content
    const pdfData = await pdfParse(buffer)
    const text = pdfData.text

    console.log('PDF text extracted (first 200 chars):', text.substring(0, 200))

    // Extract student information using regex patterns
    const students = extractStudentsFromText(text)

    if (students.length === 0) {
      console.log('No students found in PDF text, using sample data')
      return generateSampleStudents()
    }

    console.log(`Successfully extracted ${students.length} students from PDF`)
    return students

  } catch (parseError) {
    console.error('PDF parsing failed:', parseError)
    return generateSampleStudents()
  }
}

function extractStudentsFromText(text: string) {
  const students: any[] = []
  
  // Split text into lines and clean them
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  console.log(`Processing ${lines.length} lines from PDF`)

  // Multiple regex patterns to handle different formats
  const patterns = [
    // Pattern 1: 2025-0000206 , BSCRIM 1
    /(\d{4}-\d{7})\s*,?\s*([A-Z\s\-]+)\s+(\d+)/i,
    
    // Pattern 2: 2022-0004018 ABAO, KRISHA MAE M. BSCRIM 4
    /(\d{4}-\d{7})\s+([A-Z\s\-,\.]+),\s*([A-Z\s\-]+)\s+(\d+)/i,
    
    // Pattern 3: Number. ID NAME COURSE YEAR
    /\d+\.\s*(\d{4}-\d{7})\s+([A-Z\s\-,\.]+)\s+([A-Z\s\-]+)\s+(\d+)/i,
    
    // Pattern 4: Simple format without numbering
    /(\d{4}-\d{7})\s+([A-Z\s\-,\.]*)\s*([A-Z]{2,}(?:\s*-\s*[A-Z]+)*)\s+(\d+)/i
  ]
  
  for (const line of lines) {
    // Skip empty lines or lines that are too short
    if (line.length < 10) continue
    
    let matched = false
    
    // Try each pattern
    for (let i = 0; i < patterns.length && !matched; i++) {
      const pattern = patterns[i]
      const match = line.match(pattern)
      
      if (match) {
        matched = true
        let studentId, name, course, yearLevel
        
        if (i === 0) {
          // Pattern 1: ID, COURSE YEAR
          [, studentId, course, yearLevel] = match
          name = ''
        } else if (i === 1 || i === 2) {
          // Pattern 2 & 3: ID NAME, COURSE YEAR
          [, studentId, name, course, yearLevel] = match
        } else {
          // Pattern 4: ID NAME COURSE YEAR
          [, studentId, name, course, yearLevel] = match
        }
        
        // Clean up the data
        const cleanStudentId = studentId.trim()
        const cleanName = name ? name.trim().replace(/,$/, '') : ''
        const cleanCourse = course.trim()
        
        // Map year level to proper format
        const yearMapping: { [key: string]: string } = {
          '1': '1st Year',
          '2': '2nd Year', 
          '3': '3rd Year',
          '4': '4th Year',
          '5': '5th Year',
          '6': '6th Year'
        }
        
        const formattedYear = yearMapping[yearLevel] || `${yearLevel}${getOrdinalSuffix(parseInt(yearLevel))} Year`
        
        students.push({
          studentId: cleanStudentId,
          name: cleanName || undefined,
          course: cleanCourse,
          yearLevel: formattedYear,
          rawLine: line.trim()
        })

        console.log(`Extracted student: ${cleanStudentId} - ${cleanName} - ${cleanCourse} - ${formattedYear}`)
      }
    }
  }
  
  console.log(`Total students extracted: ${students.length}`)
  return students
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j == 1 && k != 11) return "st"
  if (j == 2 && k != 12) return "nd"
  if (j == 3 && k != 13) return "rd"
  return "th"
}

function generateSampleStudents() {
  return [
    // {
    //   studentId: '2025-0000206',
    //   course: 'BSCRIM',
    //   yearLevel: '1st Year',
    //   rawLine: '1. 2025-0000206 , BSCRIM 1'
    // },
    // {
    //   studentId: '2022-0004018',
    //   name: 'ABAO, KRISHA MAE M.',
    //   course: 'BSCRIM',
    //   yearLevel: '4th Year',
    //   rawLine: '2. 2022-0004018 ABAO, KRISHA MAE M. BSCRIM 4'
    // },
    // {
    //   studentId: '2022-0004118',
    //   name: 'ABAO, LEAMIE R',
    //   course: 'BSED - English',
    //   yearLevel: '4th Year',
    //   rawLine: '3. 2022-0004118 ABAO, LEAMIE R BSED - English 4'
    // },
    // {
    //   studentId: '2023-0001001',
    //   name: 'DELA CRUZ, JUAN P.',
    //   course: 'BSIT',
    //   yearLevel: '2nd Year',
    //   rawLine: '4. 2023-0001001 DELA CRUZ, JUAN P. BSIT 2'
    // },
    // {
    //   studentId: '2021-0002005',
    //   name: 'SANTOS, MARIA C.',
    //   course: 'BSBA',
    //   yearLevel: '3rd Year',
    //   rawLine: '5. 2021-0002005 SANTOS, MARIA C. BSBA 3'
    // },
    // {
    //   studentId: '2020-0003010',
    //   name: 'REYES, CARLOS M.',
    //   course: 'BSED - Math',
    //   yearLevel: '4th Year',
    //   rawLine: '6. 2020-0003010 REYES, CARLOS M. BSED - Math 4'
    // }
  ]
}