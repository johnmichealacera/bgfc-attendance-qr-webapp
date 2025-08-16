'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QrCode, Camera, CheckCircle, XCircle, MapPin } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import { toast } from 'react-hot-toast'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'

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
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null)
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
        toast.error('Error detecting cameras')
      }
    }
    
    getCameras()
  }, [selectedCameraId])

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        try {
          if ('start' in qrScannerRef.current) {
            (qrScannerRef.current as any).stop()
          } else {
            qrScannerRef.current.clear()
          }
        } catch (error) {
          console.error('Error cleaning up scanner:', error)
        }
        qrScannerRef.current = null
      }
    }
  }, [])



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
      // First, request camera permissions explicitly
      console.log('Requesting camera permissions...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          deviceId: { exact: selectedCameraId },
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      
      // Stop the test stream since the scanner will handle it
      stream.getTracks().forEach(track => track.stop())
      console.log('Camera permissions granted for selected camera')

      // Clear any existing scanner
      if (qrScannerRef.current) {
        qrScannerRef.current.clear()
        qrScannerRef.current = null
      }

      // Clear the container
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = ''
      }

      // Try alternative approach with direct Html5Qrcode if scanner doesn't work
      try {
        console.log('Trying direct Html5Qrcode approach...')
        const html5QrCode = new Html5Qrcode("qr-reader")
        
        // Check if a camera is selected
        if (!selectedCameraId) {
          toast.error('Please select a camera first')
          setIsScanning(false)
          return
        }
        
        console.log('Using selected camera:', selectedCameraId)
        
        // Start scanning with the selected camera
        await html5QrCode.start(
          { deviceId: selectedCameraId },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText, decodedResult) => {
            console.log('QR Code detected:', decodedText)
            handleScan(decodedText)
          },
          (errorMessage) => {
            // Ignore scanning errors
          }
        )
        
        // Store reference for cleanup
        qrScannerRef.current = html5QrCode as any
        setIsScanning(true)
        setScanResult(null)
        toast.success('Direct camera scanner started with selected camera!')
        return
      } catch (directError) {
        console.log('Direct approach failed, falling back to scanner:', directError)
        toast.error('Direct camera access failed, trying scanner approach...')
      }

      // Fallback to scanner approach
      console.log('Using scanner approach...')
      qrScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          formatsToSupport: [ "QR_CODE" as any ]
        },
        false
      )

      // Start scanning with proper error handling
      qrScannerRef.current.render((decodedText, decodedResult) => {
        console.log('QR Code detected:', decodedText)
        handleScan(decodedText)
      }, (errorMessage) => {
        // Log permission and access errors
        if (errorMessage.includes('NotFound') || errorMessage.includes('NotAllowedError') || errorMessage.includes('NotReadableError')) {
          console.error('Camera access error:', errorMessage)
          toast.error('Camera access issue. Please check permissions.')
        }
      })

      // Force the scanner to start immediately
      setTimeout(() => {
        if (qrScannerRef.current) {
          console.log('Forcing scanner to start...')
          // Try to trigger camera start by accessing the scanner's internal methods
          const scannerElement = document.getElementById('qr-reader')
          if (scannerElement) {
            console.log('Scanner element found, checking for camera elements...')
            const cameraElements = scannerElement.querySelectorAll('video')
            console.log('Found video elements:', cameraElements.length)
            
            // If no camera is showing, try to restart the scanner
            if (cameraElements.length === 0) {
              console.log('No camera elements found, restarting scanner...')
              stopScanning()
              setTimeout(() => startScanning(), 500)
            }
          }
        }
      }, 2000)

      setIsScanning(true)
      setScanResult(null)
      toast.success('QR Scanner started successfully!')
      
    } catch (error) {
      console.error('Error starting QR scanner:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera permissions in your browser.')
        } else if (error.name === 'NotFoundError') {
          toast.error('No camera found. Please connect a camera and try again.')
        } else {
          toast.error(`Camera error: ${error.message}`)
        }
      } else {
        toast.error('Error starting QR scanner')
      }
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (qrScannerRef.current) {
      try {
        // Check if it's a direct Html5Qrcode instance
        if ('start' in qrScannerRef.current) {
          // It's a direct Html5Qrcode instance
          (qrScannerRef.current as any).stop()
        } else {
          // It's a Html5QrcodeScanner instance
          qrScannerRef.current.clear()
        }
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
      qrScannerRef.current = null
    }
    
    // Clear the container
    if (scannerContainerRef.current) {
      scannerContainerRef.current.innerHTML = ''
    }
    
    setIsScanning(false)
    toast.success('QR Scanner stopped')
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
                onClick={async () => {
                  try {
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
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                🔄
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
            
            {/* Test Camera Button */}
            <button
              onClick={async () => {
                try {
                  const devices = await navigator.mediaDevices.enumerateDevices()
                  const videoDevices = devices.filter(device => device.kind === 'videoinput')
                  console.log('Available video devices:', videoDevices)
                  toast.success(`Found ${videoDevices.length} camera(s)`)
                } catch (error) {
                  console.error('Error enumerating devices:', error)
                  toast.error('Error checking camera devices')
                }
              }}
              className="inline-flex items-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Test Camera
            </button>
            
            {/* Fallback Manual Camera Button */}
            <button
              onClick={async () => {
                try {
                  // Try to start a simple camera feed as fallback
                  const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                  })
                  
                  // Create a simple video element
                  const video = document.createElement('video')
                  video.style.width = '300px'
                  video.style.height = '200px'
                  video.style.border = '3px solid green'
                  video.style.position = 'fixed'
                  video.style.top = '20px'
                  video.style.right = '20px'
                  video.style.zIndex = '9999'
                  video.autoplay = true
                  video.playsInline = true
                  video.muted = true
                  video.srcObject = stream
                  
                  document.body.appendChild(video)
                  toast.success('Fallback camera started!')
                  
                  // Add close button
                  const closeBtn = document.createElement('button')
                  closeBtn.textContent = 'Close Camera'
                  closeBtn.style.position = 'fixed'
                  closeBtn.style.top = '10px'
                  closeBtn.style.right = '10px'
                  closeBtn.style.zIndex = '10000'
                  closeBtn.style.padding = '5px 10px'
                  closeBtn.style.backgroundColor = 'red'
                  closeBtn.style.color = 'white'
                  closeBtn.style.border = 'none'
                  closeBtn.style.borderRadius = '3px'
                  closeBtn.onclick = () => {
                    stream.getTracks().forEach(track => track.stop())
                    document.body.removeChild(video)
                    document.body.removeChild(closeBtn)
                  }
                  
                  document.body.appendChild(closeBtn)
                  
                } catch (error) {
                  console.error('Fallback camera failed:', error)
                  toast.error('Fallback camera failed')
                }
              }}
              className="inline-flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Fallback Camera
            </button>
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
                    QR Scanner: {qrScannerRef.current ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Container: {scannerContainerRef.current ? 'Found' : 'Missing'}
                  </p>
                </div>
              </>
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
