'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QrCode, Camera, CheckCircle, XCircle, MapPin, RefreshCw } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { toast } from 'react-hot-toast'
import { Html5QrcodeScanner } from 'html5-qrcode'
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
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [gateLocation, setGateLocation] = useState('Main Gate')
  const [isLoading, setIsLoading] = useState(false)
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>('')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Get available cameras when component mounts
  useEffect(() => {
    const getCameras = async () => {
      try {
        // Request camera permission first
        await navigator.mediaDevices.getUserMedia({ video: true })
        
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        setAvailableCameras(videoDevices)
        
        // Auto-select the first camera if available
        if (videoDevices.length > 0 && !selectedCameraId) {
          setSelectedCameraId(videoDevices[0].deviceId)
        }
        
        console.log('Available cameras:', videoDevices)
      } catch (error) {
        console.error('Error getting cameras:', error)
        if (error instanceof Error && error.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Please allow camera access.')
          toast.error('Camera permission denied. Please allow camera access.')
        } else {
          setCameraError('Error detecting cameras')
          toast.error('Error detecting cameras')
        }
      }
    }
    
    getCameras()
  }, [])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (error) {
          console.error('Error cleaning up scanner:', error)
        }
        scannerRef.current = null
      }
    }
  }, [])

  const refreshCameras = async () => {
    try {
      setCameraError(null)
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setAvailableCameras(videoDevices)
      
      if (videoDevices.length > 0) {
        setSelectedCameraId(videoDevices[0].deviceId)
        toast.success(`Found ${videoDevices.length} camera(s)`)
      } else {
        toast.error('No cameras found')
      }
    } catch (error) {
      console.error('Error refreshing cameras:', error)
      toast.error('Error refreshing cameras')
    }
  }

  const startScanning = async () => {
    console.log('Starting QR scanner...')
    
    if (!scannerContainerRef.current) {
      console.error('Scanner container not found')
      return
    }

    // Check if a camera is selected
    if (!selectedCameraId) {
      toast.error('Please select a camera first')
      return
    }

    try {
      // Clear any existing scanner
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (error) {
          console.error('Error clearing existing scanner:', error)
        }
        scannerRef.current = null
      }

      // Clear the container
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = ''
      }

      console.log('Using selected camera:', selectedCameraId)
      
      // Create a new Html5QrcodeScanner instance with better configuration
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          videoConstraints: {
            deviceId: { exact: selectedCameraId },
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          }
        },
        false
      )

      // Render the scanner
      scannerRef.current.render(
        (decodedText) => {
          console.log('QR Code detected:', decodedText)
          handleScan(decodedText)
        },
        (error) => {
          // Filter out normal scanning errors (NotFoundException) - these are expected when no QR code is visible
          const isNormalScanningError = error.includes('NotFoundException') || 
                                       error.includes('No MultiFormat Readers') ||
                                       error.includes('QR code parse error')
          
          // Only show critical errors that actually affect camera functionality
          if (!isNormalScanningError) {
            if (error.includes('NotAllowedError')) {
              console.error('Camera permission error:', error)
              setCameraError('Camera permission denied. Please allow camera access.')
              toast.error('Camera permission denied. Please allow camera access.')
            } else if (error.includes('NotFoundError')) {
              console.error('Camera not found error:', error)
              setCameraError('Camera not found. Please check camera connection.')
              toast.error('Camera not found. Please check camera connection.')
            } else if (error.includes('NotReadableError')) {
              console.error('Camera in use error:', error)
              setCameraError('Camera is in use by another application.')
              toast.error('Camera is in use by another application.')
            } else {
              // Other unexpected errors
              console.error('Unexpected scanner error:', error)
              setCameraError(`Scanner error: ${error}`)
              toast.error(`Scanner error: ${error}`)
            }
          }
          // For normal scanning errors, just log them quietly without user notification
          else {
            console.debug('Normal scanning attempt (no QR code detected):', error)
          }
        }
      )
      
      setIsScanning(true)
      setCameraError(null)
      setScanResult(null)
      toast.success('QR Scanner started with selected camera!')
      
    } catch (error) {
      console.error('Error starting QR scanner:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera permissions.')
          toast.error('Camera access denied. Please allow camera permissions.')
        } else if (error.name === 'NotFoundError') {
          setCameraError('Selected camera not found. Please check the connection.')
          toast.error('Selected camera not found. Please check the connection.')
        } else if (error.name === 'NotReadableError') {
          setCameraError('Camera is in use by another application.')
          toast.error('Camera is in use by another application.')
        } else {
          setCameraError(`Camera error: ${error.message}`)
          toast.error(`Camera error: ${error.message}`)
        }
      } else {
        setCameraError('Error starting QR scanner')
        toast.error('Error starting QR scanner')
      }
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
        scannerRef.current = null
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
    }
    
    // Clear the container
    if (scannerContainerRef.current) {
      scannerContainerRef.current.innerHTML = ''
    }
    
    setIsScanning(false)
    setCameraError(null)
    toast.success('QR Scanner stopped')
  }



  const handleScan = async (qrCode: string) => {
    setIsLoading(true)
    
    try {
      // Validate and sanitize the QR code
      const validation = validateAndSanitizeQR(qrCode)
      
      if (!validation.isValid) {
        setScanResult({
          success: false,
          message: validation.error || `Invalid QR code format ${qrCode}`,
        })
        toast.error(validation.error || `Invalid QR code format ${qrCode}`)
        setIsLoading(false)
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

  // Restart scanner when camera selection changes
  useEffect(() => {
    if (isScanning && selectedCameraId) {
      stopScanning()
      const timer = setTimeout(() => {
        startScanning()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [selectedCameraId])

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

          {/* Camera Selection */}
          <div className="mb-6">
            <label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select Camera
            </label>
            <div className="flex gap-2">
              <select
                id="cameraSelect"
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {availableCameras.length === 0 ? (
                  <option value="">No cameras detected</option>
                ) : (
                  availableCameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 8)}...`}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={refreshCameras}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200"
                title="Refresh cameras"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {availableCameras.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {availableCameras.length} camera(s) detected. Select your preferred camera above.
              </p>
            )}
            
            {/* Selected Camera Info */}
            {selectedCameraId && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Selected Camera:</strong> {
                    availableCameras.find(cam => cam.deviceId === selectedCameraId)?.label || 
                    `Camera ${selectedCameraId.slice(0, 8)}...`
                  }
                </p>
                {isScanning && (
                  <p className="text-xs text-blue-600 mt-1">
                    ✓ Currently using this camera for scanning
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Scanner Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!isScanning ? (
              <button
                onClick={startScanning}
                disabled={!selectedCameraId}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
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
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              {/* QR Scanner Container */}
              <div 
                ref={scannerContainerRef}
                id="qr-reader"
                className={`w-full h-64 rounded-lg border-2 border-gray-300 bg-gray-100 ${
                  isScanning ? 'block' : 'hidden'
                }`}
                style={{ 
                  minHeight: '256px',
                  maxHeight: '400px',
                  backgroundColor: '#f3f4f6'
                }}
              />
              
              {/* Show placeholder when not scanning */}
              {!isScanning && (
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Camera not active</p>
                    <p className="text-sm">Click "Start Scanner" to begin</p>
                  </div>
                </div>
              )}
              
              {/* Scanner Frame - only show when scanning */}
              {isScanning && (
                <>
                  <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none" style={{ zIndex: 2 }}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-500"></div>
                  </div>
                </>
              )}
            </div>
            
            {isScanning && (
              <>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Position the QR code within the frame
                </p>
                
                {/* Debug Info */}
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500">
                    Scanner Status: {isScanning ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-500">
                    QR Scanner: {scannerRef.current ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Container: {scannerContainerRef.current ? 'Found' : 'Missing'}
                  </p>
                </div>
              </>
            )}

            {/* Camera Error Display */}
            {cameraError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Camera Error</span>
                </div>
                <p className="text-red-700 text-sm mt-1">{cameraError}</p>
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => {
                      setCameraError(null)
                      startScanning()
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                  >
                    Retry
                  </button>
                  <button
                    onClick={refreshCameras}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                  >
                    Refresh Cameras
                  </button>
                </div>
              </div>
            )}
          </div>

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
