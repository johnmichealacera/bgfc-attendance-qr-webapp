import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2025 QR Attendance System. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Powered by</span>
            <Link 
              href="https://www.localwebventures.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/LocalWebVentures-logo.png"
                alt="LocalWebVentures"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
