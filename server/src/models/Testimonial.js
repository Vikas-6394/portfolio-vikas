import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientRole: {
      type: String,
      trim: true,
      default: 'Business Owner',
    },
    clientCompany: {
      type: String,
      trim: true,
      default: '',
    },
    clientAvatar: {
      type: String,
      default: '',
    },
    testimonialText: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    projectTitle: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: false, // Requires admin moderation before being visible on public site
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ isApproved: 1, isFeatured: 1, displayOrder: 1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
