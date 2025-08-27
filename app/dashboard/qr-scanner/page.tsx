'use client'

import EnhancedQRScanner from '@/components/dashboard/EnhancedQRScanner'
import Navigation from '@/components/layout/Navigation'

export default function QRScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <EnhancedQRScanner />
    </div>
  )
}