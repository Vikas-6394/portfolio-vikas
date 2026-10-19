import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Personal Portfolio',
        'Business Website',
        'Coaching Institute',
        'Education Website',
        'E-commerce Store',
        'Restaurant Website',
        'Travel and Tourism Website',
        'Landing Page',
        'Real Estate Website',
        'Blog Website',
      ],
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    previewImages: {
      type: [String],
      default: [],
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: ['React', 'Tailwind CSS', 'Vite'],
    },
    startingPrice: {
      type: Number,
      default: null, // configurable, null when hidden
    },
    currency: {
      type: String,
      default: 'USD',
    },
    availabilityStatus: {
      type: String,
      enum: ['Available Now', 'Customizable', 'Coming Soon', 'In Development'],
      default: 'Available Now',
    },
    demoRoute: {
      type: String,
      default: '', // Internal preview route, e.g. /templates/preview/coaching-institute
    },
    externalPreviewUrl: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
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

templateSchema.index({ category: 1, isPublished: 1, displayOrder: 1 });

export const Template = mongoose.model('Template', templateSchema);
