/**
 * Ghanaian Phone Number Utilities
 *
 * Handles validation and E.164 normalization for Ghanaian phone numbers.
 * Supported inputs:
 *  - Local: 0XXXXXXXXX (10 digits, e.g. 024XXXXXXX, 055XXXXXXX)
 *  - International with +: +233XXXXXXXXX (+233 followed by 9 digits)
 *  - International without +: 233XXXXXXXXX (233 followed by 9 digits)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Strips all non-digit and non-plus characters (spaces, hyphens, parentheses).
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.trim().replace(/[\s\-()]/g, '');
}

/**
 * Validates whether a given string is a valid Ghanaian mobile phone number.
 */
export function validateGhanaPhone(phone: string): PhoneValidationResult {
  const sanitized = sanitizePhoneNumber(phone);

  if (!sanitized) {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  // Regex patterns:
  // Local format: 0 followed by 2, 3, or 5, then 8 digits (total 10 digits)
  const localPattern = /^0[235]\d{8}$/;

  // International format with +: +233 followed by 2, 3, or 5, then 8 digits
  const intlWithPlusPattern = /^\+233[235]\d{8}$/;

  // International format without +: 233 followed by 2, 3, or 5, then 8 digits
  const intlNoPlusPattern = /^233[235]\d{8}$/;

  if (localPattern.test(sanitized)) {
    const normalized = `+233${sanitized.slice(1)}`;
    return {
      isValid: true,
      normalized,
    };
  }

  if (intlWithPlusPattern.test(sanitized)) {
    return {
      isValid: true,
      normalized: sanitized,
    };
  }

  if (intlNoPlusPattern.test(sanitized)) {
    return {
      isValid: true,
      normalized: `+${sanitized}`,
    };
  }

  // If none matched, provide actionable diagnostic error message
  if (sanitized.startsWith('0') && sanitized.length !== 10) {
    return {
      isValid: false,
      error: `Local Ghanaian numbers must be 10 digits (currently ${sanitized.length})`,
    };
  }

  if ((sanitized.startsWith('+233') || sanitized.startsWith('233')) && sanitized.replace('+', '').length !== 12) {
    return {
      isValid: false,
      error: 'International Ghanaian numbers must have 9 digits after +233',
    };
  }

  return {
    isValid: false,
    error: 'Enter a valid Ghanaian number (e.g. 024XXXXXXX or +23324XXXXXXX)',
  };
}

/**
 * Normalizes a Ghanaian phone number to E.164 format (+233XXXXXXXXX).
 * Returns empty string if invalid.
 */
export function normalizeGhanaPhone(phone: string): string {
  const result = validateGhanaPhone(phone);
  return result.isValid && result.normalized ? result.normalized : '';
}

/**
 * Quick boolean check if a phone number is valid.
 */
export function isValidGhanaPhone(phone: string): boolean {
  return validateGhanaPhone(phone).isValid;
}

