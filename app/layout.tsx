import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Attendance System',
  description: 'College attendance tracking system using QR codes',
  icons: {
    icon: '/bgfc-logo.png',
    shortcut: '/bgfc-logo.png',
    apple: '/bgfc-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
