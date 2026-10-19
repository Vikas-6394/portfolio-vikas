import sanitizeHtml from 'sanitize-html';
import { ContactEnquiry } from '../models/ContactEnquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { generateEnquiryReference } from '../utils/referenceGenerator.js';
import {
  sendEnquiryNotificationEmail,
  sendClientAcknowledgementEmail,
  sendOtpEmail,
} from '../config/mailer.js';
import {
  validateEmail,
  validateIndianMobile,
  normalizeIndianPhone,
} from '../utils/validation.js';
import {
  createOtp,
  verifyOtpCode,
  checkVerificationToken,
} from '../utils/otpStore.js';

// Public: Send OTP for Email and Mobile verification
export const sendOtp = async (req, res, next) => {
  try {
    const { email, phone, fullName } = req.body;

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: emailCheck.message,
      });
    }

    const phoneCheck = validateIndianMobile(phone, true);
    if (!phoneCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: phoneCheck.message,
      });
    }

    const { otp, expiresInSeconds } = createOtp(email, phoneCheck.cleaned);

    // Send email with OTP code
    await sendOtpEmail(email, otp, fullName ? sanitizeHtml(fullName, { allowedTags: [] }).trim() : 'Valued Client');

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${email} and +91 ${phoneCheck.cleaned}.`,
      expiresInSeconds,
      simulatedOtp: otp,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Verify entered OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;

    if (!email || !phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email, mobile number, and 6-digit OTP code are all required.',
      });
    }

    const phoneCleaned = normalizeIndianPhone(phone);
    const result = verifyOtpCode(email, phoneCleaned, otp);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      verificationToken: result.verificationToken,
      message: 'Mobile number and email address verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// Public: Submit enquiry
export const submitEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      serviceRequired,
      budgetRange,
      expectedCompletionDate,
      projectDescription,
      selectedTemplate,
      privacyConsent,
      verificationToken,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !serviceRequired || !projectDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, 10-digit Mobile Number, Service, and Project Details).',
      });
    }

    if (!privacyConsent) {
      return res.status(400).json({
        success: false,
        message: 'You must consent to the privacy policy to submit an enquiry.',
      });
    }

    // Backend validation for Email
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: emailCheck.message,
      });
    }

    // Backend validation for Indian Mobile
    const phoneCheck = validateIndianMobile(phone, true);
    if (!phoneCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: phoneCheck.message,
      });
    }

    // Sanitize user text inputs against XSS
    const cleanName = sanitizeHtml(fullName, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanDesc = sanitizeHtml(projectDescription, { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phoneCheck.cleaned;

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters.',
      });
    }

    if (cleanDesc.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Project description must contain at least 10 characters.',
      });
    }

    // Check duplicate submission within last 3 minutes
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const existingRecent = await ContactEnquiry.findOne({
      email: cleanEmail,
      projectDescription: cleanDesc,
      createdAt: { $gte: threeMinutesAgo },
    });

    if (existingRecent) {
      return res.status(409).json({
        success: false,
        message: 'A duplicate enquiry was recently submitted with this message. Please check your inbox or wait a moment.',
        referenceNumber: existingRecent.referenceNumber,
      });
    }

    // Check if verified via OTP
    const isVerified = verificationToken
      ? checkVerificationToken(cleanEmail, cleanPhone, verificationToken)
      : false;

    const referenceNumber = generateEnquiryReference();

    const enquiry = await ContactEnquiry.create({
      referenceNumber,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      isVerified,
      verificationToken: isVerified ? verificationToken : '',
      serviceRequired: sanitizeHtml(serviceRequired, { allowedTags: [] }),
      budgetRange: budgetRange ? sanitizeHtml(budgetRange, { allowedTags: [] }) : 'Flexible',
      expectedCompletionDate: expectedCompletionDate ? sanitizeHtml(expectedCompletionDate, { allowedTags: [] }) : '',
      projectDescription: cleanDesc,
      selectedTemplate: selectedTemplate ? sanitizeHtml(selectedTemplate, { allowedTags: [] }) : '',
      privacyConsent: true,
      ipAddress: req.ip || '',
    });

    // Attempt email notification (async without blocking DB persistence)
    try {
      const emailResult = await sendEnquiryNotificationEmail(enquiry);
      if (emailResult.success) {
        enquiry.emailSent = true;
      } else {
        enquiry.emailError = emailResult.error || 'SMTP delivery failed';
      }
      await enquiry.save({ validateBeforeSave: false });

      // Send client acknowledgment
      await sendClientAcknowledgementEmail(enquiry);
    } catch (mailErr) {
      console.error('Mail notification error:', mailErr.message);
      enquiry.emailError = mailErr.message;
      await enquiry.save({ validateBeforeSave: false });
    }

    res.status(201).json({
      success: true,
      message: 'Your project enquiry has been submitted successfully! Mr. Vikas Maurya will review it and get back to you shortly.',
      referenceNumber: enquiry.referenceNumber,
      isVerified,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all enquiries with filtering, search & pagination
export const getAllEnquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
        { serviceRequired: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ContactEnquiry.countDocuments(filter);
    const enquiries = await ContactEnquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get enquiry by ID
export const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }
    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update enquiry status and internal notes
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, internalNotes } = req.body;
    const enquiry = await ContactEnquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    if (status) enquiry.status = status;
    if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;

    await enquiry.save();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'UPDATE_STATUS',
      resource: 'Enquiry',
      resourceId: enquiry._id,
      details: `Updated enquiry ${enquiry.referenceNumber} to status: ${status}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully',
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete enquiry
export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await ContactEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    await enquiry.deleteOne();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'DELETE',
      resource: 'Enquiry',
      resourceId: req.params.id,
      details: `Deleted enquiry ${enquiry.referenceNumber}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get enquiry summary metrics
export const getEnquiryStats = async (req, res, next) => {
  try {
    const total = await ContactEnquiry.countDocuments();
    const newCount = await ContactEnquiry.countDocuments({ status: 'New' });
    const inProgressCount = await ContactEnquiry.countDocuments({ status: 'In Progress' });
    const respondedCount = await ContactEnquiry.countDocuments({ status: 'Responded' });
    const closedCount = await ContactEnquiry.countDocuments({ status: 'Closed' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        inProgress: inProgressCount,
        responded: respondedCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
