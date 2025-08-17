/**
 * QR Code validation and sanitization utilities
 * 
 * This module provides centralized QR code validation and sanitization
 * to ensure consistent handling across the application.
 */

export interface QRValidationResult {
  isValid: boolean
  sanitized: string
  error?: string
}

/**
 * Validates and sanitizes a QR code string
 * 
 * @param data - The raw QR code data to validate
 * @returns Validation result with sanitized data and error information
 */
export function validateAndSanitizeQR(data: string): QRValidationResult {
  // Remove any whitespace and normalize to uppercase
  const cleaned = data.trim().toUpperCase()
  
  // Check for basic format (starts with S followed by 8 digits)
  const qrPattern = /^S\d{8}$/
  
  if (!qrPattern.test(cleaned)) {
    return {
      isValid: false,
      sanitized: cleaned,
      error: 'Invalid QR code format. Expected format: S12345678'
    }
  }
  
  // Additional validation: check if it's a reasonable student ID
  const idNumber = cleaned.substring(1) // Remove 'S' prefix
  const numericId = parseInt(idNumber, 10)
  
  // Validate student ID range (8-digit numbers from 10000000 to 99999999)
  if (numericId < 10000000 || numericId > 99999999) {
    return {
      isValid: false,
      sanitized: cleaned,
      error: 'Invalid student ID range. ID must be 8 digits.'
    }
  }
  
  return {
    isValid: true,
    sanitized: cleaned
  }
}

/**
 * Determines if a scanner error is a normal scanning attempt (no QR code visible)
 * or an actual error that should be reported to the user
 * 
 * @param error - The error message from the QR scanner
 * @returns true if this is a normal scanning error, false if it's a real error
 */
export function isNormalScanningError(error: string): boolean {
  return error.includes('NotFoundException') || 
         error.includes('No MultiFormat Readers') ||
         error.includes('QR code parse error')
}

/**
 * Categorizes scanner errors and returns appropriate user-friendly messages
 * 
 * @param error - The error message from the QR scanner
 * @returns Object with error category and user-friendly message
 */
export function categorizeScannerError(error: string): { category: string; message: string } {
  if (error.includes('NotAllowedError')) {
    return {
      category: 'permission',
      message: 'Camera permission denied. Please allow camera access.'
    }
  }
  
  if (error.includes('NotFoundError')) {
    return {
      category: 'not_found',
      message: 'Camera not found. Please check camera connection.'
    }
  }
  
  if (error.includes('NotReadableError')) {
    return {
      category: 'in_use',
      message: 'Camera is in use by another application.'
    }
  }
  
  return {
    category: 'unknown',
    message: `Scanner error: ${error}`
  }
}
