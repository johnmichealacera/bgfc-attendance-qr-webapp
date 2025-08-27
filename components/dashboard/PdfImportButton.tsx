'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Users, X, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ExtractedStudent {
  studentId: string
  course?: string
  yearLevel?: string
  name?: string
  rawLine: string
}

interface PdfImportButtonProps {
  onImportSuccess?: (students: ExtractedStudent[]) => void
}

export default function PdfImportButton({ onImportSuccess }: PdfImportButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [extractedStudents, setExtractedStudents] = useState<ExtractedStudent[]>([])
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/import-students', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setExtractedStudents(data.students)
        setShowResults(true)
        toast.success(`Successfully extracted ${data.totalExtracted} students from PDF`)
        
        if (onImportSuccess) {
          onImportSuccess(data.students)
        }
      } else {
        toast.error(data.message || 'Failed to process PDF')
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast.error('Error processing PDF file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const closeResults = () => {
    setShowResults(false)
    setExtractedStudents([])
  }

  const downloadExtractedData = () => {
    if (extractedStudents.length === 0) return

    const csvContent = [
      ['Student ID', 'Name', 'Course', 'Year Level', 'Raw Line'],
      ...extractedStudents.map(student => [
        student.studentId,
        student.name || '',
        student.course || '',
        student.yearLevel || '',
        student.rawLine
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted-students-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Extracted data downloaded as CSV')
  }

  return (
    <>
      <button
        onClick={handleFileSelect}
        disabled={isUploading}
        className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-md transition-colors duration-200"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Import PDF
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  PDF Import Results
                </h3>
                <span className="px-2 py-1 bg-success-100 text-success-800 text-sm font-medium rounded-full">
                  {extractedStudents.length} students extracted
                </span>
              </div>
              <button
                onClick={closeResults}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {extractedStudents.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Review the extracted student information below:
                    </p>
                    <button
                      onClick={downloadExtractedData}
                      className="inline-flex items-center px-3 py-2 bg-success-600 hover:bg-success-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-3">
                      <div>Student ID</div>
                      <div>Name</div>
                      <div>Course</div>
                      <div>Year Level</div>
                    </div>
                    
                    {extractedStudents.map((student, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-gray-200 last:border-b-0">
                        <div className="font-mono text-sm">{student.studentId}</div>
                        <div className="text-sm">{student.name || 'N/A'}</div>
                        <div className="text-sm">{student.course || 'N/A'}</div>
                        <div className="text-sm">{student.yearLevel || 'N/A'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">PDF processed successfully!</p>
                        <p className="mt-1">
                          The extracted data can be downloaded as CSV or used for further processing.
                          You may need to manually review and clean the data before importing into your system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No new student data could be extracted from the PDF.</p>
                  {/* <p className="text-sm text-gray-500 mt-2">
                    Please ensure the PDF contains student information in the expected format.
                  </p> */}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeResults}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
