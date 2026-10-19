import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
      default: 'Layers',
    },
    category: {
      type: String,
      default: 'Web Development',
    },
    startingPrice: {
      type: Number,
      default: null, // configurable, null when hidden
    },
    priceUnit: {
      type: String,
      default: 'per project',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    features: {
      type: [String],
      default: [],
    },
    deliverables: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: ['React', 'Node.js', 'Tailwind CSS'],
    },
    isPopular: {
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

serviceSchema.index({ isPublished: 1, displayOrder: 1 });

export const Service = mongoose.model('Service', serviceSchema);
