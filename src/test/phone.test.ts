import { describe, it, expect } from 'vitest';
import { validateGhanaPhone, normalizeGhanaPhone, isValidGhanaPhone } from '../utils/phone';

describe('Ghanaian Phone Validation & Normalization', () => {
  it('accepts valid 10-digit local format (024, 055, 050, 027, etc.) and normalizes to +233', () => {
    const res1 = validateGhanaPhone('0241234567');
    expect(res1.isValid).toBe(true);
    expect(res1.normalized).toBe('+233241234567');

    const res2 = validateGhanaPhone('0559876543');
    expect(res2.isValid).toBe(true);
    expect(res2.normalized).toBe('+233559876543');

    const res3 = validateGhanaPhone('0302123456');
    expect(res3.isValid).toBe(true);
    expect(res3.normalized).toBe('+233302123456');
  });

  it('accepts valid international format with + (+233241234567)', () => {
    const res = validateGhanaPhone('+233241234567');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+233241234567');
  });

  it('accepts valid international format without + (233241234567)', () => {
    const res = validateGhanaPhone('233241234567');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+233241234567');
  });

  it('handles spaces and hyphens gracefully', () => {
    const res = validateGhanaPhone('+233 24 123 4567');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+233241234567');

    const res2 = validateGhanaPhone('024-123-4567');
    expect(res2.isValid).toBe(true);
    expect(res2.normalized).toBe('+233241234567');
  });

  it('rejects invalid numbers and provides helpful errors', () => {
    // Empty
    expect(validateGhanaPhone('').isValid).toBe(false);

    // Too short local
    const shortLocal = validateGhanaPhone('02412345');
    expect(shortLocal.isValid).toBe(false);
    expect(shortLocal.error).toContain('10 digits');

    // Too long local
    const longLocal = validateGhanaPhone('024123456789');
    expect(longLocal.isValid).toBe(false);

    // Invalid prefix
    const invalidPrefix = validateGhanaPhone('0141234567');
    expect(invalidPrefix.isValid).toBe(false);

    // Letters
    expect(validateGhanaPhone('024abcdefg').isValid).toBe(false);
  });

  it('normalizeGhanaPhone and isValidGhanaPhone helper functions', () => {
    expect(isValidGhanaPhone('0241234567')).toBe(true);
    expect(isValidGhanaPhone('12345')).toBe(false);
    expect(normalizeGhanaPhone('0241234567')).toBe('+233241234567');
    expect(normalizeGhanaPhone('invalid')).toBe('');
  });
});

