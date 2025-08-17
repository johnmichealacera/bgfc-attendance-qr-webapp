'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { QrCode, Camera, CheckCircle, XCircle, MapPin, Download, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { Scanner } from '@yudiel/react-qr-scanner'
import { validateAndSanitizeQR } from '@/utils/qr-validation'

interface ScanResult {
  success: boolean
  message: string
  studentId?: string
  studentName?: string
  timestamp?: string
  gateLocation?: string
}

export default function QRScannerPage() {
  const { data: session, status } = useSession()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [gateLocation, setGateLocation] = useState('Main Gate')
  const [isLoading, setIsLoading] = useState(false)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  // Debouncing state to prevent multiple scans
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number>(0)
  const isProcessingRef = useRef(false)

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

  const handleScan = async (result: any) => {
    const currentTime = Date.now()
    const qrCode = result[0]?.rawValue || result

    // Prevent multiple calls if already processing
    if (isProcessingRef.current) {
      console.log('Scan already in progress, ignoring...')
      return
    }

    // Debouncing - prevent scanning same code within 2 seconds
    if (lastScannedCode === qrCode && currentTime - lastScanTime < 2000) {
      console.log('Same QR code scanned too quickly, ignoring...')
      return
    }

    // IMMEDIATELY stop scanning to prevent more detections
    console.log('🛑 QR detected, stopping scanner immediately')
    setIsScanning(false)
    isProcessingRef.current = true
    
    // Update tracking variables
    setLastScannedCode(qrCode)
    setLastScanTime(currentTime)
    setIsLoading(true)
    
    try {
      // Validate and sanitize the QR code
      const validation = validateAndSanitizeQR(qrCode)
      
      if (!validation.isValid) {
        const errorResult: ScanResult = {
          success: false,
          message: validation.error || `Invalid QR code format ${qrCode}`,
        }
        setScanResult(errorResult)
        toast.error(validation.error || `Invalid QR code format ${qrCode}`)
        return
      }

      const sanitizedQrCode = validation.sanitized

      const response = await fetch('/api/attendance/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode: sanitizedQrCode,
          gateLocation,
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
      isProcessingRef.current = false
    }
  }

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error)
    setCameraError('Camera error occurred')
  }

  const startScanning = () => {
    console.log('✅ Starting scanner')
    setScanResult(null)
    setCameraError(null)
    setLastScannedCode(null)
    setLastScanTime(0)
    isProcessingRef.current = false
    setIsScanning(true)
    toast.success('QR Scanner started!')
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

  const downloadRecentScans = () => {
    if (recentScans.length === 0) {
      toast.error('No scans to download')
      return
    }

    const csvContent = [
      'Student ID,Student Name,Timestamp,Gate Location,Status',
      ...recentScans.map(scan => 
        `${scan.studentId || 'N/A'},${scan.studentName || 'N/A'},${scan.timestamp || 'N/A'},${scan.gateLocation || 'N/A'},${scan.success ? 'Success' : 'Failed'}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-scans-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Scan history downloaded!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Scanner</h1>
          <p className="text-gray-600">Scan student ID to log attendance</p>
          <p className="text-sm text-blue-600 mt-1">Dashboard Access - {session.user?.email}</p>
        </div>

        {/* Gate Location Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <label className="text-sm font-medium text-gray-700">Gate Location</label>
          </div>
          <select
            value={gateLocation}
            onChange={(e) => setGateLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Main Gate">Main Gate</option>
            <option value="Side Gate">Side Gate</option>
            <option value="Back Gate">Back Gate</option>
            <option value="Emergency Exit">Emergency Exit</option>
          </select>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Scanner Container */}
          <div className="mb-6">
            {isScanning ? (
              <div className="relative">
                <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: 'environment' // Use back camera for mobile
                    }}
                    styles={{
                      container: {
                        width: '100%',
                        height: '256px'
                      }
                    }}
                  />
                </div>
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>Processing scan...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Camera not active</p>
                  <p className="text-xs mt-1">Press "Start Scanner" to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {cameraError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{cameraError}</span>
              </div>
            </div>
          )}

          {/* Scan Result Display */}
          {scanResult && (
            <div className={`mb-4 p-4 rounded-lg border ${
              scanResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {scanResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    scanResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {scanResult.message}
                  </p>
                  {scanResult.success && scanResult.studentId && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-green-700">
                        <strong>Student ID:</strong> {scanResult.studentId}
                      </p>
                      {scanResult.studentName && (
                        <p className="text-xs text-green-700">
                          <strong>Name:</strong> {scanResult.studentName}
                        </p>
                      )}
                      <p className="text-xs text-green-700">
                        <strong>Time:</strong> {new Date(scanResult.timestamp || '').toLocaleString()}
                      </p>
                      <p className="text-xs text-green-700">
                        <strong>Location:</strong> {scanResult.gateLocation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scanner Controls */}
          <div className="flex justify-center gap-4">
            {scanResult ? (
              <button
                onClick={resetScan}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Another ID
              </button>
            ) : (
              <>
                {!isScanning ? (
                  <button
                    onClick={startScanning}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopScanning}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Stop Scanner
                  </button>
                )}
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              📱 <strong>Mobile Tip:</strong> Hold your phone steady and ensure good lighting. 
              The scanner will automatically detect QR codes in format: <strong>2025-0000206</strong>
            </p>
          </div>
        </div>

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
                Download
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
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString() : 'Unknown time'}
                      </p>
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
  )
}