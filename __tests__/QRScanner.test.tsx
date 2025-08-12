import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QRScanner from '@/components/qr/QRScanner'

// Mock the toast function
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}))

describe('QRScanner Component', () => {
  const mockOnScan = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders QR scanner with camera and manual modes', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('QR Code Scanner')).toBeInTheDocument()
    expect(screen.getByText('Camera')).toBeInTheDocument()
    expect(screen.getByText('Manual/USB')).toBeInTheDocument()
  })

  it('switches to manual mode when manual button is clicked', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    const manualButton = screen.getByText('Manual/USB')
    fireEvent.click(manualButton)
    
    expect(screen.getByText('Enter QR Code or Scan with USB Scanner')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('S20250001 or scan with USB scanner')).toBeInTheDocument()
  })

  it('shows USB scanner instructions in manual mode', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    const manualButton = screen.getByText('Manual/USB')
    fireEvent.click(manualButton)
    
    expect(screen.getByText('USB Scanner Support')).toBeInTheDocument()
    expect(screen.getByText(/Connect a USB QR scanner/)).toBeInTheDocument()
  })

  it('displays gate location when provided', () => {
    render(<QRScanner onScan={mockOnScan} gateLocation="Side Gate" />)
    
    expect(screen.getByText('Side Gate')).toBeInTheDocument()
  })

  it('shows instructions for both scanning modes', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    expect(screen.getByText('Instructions')).toBeInTheDocument()
    expect(screen.getByText(/Camera Mode/)).toBeInTheDocument()
    expect(screen.getByText(/Manual\/USB Mode/)).toBeInTheDocument()
  })

  it('has proper form elements in manual mode', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    const manualButton = screen.getByText('Manual/USB')
    fireEvent.click(manualButton)
    
    const input = screen.getByPlaceholderText('S20250001 or scan with USB scanner')
    const submitButton = screen.getByText('Submit QR Code')
    
    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled() // Initially disabled when no input
  })

  it('enables submit button when manual input is provided', () => {
    render(<QRScanner onScan={mockOnScan} />)
    
    const manualButton = screen.getByText('Manual/USB')
    fireEvent.click(manualButton)
    
    const input = screen.getByPlaceholderText('S20250001 or scan with USB scanner')
    const submitButton = screen.getByText('Submit QR Code')
    
    fireEvent.change(input, { target: { value: 'S20250001' } })
    
    expect(submitButton).not.toBeDisabled()
  })
})
