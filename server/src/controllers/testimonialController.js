import { Testimonial } from '../models/Testimonial.js';
import { AuditLog } from '../models/AuditLog.js';

// Public: Get approved testimonials
export const getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all testimonials (pending moderation + approved)
export const getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ isApproved: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Submit a testimonial (requires admin approval)
export const submitTestimonial = async (req, res, next) => {
  try {
    const { clientName, clientRole, clientCompany, testimonialText, rating, projectTitle } = req.body;

    const testimonial = await Testimonial.create({
      clientName,
      clientRole: clientRole || 'Client',
      clientCompany: clientCompany || '',
      testimonialText,
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      projectTitle: projectTitle || '',
      isApproved: false, // Default requires moderation
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted and will appear on the website once approved by Vikas.',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve / Unapprove testimonial
export const toggleApproval = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'MODERATE',
      resource: 'Testimonial',
      resourceId: testimonial._id,
      details: `Testimonial approval set to: ${testimonial.isApproved}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.isApproved ? 'approved' : 'unapproved'} successfully`,
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create testimonial directly
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create({
      ...req.body,
      isApproved: req.body.isApproved ?? true,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update testimonial
export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete testimonial
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
