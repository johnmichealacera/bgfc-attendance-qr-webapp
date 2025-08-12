'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import QRScanner from '@/components/qr/QRScanner'
import { Clock, MapPin, User, CheckCircle, QrCode } from 'lucide-react'

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  timestamp: string
  gateLocation: string
}

export default function PublicQRScannerPage() {
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>([])
  const [gateLocation, setGateLocation] = useState('Main Gate')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleQRScan = async (qrData: string) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/attendance/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode: qrData,
          gateLocation,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add to recent scans
        const newRecord: AttendanceRecord = {
          id: data.id,
          studentId: data.studentId,
          studentName: data.studentName,
          timestamp: new Date().toISOString(),
          gateLocation: data.gateLocation,
        }
        
        setRecentScans(prev => [newRecord, ...prev.slice(0, 4)])
        toast.success(`Attendance logged for ${data.studentName}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to log attendance')
      }
    } catch (error) {
      console.error('Error logging attendance:', error)
      toast.error('Error logging attendance. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const gateLocations = [
    'Main Gate',
    'Side Gate',
    'Back Gate',
    'Faculty Entrance',
    'Student Entrance',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QR Attendance System</span>
            </div>
            <div className="text-sm text-gray-600">
              Public Access - No Login Required
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Gate QR Scanner</h1>
          <p className="text-gray-600">Scan student QR codes to log attendance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Scanner */}
          <div className="lg:col-span-2">
            <QRScanner onScan={handleQRScan} gateLocation={gateLocation} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gate Location Selector */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Gate Location
              </h3>
              <select
                value={gateLocation}
                onChange={(e) => setGateLocation(e.target.value)}
                className="input-field"
              >
                {gateLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Recent Scans */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Scans
              </h3>
              {recentScans.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent scans</p>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-success-600" />
                        <span className="font-medium text-gray-900">{scan.studentName}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>ID: {scan.studentId}</p>
                        <p>Gate: {scan.gateLocation}</p>
                        <p>Time: {new Date(scan.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Total Scans</span>
                  <span className="font-semibold text-gray-900">{recentScans.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Current Gate</span>
                  <span className="font-semibold text-primary-600">{gateLocation}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Last Scan</span>
                  <span className="font-semibold text-gray-900">
                    {recentScans.length > 0 
                      ? new Date(recentScans[0].timestamp).toLocaleTimeString()
                      : 'None'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure good lighting for camera scanning</li>
                <li>• Hold QR code steady within the frame</li>
                <li>• USB scanners work in Manual mode</li>
                <li>• Check gate location before scanning</li>
                <li>• Students can scan their QR codes</li>
              </ul>
            </div>

            {/* Admin Access */}
            <div className="card bg-gray-50 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access</h3>
              <p className="text-sm text-gray-600 mb-3">
                For administrators and faculty members who need to access the full dashboard:
              </p>
              <a 
                href="/"
                className="btn-primary w-full text-center block"
              >
                Go to Admin Login
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
