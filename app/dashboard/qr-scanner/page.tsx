'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { QrCode, Camera, CheckCircle, XCircle, MapPin, Download, RefreshCw, Sun, Moon, LogIn, LogOut, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import QRScanner from '@/components/qr/QRScanner'
import Navigation from '@/components/layout/Navigation'

interface ScanResult {
  success: boolean
  message: string
  studentId?: string
  studentName?: string
  timestamp?: string
  gateLocation?: string
  sessionType?: string
  notes?: string
}

export default function QRScannerPage() {
  const { data: session, status } = useSession()
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [gateLocation, setGateLocation] = useState('Main Gate');
  const [sessionType, setSessionType] = useState('MORNING_IN');
  const [isLoading, setIsLoading] = useState(false)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to access this page.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const handleScan = async (data: string) => {
    try {
      // Parse the enhanced data from QRScanner
      const scanData = JSON.parse(data)
      const { studentId, sessionType, gateLocation: scanGateLocation, notes } = scanData
      
      setIsLoading(true)
      
      // Map the data to match the API expectations
      const response = await fetch('/api/attendance/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode: studentId,           // This maps to qrCode in the API
          gateLocation: scanGateLocation || gateLocation,
          sessionType: sessionType,    // Make sure this is passed through
          notes: notes                 // Make sure this is passed through
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const successResult: ScanResult = {
          success: true,
          message: 'Attendance logged successfully!',
          studentId: result.studentId,
          studentName: result.studentName,
          timestamp: result.timestamp,
          gateLocation: result.gateLocation,
          sessionType: result.sessionType,
          notes: result.notes
        }
        
        setScanResult(successResult)
        setRecentScans(prev => [successResult, ...prev.slice(0, 4)])
        toast.success('Attendance logged successfully!')
      } else {
        const errorResult: ScanResult = {
          success: false,
          message: result.message || 'Failed to log attendance',
        }
        setScanResult(errorResult)
        toast.error(result.message || 'Failed to log attendance')
      }
    } catch (error) {
      console.error('Error logging attendance:', error)
      const errorResult: ScanResult = {
        success: false,
        message: 'Network error occurred',
      }
      setScanResult(errorResult)
      toast.error('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadRecentScans = () => {
    if (recentScans.length === 0) {
      toast.error('No scans to download')
      return
    }

    const csvContent = [
      'Student ID,Student Name,Timestamp,Gate Location,Session Type,Notes,Status',
      ...recentScans.map(scan => 
        `${scan.studentId || 'N/A'},${scan.studentName || 'N/A'},${scan.timestamp || 'N/A'},${scan.gateLocation || 'N/A'},${scan.sessionType || 'N/A'},${scan.notes || 'N/A'},${scan.success ? 'Success' : 'Failed'}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enhanced-attendance-scans-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Enhanced scan history downloaded!')
  }

  return (
    <div className="bg-gray-50">
      <Navigation />
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <QrCode className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced QR Scanner</h1>
            <p className="text-gray-600">Scan student ID to log attendance with session tracking</p>
            <p className="text-sm text-blue-600 mt-1">Dashboard Access - {session.user?.email}</p>
          </div>

          {/* Scanner Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <QRScanner onScan={handleScan} gateLocation={gateLocation} />
          </div>

          {/* Scan Results */}
          {scanResult && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className={`p-4 rounded-lg ${
                scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {scanResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      scanResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {scanResult.success ? 'Attendance Recorded Successfully!' : 'Scan Failed'}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Student:</strong> {scanResult.studentName} ({scanResult.studentId})</p>
                      {scanResult.sessionType && (
                        <p><strong>Session:</strong> {scanResult.sessionType}</p>
                      )}
                      <p><strong>Time:</strong> {scanResult.timestamp}</p>
                      <p><strong>Gate:</strong> {scanResult.gateLocation}</p>
                      {scanResult.notes && <p><strong>Notes:</strong> {scanResult.notes}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
                <button
                  onClick={downloadRecentScans}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors duration-200"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download CSV
                </button>
              </div>
              <div className="space-y-2">
                {recentScans.slice(0, 5).map((scan, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border-l-4 ${
                      scan.success 
                        ? 'bg-green-50 border-l-green-500' 
                        : 'bg-red-50 border-l-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {scan.studentId || 'Unknown ID'}
                        </p>
                        {scan.studentName && (
                          <p className="text-xs text-gray-600">{scan.studentName}</p>
                        )}
                        {scan.sessionType && (
                          <p className="text-xs text-blue-600">{scan.sessionType}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString() : 'Unknown time'}
                        </p>
                        {scan.gateLocation && (
                          <p className="text-xs text-gray-500">{scan.gateLocation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}