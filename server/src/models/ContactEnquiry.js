import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address format'],
    },
    phone: {
      type: String,
      required: [true, '10-digit Indian mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
    serviceRequired: {
      type: String,
      required: [true, 'Service required selection is required'],
      trim: true,
    },
    budgetRange: {
      type: String,
      default: 'Flexible / To discuss',
    },
    expectedCompletionDate: {
      type: String,
      default: '',
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: 3000,
    },
    selectedTemplate: {
      type: String,
      default: '',
    },
    privacyConsent: {
      type: Boolean,
      required: [true, 'Privacy policy consent is required'],
      default: false,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Responded', 'Closed'],
      default: 'New',
    },
    internalNotes: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });

export const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);
