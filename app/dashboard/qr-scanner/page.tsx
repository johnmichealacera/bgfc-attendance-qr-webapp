'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QrCode, Camera, CheckCircle, XCircle, MapPin } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { toast } from 'react-hot-toast'

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
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [gateLocation, setGateLocation] = useState('Main Gate')
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        setScanResult(null)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast.error('Unable to access camera')
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleScan = async (qrCode: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/attendance/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode,
          gateLocation,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setScanResult({
          success: true,
          message: 'Attendance logged successfully!',
          studentId: result.studentId,
          studentName: result.studentName,
          timestamp: result.timestamp,
          gateLocation: result.gateLocation,
        })
        toast.success('Attendance logged successfully!')
      } else {
        setScanResult({
          success: false,
          message: result.message || 'Failed to log attendance',
        })
        toast.error(result.message || 'Failed to log attendance')
      }
    } catch (error) {
      console.error('Error logging attendance:', error)
      setScanResult({
        success: false,
        message: 'Network error occurred',
      })
      toast.error('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetScan = () => {
    setScanResult(null)
    if (isScanning) {
      startScanning()
    }
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              QR Code Scanner
            </h1>
            <p className="text-gray-600">
              Scan student QR codes to log attendance
            </p>
          </div>

          {/* Gate Location Selection */}
          <div className="mb-6">
            <label htmlFor="gateLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Gate Location
            </label>
              <select
              id="gateLocation"
                value={gateLocation}
                onChange={(e) => setGateLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Main Gate">Main Gate</option>
              <option value="Back Gate">Back Gate</option>
              <option value="Side Gate">Side Gate</option>
              <option value="Faculty Entrance">Faculty Entrance</option>
              <option value="Student Entrance">Student Entrance</option>
              </select>
            </div>

          {/* Scanner Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
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
            </div>

          {/* Video Preview */}
          {isScanning && (
            <div className="mb-6">
              <div className="relative max-w-md mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg border-2 border-gray-300"
                />
                <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-500"></div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Position the QR code within the frame
              </p>
                </div>
          )}

          {/* Manual QR Code Input */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <label htmlFor="manualQR" className="block text-sm font-medium text-gray-700 mb-2">
                Or enter QR code manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="manualQR"
                  placeholder="Enter QR code value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (value) {
                        handleScan(value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('manualQR') as HTMLInputElement
                    const value = input.value.trim()
                    if (value) {
                      handleScan(value)
                      input.value = ''
                    }
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors duration-200"
                >
                  Log
                </button>
              </div>
            </div>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className="max-w-md mx-auto">
              <div className={`p-4 rounded-lg border ${
                scanResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  {scanResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    scanResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {scanResult.success ? 'Success' : 'Error'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  scanResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {scanResult.message}
                </p>

                {scanResult.success && (
                  <div className="mt-3 space-y-1 text-sm text-green-700">
                    <p><strong>Student:</strong> {scanResult.studentName}</p>
                    <p><strong>ID:</strong> {scanResult.studentId}</p>
                    <p><strong>Time:</strong> {new Date(scanResult.timestamp!).toLocaleString()}</p>
                    <p><strong>Gate:</strong> {scanResult.gateLocation}</p>
                  </div>
                )}

                <button
                  onClick={resetScan}
                  className="mt-3 w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  Scan Another
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Processing...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
