import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EnhancedQRScanner from '@/components/dashboard/EnhancedQRScanner'

// Mock the toast function
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('EnhancedQRScanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders enhanced QR scanner with session configuration', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('Enhanced QR Attendance Scanner')).toBeInTheDocument()
    expect(screen.getByText('Session Configuration')).toBeInTheDocument()
    expect(screen.getByText('Morning In')).toBeInTheDocument()
    expect(screen.getByText('Morning Out')).toBeInTheDocument()
    expect(screen.getByText('Afternoon In')).toBeInTheDocument()
    expect(screen.getByText('Afternoon Out')).toBeInTheDocument()
  })

  it('displays gate location selector', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('Gate Location')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Main Gate')).toBeInTheDocument()
  })

  it('shows notes input field', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('Notes (Optional)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Late arrival, early departure, etc.')).toBeInTheDocument()
  })

  it('displays scanner controls', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('Start Scanner')).toBeInTheDocument()
  })

  it('shows recent scans section', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('Recent Scans')).toBeInTheDocument()
    expect(screen.getByText('Download CSV')).toBeInTheDocument()
  })

  it('displays session time ranges', () => {
    render(<EnhancedQRScanner />)
    
    expect(screen.getByText('6:00 AM - 8:00 AM')).toBeInTheDocument()
    expect(screen.getByText('11:30 AM - 12:30 PM')).toBeInTheDocument()
    expect(screen.getByText('12:30 PM - 2:00 PM')).toBeInTheDocument()
    expect(screen.getByText('4:30 PM - 6:00 PM')).toBeInTheDocument()
  })
})
