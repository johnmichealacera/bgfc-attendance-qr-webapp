'use client'

import { useState } from 'react'
import { QrCode, Copy, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function TestQRPage() {
  const [selectedStudentId, setSelectedStudentId] = useState('2025-0000206')
  const [customId, setCustomId] = useState('')
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  // Sample student IDs for testing based on the provided format
  const sampleStudentIds = [
    '2025-0000206',
    '2022-0004018',
    '2022-0004118',
    '2023-0000057',
    '2022-0003945',
    '2024-0000012',
    '2022-0004045',
    '2024-0000119',
    '2025-0000235',
    '2023-0000152',
    '2025-0000078',
    '2022-0004004'
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToClipboard(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedToClipboard(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const generateCustomId = () => {
    if (customId.trim()) {
      const sanitized = customId.trim()
      if (!/^\d{4}-\d{7}$/.test(sanitized)) {
        toast.error('Invalid format. Use YYYY-NNNNNNN format (e.g., 2025-0000206)')
        return
      }
      setSelectedStudentId(sanitized)
      setCustomId('')
      toast.success('Custom ID generated!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Code Test Generator</h1>
                <p className="text-sm text-gray-600">Generate test QR codes for scanning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/qr-scanner"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Try Scanner →
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              QR Code Test Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate test QR codes to validate the scanner functionality. Use these QR codes with the manual input or display them on screen for camera scanning.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generator Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generate Test QR Code
              </h3>

              {/* Sample Student IDs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a Sample Student ID
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sampleStudentIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedStudentId(id)}
                      className={`px-3 py-2 text-sm font-mono rounded-md border transition-colors ${
                        selectedStudentId === id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom ID Input */}
              <div className="mb-6">
                <label htmlFor="customId" className="block text-sm font-medium text-gray-700 mb-2">
                  Or Create Custom Student ID
                </label>
                <div className="flex gap-2">
                  <input
                    id="customId"
                    type="text"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    placeholder="2025-0000206"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                    maxLength={12}
                  />
                  <button
                    onClick={generateCustomId}
                    disabled={!customId.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                  >
                    Use
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 4-digit year, hyphen, 7-digit number (e.g., 2025-0000206)
                </p>
              </div>

              {/* Current Selected ID */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Currently Selected:</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-blue-800">
                    {selectedStudentId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedStudentId)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                  >
                    {copiedToClipboard ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Test the Scanner
                </h3>
                <ol className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">1</span>
                    <span><strong>Copy the QR code</strong> using the copy button above</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">2</span>
                    <span><strong>Go to the QR Scanner</strong> using the link in the header</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">3</span>
                    <span><strong>Paste the code</strong> in the manual input field and press Enter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center justify-center mr-3 mt-0.5">4</span>
                    <span><strong>Verify the validation</strong> works correctly</span>
                  </li>
                </ol>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> These are test codes only. The scanner will validate the format but the student records may not exist in the database.
                  </p>
                </div>
              </div>

              {/* Format Validation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  QR Code Format
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Valid: <code className="bg-gray-100 px-1 rounded">2025-0000206</code></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Valid: <code className="bg-gray-100 px-1 rounded">2022-0004018</code></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Valid: <code className="bg-gray-100 px-1 rounded">2024-0000012</code></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-0.5 bg-red-600"></span>
                    </div>
                    <span className="text-gray-700">Invalid: <code className="bg-gray-100 px-1 rounded">2025-123</code> (ID too short)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-0.5 bg-red-600"></span>
                    </div>
                    <span className="text-gray-700">Invalid: <code className="bg-gray-100 px-1 rounded">20250000206</code> (missing hyphen)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="w-2 h-0.5 bg-red-600"></span>
                    </div>
                    <span className="text-gray-700">Invalid: <code className="bg-gray-100 px-1 rounded">2019-0000206</code> (year too old)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Test Links */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <span className="text-gray-700 font-medium">Quick Actions:</span>
              <Link
                href="/qr-scanner"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Test Public Scanner
              </Link>
              <Link
                href="/dashboard/qr-scanner"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
              >
                Test Dashboard Scanner
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
