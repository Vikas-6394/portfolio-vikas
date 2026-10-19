import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Programming Languages', 'Tools & DevOps', 'Security & Fundamentals'],
      required: true,
    },
    proficiencyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    levelLabel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Proficient', 'Expert'],
      default: 'Proficient',
    },
    iconName: {
      type: String,
      default: 'Code',
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

skillSchema.index({ category: 1, displayOrder: 1 });

export const Skill = mongoose.model('Skill', skillSchema);
