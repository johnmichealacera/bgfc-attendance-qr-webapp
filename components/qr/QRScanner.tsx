'use client'

import { useState, useRef } from 'react'
import { Camera, CheckCircle, XCircle, RefreshCw, Sun, Moon, LogIn, LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Scanner } from '@yudiel/react-qr-scanner'
import { validateAndSanitizeQR } from '@/utils/qr-validation'

interface QRScannerProps {
  onScan: (data: string) => void
  gateLocation?: string
  sessionType?: string
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
    type: 'TIME_IN',
    label: 'Time In',
    icon: Sun,
    color: 'bg-green-500',
    timeRange: 'Morning (6:00 AM - 12:00 PM) or Afternoon (12:00 PM - 6:00 PM)'
  },
  {
    type: 'TIME_OUT',
    label: 'Time Out',
    icon: Moon,
    color: 'bg-red-500',
    timeRange: 'Morning (6:00 AM - 12:00 PM) or Afternoon (12:00 PM - 6:00 PM)'
  }
]

export default function QRScanner({ onScan, gateLocation = 'Main Gate', sessionType = 'TIME_IN' }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<string>(sessionType)
  const [notes, setNotes] = useState<string>('')
  
  // Debouncing state to prevent multiple scans
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [lastScanTime, setLastScanTime] = useState<number>(0)
  const isProcessingRef = useRef(false)

  const getSessionLabel = (sessionType: string) => {
    const config = SESSION_CONFIGS.find(s => s.type === sessionType)
    return config ? config.label : sessionType
  }

  const getSessionConfig = (sessionType: string) => {
    return SESSION_CONFIGS.find(s => s.type === sessionType) || SESSION_CONFIGS[0]
  }

  const handleScan = async (result: any) => {
    const currentTime = Date.now()
    const qrCode = result[0]?.rawValue || result

    // Prevent multiple calls if already processing or scan result exists
    if (isProcessingRef.current || scannedData) {
      console.log('Scan already in progress or completed, ignoring...')
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
    setIsProcessing(true)
    
    // Update tracking variables
    setLastScannedCode(qrCode)
    setLastScanTime(currentTime)
    
    try {
      const validation = validateAndSanitizeQR(qrCode)
      
      if (!validation.isValid) {
        toast.error(validation.error || `Invalid QR code format ${qrCode}`)
        setIsProcessing(false)
        isProcessingRef.current = false
        return
      }

      const sanitizedData = validation.sanitized

      // Call the onScan callback with enhanced data including session info
      const enhancedData = {
        studentId: sanitizedData,
        sessionType: selectedSession,
        gateLocation,
        notes: notes.trim() || undefined
      }
      
      setScannedData(sanitizedData)
      
      onScan(JSON.stringify(enhancedData))
      
      toast.success('QR code scanned successfully!')
      
    } catch (error) {
      console.error('Error processing QR code:', error)
      toast.error('Error processing QR code. Please try again.')
    } finally {
      setIsProcessing(false)
      isProcessingRef.current = false
    }
  }

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error)
    setCameraError('Camera error occurred')
  }

  const startCamera = () => {
    console.log('✅ Starting camera scanner')
    setScannedData('')
    setCameraError(null)
    setLastScannedCode(null)
    setLastScanTime(0)
    isProcessingRef.current = false
    setIsProcessing(false)
    setIsScanning(true)
  }

  const stopCamera = () => {
    console.log('🛑 Stopping camera scanner')
    setIsScanning(false)
    isProcessingRef.current = false
    setIsProcessing(false)
  }

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      toast.error('Please enter a student ID')
      return
    }

    const validation = validateAndSanitizeQR(manualInput.trim())
    
    if (!validation.isValid) {
      toast.error(validation.error || `Invalid QR code format ${manualInput}`)
      return
    }

    const sanitizedData = validation.sanitized
    setScannedData(sanitizedData)
    
    // Call the onScan callback with enhanced data including session info
    const enhancedData = {
      studentId: sanitizedData,
      sessionType: selectedSession,
      gateLocation,
      notes: notes.trim() || undefined
    }
    
    onScan(JSON.stringify(enhancedData))
    setManualInput('')
    toast.success('Student ID processed successfully!')
  }

  const resetScanner = () => {
    setScannedData('')
    setManualInput('')
    setLastScannedCode(null)
    setLastScanTime(0)
    isProcessingRef.current = false
    setIsProcessing(false)
    setCameraError(null)
    
    if (scanMode === 'camera') {
      startCamera()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Session Configuration */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Configuration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select Time In or Time Out and scan student QR codes. The system will automatically determine if it's morning (AM) or afternoon (PM) based on the current time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {SESSION_CONFIGS.map((config) => (
            <button
              key={config.type}
              onClick={() => setSelectedSession(config.type)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedSession === config.type
                  ? `${config.color} border-white text-white shadow-lg`
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <config.icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold text-xs">{config.label}</div>
                  <div className="text-xs opacity-90">{config.timeRange}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gate Location
            </label>
            <select
              value={gateLocation}
              onChange={(e) => onScan(JSON.stringify({ gateLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="Main Gate">Main Gate</option>
              <option value="Back Gate">Back Gate</option>
              <option value="Side Gate">Side Gate</option>
              <option value="Faculty Entrance">Faculty Entrance</option>
              <option value="Student Entrance">Student Entrance</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Late arrival, early departure, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => {
            setScanMode('camera')
            stopCamera()
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            scanMode === 'camera'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-2" />
          Camera
        </button>
        <button
          onClick={() => {
            setScanMode('manual')
            stopCamera()
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            scanMode === 'manual'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manual Input
        </button>
      </div>

      {scanMode === 'camera' ? (
        /* Camera Scanner Mode */
        <div className="space-y-4">
          {/* Scanner Container */}
          <div className="relative">
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
                {isProcessing && (
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
                  {scannedData ? (
                    <p className="text-xs mt-1 text-green-600">Scan completed</p>
                  ) : (
                    <p className="text-xs mt-1">Press "Start Scanner" to begin</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {cameraError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{cameraError}</span>
              </div>
            </div>
          )}

          {/* Success Display */}
          {scannedData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Scan Successful!
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Student ID:</strong> {scannedData}
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Session:</strong> {getSessionLabel(selectedSession)}
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Gate:</strong> {gateLocation}
                  </p>
                  {notes && (
                    <p className="text-xs text-green-700">
                      <strong>Notes:</strong> {notes}
                    </p>
                  )}
                  <p className="text-xs text-green-700 mt-1">
                    Attendance processing...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          <div className="flex justify-center gap-4">
            {scannedData ? (
              <button
                onClick={resetScanner}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan Another ID
              </button>
            ) : (
              <>
                {!isScanning ? (
                  <button
                    onClick={startCamera}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
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
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              📱 <strong>Mobile Tip:</strong> Hold your phone steady and ensure good lighting. 
              The scanner will automatically detect QR codes in format: <strong>2025-0000206</strong>
            </p>
          </div>
        </div>
      ) : (
        /* Manual Input Mode */
        <div className="space-y-4">
          <div>
            <label htmlFor="manual-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Student ID
            </label>
            <input
              id="manual-input"
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="2025-0000206"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualSubmit()
                }
              }}
            />
          </div>

          {scannedData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Student ID Processed!
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Student ID:</strong> {scannedData}
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Session:</strong> {getSessionLabel(selectedSession)}
                  </p>
                  <p className="text-xs text-green-700">
                    <strong>Gate:</strong> {gateLocation}
                  </p>
                  {notes && (
                    <p className="text-xs text-green-700">
                      <strong>Notes:</strong> {notes}
                    </p>
                  )}
                  <p className="text-xs text-green-700 mt-1">
                    Attendance processing...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {scannedData ? (
              <button
                onClick={resetScanner}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Enter Another ID
              </button>
            ) : (
              <button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
              >
                Submit ID
              </button>
            )}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              Enter student ID in format: <strong>2025-0000206</strong> (4-digit year, hyphen, 7-digit number)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
