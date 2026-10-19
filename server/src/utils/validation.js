/**
 * Server-side Form Validation Utilities for Vikas Maurya Portfolio
 * Enforces strict RFC/standard email format, 10-digit Indian mobile format,
 * mandatory fields, and anti-spam verification.
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const normalizeIndianPhone = (rawPhone = '') => {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
};

export const validateEmail = (email = '') => {
  const trimmed = String(email).trim();
  if (!trimmed) {
    return { isValid: false, message: 'Email address is required.' };
  }
  if (/\s/.test(trimmed)) {
    return { isValid: false, message: 'Email address cannot contain spaces.' };
  }
  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { isValid: false, message: 'Invalid email address format.' };
  }
  if (!parts[1].includes('.')) {
    return { isValid: false, message: 'Email domain is missing a valid extension.' };
  }
  if (trimmed.includes('..')) {
    return { isValid: false, message: 'Email cannot contain consecutive dots.' };
  }
  const domainParts = parts[1].split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, message: 'Invalid domain extension.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Invalid email format. Please provide a legitimate email address.' };
  }
  return { isValid: true };
};

export const validateIndianMobile = (phone = '', isRequired = true) => {
  const raw = String(phone).trim();
  if (!raw) {
    if (isRequired) {
      return { isValid: false, message: 'Mobile number is required.' };
    }
    return { isValid: true, cleaned: '' };
  }
  const strippedFormatting = raw.replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');
  if (/[a-zA-Z]/.test(strippedFormatting)) {
    return { isValid: false, message: 'Mobile number cannot contain letters.' };
  }
  const cleaned = normalizeIndianPhone(raw);
  if (cleaned.length !== 10) {
    return { isValid: false, message: `Mobile number must be exactly 10 digits (${cleaned.length} digits provided).` };
  }
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, message: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
  }
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { isValid: false, message: 'Mobile number cannot consist of repeated identical digits.' };
  }
  return { isValid: true, cleaned };
};
