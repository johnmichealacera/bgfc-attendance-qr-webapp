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
  // Remove any whitespace and normalize
  const cleaned = data.trim()
  
  // Check for basic format (YYYY-NNNNNNN: 4-digit year, hyphen, 7-digit number)
  const qrPattern = /^\d{4}-\d{7}$/
  
  if (!qrPattern.test(cleaned)) {
    return {
      isValid: false,
      sanitized: cleaned,
      error: `Invalid QR code format. Student ID: ${cleaned}`
    }
  }
  
  // Extract year and ID parts
  const [, idStr] = cleaned.split('-')
  
  // Validate ID string length (should be exactly 7 digits)
  if (idStr.length !== 7) {
    return {
      isValid: false,
      sanitized: cleaned,
      error: 'Invalid ID number. Must be exactly 7 digits.'
    }
  }
  
  // Validate that ID contains only digits
  if (!/^\d{7}$/.test(idStr)) {
    return {
      isValid: false,
      sanitized: cleaned,
      error: 'Invalid ID number. Must contain only digits.'
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
