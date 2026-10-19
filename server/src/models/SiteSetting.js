import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'Mr. Vikas Maurya Portfolio',
    },
    metaTitle: {
      type: String,
      default: 'Mr. Vikas Maurya | Web Developer & MERN Stack Specialist',
    },
    metaDescription: {
      type: String,
      default: 'Professional web development services by Mr. Vikas Maurya. Modern responsive websites, custom MERN applications, web templates, and website redesign.',
    },
    keywords: {
      type: [String],
      default: [
        'Mr. Vikas Maurya',
        'Vikas Maurya',
        'Web Developer',
        'Website Designer',
        'MERN Stack Developer',
        'Freelance Web Developer',
        'React Developer',
        'Tailwind CSS',
        'Portfolio Websites',
        'Business Websites',
      ],
    },
    ogImage: {
      type: String,
      default: '/og-image.png',
    },
    googleAnalyticsId: {
      type: String,
      default: '',
    },
    enableTestimonialSubmission: {
      type: Boolean,
      default: true,
    },
    enableHireMeModal: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
