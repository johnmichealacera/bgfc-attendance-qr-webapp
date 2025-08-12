'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { QrCode, Camera, Keyboard, CheckCircle } from 'lucide-react'
import { Html5QrcodeScanner } from 'html5-qrcode'

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
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-focus on manual input for USB scanner support
    if (scanMode === 'manual') {
      const input = document.getElementById('manual-qr-input')
      if (input) {
        input.focus()
      }
    }
  }, [scanMode])

  const startCamera = () => {
    if (scannerContainerRef.current && !scannerRef.current) {
      try {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        )

        scannerRef.current.render(
          (decodedText) => {
            if (decodedText && !isProcessing) {
              handleScan(decodedText)
            }
          },
          (error) => {
            // Ignore scanning errors
          }
        )

        setIsScanning(true)
      } catch (error) {
        console.error('Error starting camera:', error)
        toast.error('Unable to start camera. Please check permissions.')
        setScanMode('manual')
      }
    }
  }

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScan(manualInput.trim())
      setManualInput('')
    }
  }

  const handleScan = async (data: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    setScannedData(data)
    
    try {
      // Validate QR code format (S<8-digit-ID>)
      if (!/^S\d{8}$/.test(data)) {
        toast.error('Invalid QR code format. Expected format: S12345678')
        return
      }

      // Call the onScan callback
      onScan(data)
      
      // Show success feedback
      toast.success(`QR Code scanned: ${data}`)
      
      // Reset after successful scan
      setTimeout(() => {
        setScannedData('')
        setIsProcessing(false)
      }, 2000)
      
    } catch (error) {
      console.error('Error processing QR code:', error)
      toast.error('Error processing QR code. Please try again.')
      setIsProcessing(false)
    }
  }



  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [scanMode])

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
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <div 
                ref={scannerContainerRef}
                id="qr-reader"
                className="w-full h-64"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <div className="text-center text-white">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Camera not available</p>
                  </div>
                </div>
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
                  placeholder="S20250001 or scan with USB scanner"
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
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-success-600" />
              <div>
                <p className="font-medium text-gray-900">QR Code Scanned Successfully</p>
                <p className="text-sm text-gray-600 font-mono">{scannedData}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Camera Mode:</strong> Use your device camera to scan QR codes</li>
            <li>• <strong>Manual/USB Mode:</strong> Type QR codes manually or use a USB scanner</li>
            <li>• QR codes should be in the format: S12345678</li>
            <li>• Ensure good lighting and clear QR code for camera scanning</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
