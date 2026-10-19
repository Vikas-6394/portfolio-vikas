/**
 * Client-side Form Validation Utilities for Vikas Maurya Portfolio
 * Enforces strict email format, 10-digit Indian mobile number format,
 * mandatory fields, and real-time error messages.
 */

// Strict email regex with valid TLD requirement (at least 2 letters, no consecutive dots, proper domain)
export const EMAIL_REGEX = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

// Indian mobile regex: exactly 10 digits, starting with 6, 7, 8, or 9
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/**
 * Normalizes an Indian phone number string by extracting the 10-digit mobile number
 * Handles formats like: "9876543210", "+91 9876543210", "09876543210", "+91-98765-43210"
 */
export const normalizeIndianPhone = (rawPhone = '') => {
  if (!rawPhone) return '';
  // Remove all non-digits
  const digits = String(rawPhone).replace(/\D/g, '');
  
  // If user entered +91 or 91 with 12 digits total
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If user entered leading 0 with 11 digits total
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
};

/**
 * Validates an email address
 * @param {string} email
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateEmail = (email = '') => {
  const trimmed = String(email).trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Email address cannot contain spaces.' };
  }

  const parts = trimmed.split('@');
  if (parts.length === 1) {
    return { isValid: false, error: "Email is missing an '@' symbol." };
  }
  if (parts.length > 2) {
    return { isValid: false, error: "Email cannot contain multiple '@' symbols." };
  }

  const [localPart, domainPart] = parts;

  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Please enter the username before the @ symbol.' };
  }

  if (!domainPart || domainPart.length === 0) {
    return { isValid: false, error: 'Please enter the email domain (e.g., @gmail.com, @outlook.com).' };
  }

  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Domain must include an extension like .com, .in, or .org.' };
  }

  if (domainPart.endsWith('.')) {
    return { isValid: false, error: 'Domain cannot end with a period.' };
  }

  if (domainPart.startsWith('.')) {
    return { isValid: false, error: 'Domain cannot begin with a period.' };
  }

  if (trimmed.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots (..).' };
  }

  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Top-level domain extension must be at least 2 letters (e.g. .com, .in).' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., rahul@example.com).' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates an Indian mobile number
 * @param {string} phone
 * @param {boolean} isRequired
 * @returns {{ isValid: boolean, error: string, cleaned: string }}
 */
export const validateIndianMobile = (phone = '', isRequired = true) => {
  const raw = String(phone).trim();

  if (!raw) {
    if (isRequired) {
      return { isValid: false, error: 'Mobile number is required.', cleaned: '' };
    }
    return { isValid: true, error: '', cleaned: '' };
  }

  // Check if non-digits (excluding optional leading '+' or spaces/hyphens) were entered
  const strippedFormatting = raw.replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');
  if (/[a-zA-Z]/.test(strippedFormatting)) {
    return { isValid: false, error: 'Mobile number cannot contain letters.', cleaned: '' };
  }
  if (/[^\d]/.test(strippedFormatting)) {
    return { isValid: false, error: 'Mobile number cannot contain special symbols.', cleaned: '' };
  }

  const cleaned = normalizeIndianPhone(raw);

  if (cleaned.length < 10) {
    return {
      isValid: false,
      error: `Mobile number must be exactly 10 digits (${cleaned.length}/10 entered).`,
      cleaned,
    };
  }

  if (cleaned.length > 10) {
    return {
      isValid: false,
      error: `Mobile number cannot exceed 10 digits (${cleaned.length} digits entered).`,
      cleaned,
    };
  }

  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Valid Indian mobile numbers must start with 6, 7, 8, or 9.',
      cleaned,
    };
  }

  // Check repeating fake digits e.g. 9999999999, 8888888888
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a genuine mobile number, not repeated digits.',
      cleaned,
    };
  }

  return { isValid: true, error: '', cleaned };
};

/**
 * Validates a person's full name
 */
export const validateFullName = (name = '') => {
  const trimmed = String(name).trim();

  if (!trimmed) {
    return { isValid: false, error: 'Full name is required.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters long.' };
  }

  if (trimmed.length > 80) {
    return { isValid: false, error: 'Full name cannot exceed 80 characters.' };
  }

  if (/[0-9]/.test(trimmed)) {
    return { isValid: false, error: 'Full name cannot contain numbers.' };
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Full name can only contain letters, spaces, and hyphens.' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates project description / message
 */
export const validateProjectDescription = (description = '') => {
  const trimmed = String(description).trim();

  if (!trimmed) {
    return { isValid: false, error: 'Project description is required.' };
  }

  if (trimmed.length < 10) {
    return {
      isValid: false,
      error: `Please describe your project in at least 10 characters (${trimmed.length}/10).`,
    };
  }

  if (trimmed.length > 3000) {
    return { isValid: false, error: 'Project description cannot exceed 3,000 characters.' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates service required selection
 */
export const validateServiceRequired = (service = '') => {
  if (!service || !String(service).trim()) {
    return { isValid: false, error: 'Please select the service you require.' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validates privacy policy consent
 */
export const validatePrivacyConsent = (consent = false) => {
  if (!consent) {
    return { isValid: false, error: 'You must accept the privacy policy to submit your enquiry.' };
  }
  return { isValid: true, error: '' };
};

/**
 * Complete validator for Enquiry Form
 */
export const validateEnquiryForm = (formData = {}) => {
  const nameResult = validateFullName(formData.fullName);
  const emailResult = validateEmail(formData.email);
  const phoneResult = validateIndianMobile(formData.phone, true);
  const serviceResult = validateServiceRequired(formData.serviceRequired);
  const descResult = validateProjectDescription(formData.projectDescription);
  const consentResult = validatePrivacyConsent(formData.privacyConsent);

  const errors = {};
  if (!nameResult.isValid) errors.fullName = nameResult.error;
  if (!emailResult.isValid) errors.email = emailResult.error;
  if (!phoneResult.isValid) errors.phone = phoneResult.error;
  if (!serviceResult.isValid) errors.serviceRequired = serviceResult.error;
  if (!descResult.isValid) errors.projectDescription = descResult.error;
  if (!consentResult.isValid) errors.privacyConsent = consentResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedPhone: phoneResult.cleaned || formData.phone,
  };
};
