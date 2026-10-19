import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagLine: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullCaseStudy: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Full Stack MERN', 'Frontend Web App', 'E-commerce', 'Landing Page', 'Business Website', 'Open Source'],
      default: 'Full Stack MERN',
    },
    technologies: {
      type: [String],
      required: true,
      default: ['React', 'Node.js', 'Express', 'MongoDB'],
    },
    features: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
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

projectSchema.index({ isPublished: 1, isFeatured: 1, displayOrder: 1 });

export const Project = mongoose.model('Project', projectSchema);
