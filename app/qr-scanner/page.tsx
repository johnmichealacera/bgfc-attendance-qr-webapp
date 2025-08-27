'use client'

import EnhancedQRScanner from '@/components/dashboard/EnhancedQRScanner'

export default function PublicQRScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedQRScanner />
    </div>
  )
}