'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { QrCode, Camera, Keyboard, CheckCircle, RefreshCw, AlertTriangle, Settings } from 'lucide-react'
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode'
import { validateAndSanitizeQR } from '@/utils/qr-validation'

interface QRScannerProps {
  onScan: (data: string) => void
  gateLocation?: string
}

export default function QRScanner({ onScan, gateLocation = 'Main Gate' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>('')
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Request camera permission and get available devices
  const requestCameraPermission = useCallback(async () => {
    try {
      setCameraError(null)
      
      // First, try to get camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop())
      
      setCameraPermission('granted')
      
      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      setAvailableCameras(videoDevices)
      
      if (videoDevices.length > 0 && !selectedCameraId) {
        setSelectedCameraId(videoDevices[0].deviceId)
      }
      
      console.log('Camera permission granted, devices found:', videoDevices)
      return true
      
    } catch (error) {
      console.error('Camera permission error:', error)
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraPermission('denied')
          setCameraError('Camera access denied. Please allow camera permissions in your browser settings.')
          toast.error('Camera access denied. Please allow camera permissions.')
        } else if (error.name === 'NotFoundError') {
          setCameraPermission('denied')
          setCameraError('No camera found on this device.')
          toast.error('No camera found on this device.')
        } else if (error.name === 'NotReadableError') {
          setCameraPermission('denied')
          setCameraError('Camera is in use by another application.')
          toast.error('Camera is in use by another application.')
        } else {
          setCameraPermission('denied')
          setCameraError(`Camera error: ${error.message}`)
          toast.error(`Camera error: ${error.message}`)
        }
      } else {
        setCameraPermission('denied')
        setCameraError('Unknown camera error occurred.')
        toast.error('Unknown camera error occurred.')
      }
      
      return false
    }
  }, [selectedCameraId])

  // Initialize camera permissions on mount
  useEffect(() => {
    requestCameraPermission()
  }, [requestCameraPermission])

  // Refresh camera list
  const refreshCameras = useCallback(async () => {
    try {
      setCameraError(null)
      const success = await requestCameraPermission()
      
      if (success) {
        toast.success('Camera list refreshed successfully!')
      }
    } catch (error) {
      console.error('Error refreshing cameras:', error)
      toast.error('Error refreshing cameras')
    }
  }, [requestCameraPermission])

  // Start camera scanning with Html5QrcodeScanner
  const startScanner = useCallback(async () => {
    if (!scannerContainerRef.current || !selectedCameraId) {
      toast.error('Please select a camera first')
      return
    }

    try {
      // Clear any existing scanner
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
          scannerRef.current = null
        } catch (error) {
          console.error('Error clearing scanner:', error)
        }
      }

      // Clear container
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = ''
      }

      console.log('Starting scanner with camera:', selectedCameraId)

      // Create scanner with optimized settings
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
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: 'environment'
          }
        },
        false
      )

      // Render scanner
      scannerRef.current.render(
        (decodedText) => {
          console.log('QR Code detected:', decodedText)
          if (decodedText && !isProcessing) {
            handleScan(decodedText)
          }
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
      toast.success('QR Scanner started successfully!')

    } catch (error) {
      console.error('Error starting scanner:', error)
      setCameraError(`Failed to start scanner: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Failed to start scanner')
      setIsScanning(false)
    }
  }, [selectedCameraId, isProcessing])

  // Alternative method using direct Html5Qrcode
  const startDirectScanner = useCallback(async () => {
    if (!scannerContainerRef.current || !selectedCameraId) {
      toast.error('Please select a camera first')
      return
    }

    try {
      // Clear container
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = ''
      }

      // Create video element
      const video = document.createElement('video')
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.objectFit = 'cover'
      video.autoplay = true
      video.playsInline = true
      video.muted = true
      
      scannerContainerRef.current.appendChild(video)

      // Create Html5Qrcode instance
      const html5QrCode = new Html5Qrcode("qr-reader")
      html5QrCodeRef.current = html5QrCode

      // Start scanning
      await html5QrCode.start(
        { deviceId: selectedCameraId },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          console.log('QR Code detected (direct):', decodedText)
          if (decodedText && !isProcessing) {
            handleScan(decodedText)
          }
        },
        (error) => {
          // Filter out normal scanning errors for direct scanner too
          const isNormalScanningError = error.includes('NotFoundException') || 
                                       error.includes('No MultiFormat Readers') ||
                                       error.includes('QR code parse error')
          
          if (!isNormalScanningError) {
            if (error.includes('NotAllowedError')) {
              console.error('Direct scanner permission error:', error)
              setCameraError('Camera permission denied. Please allow camera access.')
            } else if (error.includes('NotFoundError')) {
              console.error('Direct scanner camera not found:', error)
              setCameraError('Camera not found. Please check camera connection.')
            } else if (error.includes('NotReadableError')) {
              console.error('Direct scanner camera in use:', error)
              setCameraError('Camera is in use by another application.')
            } else {
              console.error('Direct scanner unexpected error:', error)
              setCameraError(`Scanner error: ${error}`)
            }
          } else {
            console.debug('Direct scanner normal scanning attempt:', error)
          }
        }
      )

      setIsScanning(true)
      setCameraError(null)
      toast.success('Direct scanner started successfully!')

    } catch (error) {
      console.error('Error starting direct scanner:', error)
      setCameraError(`Failed to start direct scanner: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Failed to start direct scanner')
      setIsScanning(false)
    }
  }, [selectedCameraId, isProcessing])

  // Fallback method using basic getUserMedia
  const startFallbackCamera = useCallback(async () => {
    if (!scannerContainerRef.current) return

    try {
      // Clear container
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = ''
      }

      // Create video element
      const video = document.createElement('video')
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.objectFit = 'cover'
      video.autoplay = true
      video.playsInline = true
      video.muted = true
      
      scannerContainerRef.current.appendChild(video)

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          facingMode: selectedCameraId ? undefined : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      video.srcObject = stream
      streamRef.current = stream

      setIsScanning(true)
      setCameraError(null)
      toast.success('Fallback camera started (manual QR input required)')

    } catch (error) {
      console.error('Error starting fallback camera:', error)
      setCameraError(`Fallback camera failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      toast.error('Fallback camera failed')
      setIsScanning(false)
    }
  }, [selectedCameraId])

  // Start scanning based on mode
  const startCamera = useCallback(async () => {
    if (isAdvancedMode) {
      // Try direct scanner first, fallback to basic scanner
      try {
        await startDirectScanner()
      } catch (error) {
        console.log('Direct scanner failed, trying basic scanner...')
        try {
          await startScanner()
        } catch (error2) {
          console.log('Basic scanner failed, trying fallback...')
          await startFallbackCamera()
        }
      }
    } else {
      // Standard mode - try scanner first, then fallback
      try {
        await startScanner()
      } catch (error) {
        console.log('Scanner failed, trying fallback...')
        await startFallbackCamera()
      }
    }
  }, [isAdvancedMode, startDirectScanner, startScanner, startFallbackCamera])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
        scannerRef.current = null
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
    }

    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.stop()
        html5QrCodeRef.current = null
      } catch (error) {
        console.error('Error stopping direct scanner:', error)
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Clear container
    if (scannerContainerRef.current) {
      scannerContainerRef.current.innerHTML = ''
    }

    setIsScanning(false)
    setCameraError(null)
  }, [])



  // Handle scan results
  const handleScan = useCallback(async (data: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      // Validate and sanitize the QR code
      const validation = validateAndSanitizeQR(data)
      
      if (!validation.isValid) {
        toast.error(validation.error || `Invalid QR code format ${data}`)
        setIsProcessing(false)
        return
      }

      const sanitizedData = validation.sanitized
      setScannedData(sanitizedData)

      // FORCE STOP: Immediately stop camera and disable scanning
      stopCamera()
      setIsScanning(false)

      // Call the onScan callback with sanitized data
      onScan(sanitizedData)
      
      // Show success feedback with longer duration
      toast.success(`✅ QR Code scanned successfully: ${sanitizedData}`, {
        duration: 6000, // Increased duration
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      })
      
      // Keep processing state longer and do NOT automatically reset
      setTimeout(() => {
        setIsProcessing(false)
        // Do NOT clear scannedData automatically - user must manually restart
      }, 5000) // Increased from 3000 to 5000ms
      
    } catch (error) {
      console.error('Error processing QR code:', error)
      toast.error('Error processing QR code. Please try again.')
      setIsProcessing(false)
    }
  }, [isProcessing, onScan, stopCamera])

  // Handle manual input
  const handleManualInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setManualInput(value)
    
    // Auto-submit when Enter is pressed (USB scanner behavior)
    if (value.includes('\n') || value.endsWith('\r')) {
      const cleanValue = value.replace(/[\r\n]/g, '').trim()
      if (cleanValue) {
        handleScan(cleanValue)
        setManualInput('')
      }
    }
  }, [handleScan])

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScan(manualInput.trim())
      setManualInput('')
    }
  }, [manualInput, handleScan])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Handle scan mode changes
  useEffect(() => {
    if (scanMode === 'camera') {
      const timer = setTimeout(() => {
        if (cameraPermission === 'granted') {
          startCamera()
        }
      }, 100)
      return () => clearTimeout(timer)
    } else {
      stopCamera()
    }
  }, [scanMode, cameraPermission, startCamera, stopCamera])

  // Restart camera when camera selection changes
  useEffect(() => {
    if (isScanning && selectedCameraId) {
      stopCamera()
      const timer = setTimeout(() => {
        startCamera()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [selectedCameraId, isScanning, startCamera, stopCamera])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Gate:</span>
            <span className="text-sm font-medium text-gray-900">{gateLocation}</span>
          </div>
        </div>

        {/* Advanced Mode Toggle */}
        <div className="mb-4 flex items-center justify-center">
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{isAdvancedMode ? 'Advanced Mode' : 'Standard Mode'}</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setScanMode('camera')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                scanMode === 'camera'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              Camera
            </button>
            <button
              onClick={() => setScanMode('manual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                scanMode === 'manual'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Keyboard className="w-4 h-4 inline mr-2" />
              Manual/USB
            </button>
          </div>
        </div>

        {/* Camera Scanner */}
        {scanMode === 'camera' && (
          <div className="space-y-4">
            {/* Camera Permission Status */}
            {cameraPermission === 'denied' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Camera Access Required</span>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  {cameraError || 'Camera access is required for QR scanning.'}
                </p>
                <button
                  onClick={requestCameraPermission}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Grant Camera Permission
                </button>
              </div>
            )}

            {/* Camera Selection */}
            {cameraPermission === 'granted' && (
              <div className="mb-4">
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
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
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
              </div>
            )}

            {/* Scanner Container */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <div 
                ref={scannerContainerRef}
                id="qr-reader"
                className="w-full min-h-[400px] flex items-center justify-center"
                style={{ 
                  backgroundColor: '#1f2937',
                  position: 'relative'
                }}
              />
              
              {/* Camera Status Overlay */}
              {!isScanning && !cameraError && cameraPermission === 'granted' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <div className="text-center text-white">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}
              
              {/* Camera Error Overlay */}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
                  <div className="text-center text-white">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-red-200">Camera Error</p>
                    <p className="text-sm text-red-300 mt-1">{cameraError}</p>
                    <div className="mt-3 space-x-2">
                      <button
                        onClick={() => {
                          setCameraError(null)
                          startCamera()
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                      >
                        Retry Camera
                      </button>
                      <button
                        onClick={refreshCameras}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      >
                        Refresh Cameras
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            <div className="flex justify-center space-x-4">
              {/* Show "Start Scanning Again" button when a QR was successfully scanned */}
              {scannedData && !isScanning && (
                <button
                  onClick={() => {
                    setScannedData('')
                    startCamera()
                  }}
                  disabled={!selectedCameraId || isProcessing}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-lg font-bold"
                >
                  🔄 Start Scanning Again
                </button>
              )}
              
              {/* Regular scanning controls when no scan result */}
              {!scannedData && (
                <>
                  {isScanning && (
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                    >
                      Stop Camera
                    </button>
                  )}
                  {!isScanning && cameraPermission === 'granted' && !cameraError && (
                    <button
                      onClick={startCamera}
                      disabled={!selectedCameraId}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium"
                    >
                      Start Camera
                    </button>
                  )}
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              Position the QR code within the frame to scan
            </p>
          </div>
        )}

        {/* Manual/USB Scanner Input */}
        {scanMode === 'manual' && (
          <div className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="manual-qr-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter QR Code or Scan with USB Scanner
                </label>
                <input
                  id="manual-qr-input"
                  type="text"
                  value={manualInput}
                  onChange={handleManualInput}
                                      placeholder="2025-0000206 or scan with USB scanner"
                  className="input-field text-center text-lg font-mono"
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={!manualInput.trim() || isProcessing}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Submit QR Code'}
              </button>
            </form>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">USB Scanner Support</p>
                  <p>Connect a USB QR scanner to automatically capture and submit QR codes. The scanner will automatically press Enter after reading the code.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan Result */}
        {scannedData && (
          <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-lg font-bold text-green-900">✅ QR Code Scanned Successfully!</p>
                <p className="text-base text-green-700 font-mono bg-white px-2 py-1 rounded border">{scannedData}</p>
              </div>
            </div>
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium mb-2">🛑 Scanner STOPPED - Attendance being processed...</p>
              <p className="text-xs text-green-600 mb-2">
                Camera has been completely stopped to prevent duplicate scans.
              </p>
              <p className="text-xs text-green-700 font-medium">
                ⚠️ You must click "Start Scanning Again" button to scan the next QR code.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Camera Mode:</strong> Use your device camera to scan QR codes</li>
            <li>• <strong>Manual/USB Mode:</strong> Type QR codes manually or use a USB scanner</li>
            <li>• QR codes should be in the format: 2025-0000206</li>
            <li>• Ensure good lighting and clear QR code for camera scanning</li>
            <li>• Allow camera permissions when prompted</li>
            <li>• If camera doesn't work, try refreshing the camera list or switching to manual mode</li>
            <li>• Advanced mode provides multiple scanning methods for better compatibility</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
