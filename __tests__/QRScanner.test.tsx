import { render, screen, fireEvent } from '@testing-library/react'
import QRScanner from '@/components/qr/QRScanner'

// Mock the toast function
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}))

describe('Enhanced QRScanner Component', () => {
  const mockOnScan = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders enhanced QR scanner with session configuration', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('Session Configuration')).toBeInTheDocument()
    expect(screen.getByText('Morning In')).toBeInTheDocument()
    expect(screen.getByText('Morning Out')).toBeInTheDocument()
    expect(screen.getByText('Afternoon In')).toBeInTheDocument()
    expect(screen.getByText('Afternoon Out')).toBeInTheDocument()
  })

  it('displays gate location selector', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('Gate Location')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Main Gate')).toBeInTheDocument()
  })

  it('shows notes input field', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('Notes (Optional)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Late arrival, early departure, etc.')).toBeInTheDocument()
  })

  it('displays camera and manual input mode toggle', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('Camera')).toBeInTheDocument()
    expect(screen.getByText('Manual Input')).toBeInTheDocument()
  })

  it('shows session time ranges', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('6:00 AM - 8:00 AM')).toBeInTheDocument()
    expect(screen.getByText('11:30 AM - 12:30 PM')).toBeInTheDocument()
    expect(screen.getByText('12:30 PM - 2:00 PM')).toBeInTheDocument()
    expect(screen.getByText('4:30 PM - 6:00 PM')).toBeInTheDocument()
  })

  it('allows switching between camera and manual modes', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    const manualButton = screen.getByText('Manual Input')
    fireEvent.click(manualButton)
    
    expect(screen.getByText('Enter Student ID')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('2025-0000206')).toBeInTheDocument()
  })
})
