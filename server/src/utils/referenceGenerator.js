import crypto from 'crypto';

export const generateEnquiryReference = () => {
  const year = new Date().getFullYear();
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `VM-${year}-${randomChars}`;
};
