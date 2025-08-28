'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  QrCode, 
  Camera, 
  StopCircle, 
  RotateCcw, 
  Download, 
  Clock,
  Sun,
  Moon,
  LogIn,
  LogOut,
  MapPin,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'

interface ScanResult {
  studentId: string
  studentName: string
  timestamp: string
  sessionType: string
  gateLocation: string
  success: boolean
  notes?: string
}

interface SessionConfig {
  type: string
  label: string
  icon: any
  color: string
  timeRange: string
}

const SESSION_CONFIGS: SessionConfig[] = [
  {
    type: 'MORNING_IN',
    label: 'Morning In',
    icon: Sun,
    color: 'bg-yellow-500',
    timeRange: '6:00 AM - 8:00 AM'
  },
  {
    type: 'MORNING_OUT',
    label: 'Morning Out',
    icon: Sun,
    color: 'bg-orange-500',
    timeRange: '11:30 AM - 12:30 PM'
  },
  {
    type: 'AFTERNOON_IN',
    label: 'Afternoon In',
    icon: Moon,
    color: 'bg-blue-500',
    timeRange: '12:30 PM - 2:00 PM'
  },
  {
    type: 'AFTERNOON_OUT',
    label: 'Afternoon Out',
    icon: Moon,
    color: 'bg-indigo-500',
    timeRange: '4:30 PM - 6:00 PM'
  }
]

export default function EnhancedQRScanner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string>('MORNING_IN')
  const [gateLocation, setGateLocation] = useState<string>('Main Gate')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number>(0)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [notes, setNotes] = useState<string>('')
  
  const isProcessingRef = useRef(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleError = (error: any) => {
    console.error('Camera error:', error)
    setCameraError('Camera error occurred')
  }

  const startScanning = () => {
    console.log('✅ Starting enhanced scanner')
    setScanResult(null)
    setCameraError(null)
    setLastScannedCode(null)
    setLastScanTime(0)
    isProcessingRef.current = false
    setIsScanning(true)
    toast.success('Enhanced QR Scanner started!')
  }

  const stopScanning = () => {
    console.log('🛑 Stopping scanner')
    setIsScanning(false)
    isProcessingRef.current = false
  }

  const resetScan = () => {
    setScanResult(null)
    setLastScannedCode(null)
    setLastScanTime(0)
    isProcessingRef.current = false
    startScanning()
  }

  const handleScan = useCallback(async (decodedText: string) => {
    if (isProcessingRef.current) return

    const now = Date.now()
    if (now - lastScanTime < 2000) return // Prevent rapid scanning

    isProcessingRef.current = true
    setLastScannedCode(decodedText)
    setLastScanTime(now)

    try {
      console.log('🔍 Processing scan:', decodedText)
      
      // Extract student ID from QR code
      const studentId = decodedText.trim()
      
      // Fetch student details
      const response = await fetch(`/api/student/${studentId}`)
      if (!response.ok) {
        throw new Error('Student not found')
      }

      const studentData = await response.json()
      
      // Check if this session type is already recorded for today
      const today = new Date().toISOString().split('T')[0]
      const attendanceCheck = await fetch(`/api/attendance/check?studentId=${studentId}&sessionType=${selectedSession}&date=${today}`)
      
      if (attendanceCheck.ok) {
        const checkData = await attendanceCheck.json()
        if (checkData.exists) {
          toast.error(`Student already recorded for ${getSessionLabel(selectedSession)} today`)
          return
        }
      }

      // Record attendance
      const attendanceResponse = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentData.id,
          sessionType: selectedSession,
          gateLocation,
          notes: notes.trim() || undefined
        }),
      })

      if (attendanceResponse.ok) {
        const result: ScanResult = {
          studentId: studentData.studentId,
          studentName: studentData.user.name,
          timestamp: new Date().toLocaleString(),
          sessionType: getSessionLabel(selectedSession),
          gateLocation,
          success: true,
          notes: notes.trim() || undefined
        }

        setScanResult(result)
        setRecentScans(prev => [result, ...prev.slice(0, 9)]) // Keep last 10
        toast.success(`Attendance recorded for ${studentData.user.name}`)
        
        // Clear notes for next scan
        setNotes('')
      } else {
        throw new Error('Failed to record attendance')
      }

    } catch (error) {
      console.error('Scan processing error:', error)
      const errorResult: ScanResult = {
        studentId: 'Unknown',
        studentName: 'Error',
        timestamp: new Date().toLocaleString(),
        sessionType: getSessionLabel(selectedSession),
        gateLocation,
        success: false,
        notes: error instanceof Error ? error.message : 'Unknown error'
      }
      setScanResult(errorResult)
      toast.error('Failed to process QR code')
    } finally {
      isProcessingRef.current = false
    }
  }, [selectedSession, gateLocation, notes, lastScanTime])

  const getSessionLabel = (sessionType: string) => {
    const config = SESSION_CONFIGS.find(s => s.type === sessionType)
    return config ? config.label : sessionType
  }

  const getSessionConfig = (sessionType: string) => {
    return SESSION_CONFIGS.find(s => s.type === sessionType) || SESSION_CONFIGS[0]
  }

  const downloadRecentScans = () => {
    if (recentScans.length === 0) {
      toast.error('No scans to download')
      return
    }

    const csvContent = [
      'Student ID,Student Name,Timestamp,Session Type,Gate Location,Status,Notes',
      ...recentScans.map(scan => 
        `${scan.studentId},${scan.studentName},${scan.timestamp},${scan.sessionType},${scan.gateLocation},${scan.success ? 'Success' : 'Failed'},${scan.notes || ''}`
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced QR Attendance Scanner
          </h1>
          <p className="text-xl text-gray-600">
            Track morning and afternoon sessions with time in/out functionality
          </p>
        </div>

        {/* Session Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Session Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {SESSION_CONFIGS.map((config) => (
              <button
                key={config.type}
                onClick={() => setSelectedSession(config.type)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedSession === config.type
                    ? `${config.color} border-white text-white shadow-lg`
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <config.icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{config.label}</div>
                    <div className="text-sm opacity-90">{config.timeRange}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gate Location
              </label>
              <select
                value={gateLocation}
                onChange={(e) => setGateLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Main Gate">Main Gate</option>
                <option value="Back Gate">Back Gate</option>
                <option value="Side Gate">Side Gate</option>
                <option value="Faculty Entrance">Faculty Entrance</option>
                <option value="Student Entrance">Student Entrance</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Late arrival, early departure, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Scanner Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="inline-flex items-center px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </button>
            ) : (
              <>
                <button
                  onClick={stopScanning}
                  className="inline-flex items-center px-6 py-3 bg-error-600 hover:bg-error-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <StopCircle className="w-5 h-5 mr-2" />
                  Stop Scanner
                </button>
                <button
                  onClick={resetScan}
                  className="inline-flex items-center px-6 py-3 bg-warning-600 hover:bg-warning-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </button>
              </>
            )}
          </div>

          {isScanning && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Scanner Active - {getSessionLabel(selectedSession)} at {gateLocation}
              </div>
            </div>
          )}
        </div>

        {/* Scan Results */}
        {scanResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className={`p-4 rounded-lg ${
              scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {scanResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    scanResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {scanResult.success ? 'Attendance Recorded Successfully!' : 'Scan Failed'}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Student:</strong> {scanResult.studentName} ({scanResult.studentId})</p>
                    <p><strong>Session:</strong> {scanResult.sessionType}</p>
                    <p><strong>Time:</strong> {scanResult.timestamp}</p>
                    <p><strong>Gate:</strong> {scanResult.gateLocation}</p>
                    {scanResult.notes && <p><strong>Notes:</strong> {scanResult.notes}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setScanResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Scans</h2>
            <button
              onClick={downloadRecentScans}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </button>
          </div>

          {recentScans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No scans recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentScans.map((scan, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {scan.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scan.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scan.sessionType.includes('Morning') 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {scan.sessionType.includes('In') ? (
                            <LogIn className="w-3 h-3 mr-1" />
                          ) : (
                            <LogOut className="w-3 h-3 mr-1" />
                          )}
                          {scan.sessionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          {scan.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <MapPin className="w-3 h-3 mr-1" />
                          {scan.gateLocation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          scan.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {scan.success ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {scan.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
