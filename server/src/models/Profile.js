import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: 'Mr. Vikas Maurya',
      trim: true,
    },
    headline: {
      type: String,
      default: 'Web Developer | Website Designer | MERN Stack Developer',
      trim: true,
    },
    subHeadline: {
      type: String,
      default: 'I build modern, responsive and user-friendly websites for businesses, creators and individuals.',
      trim: true,
    },
    heroHeading: {
      type: String,
      default: "Hi, I'm Mr. Vikas Maurya.",
    },
    heroTitle: {
      type: String,
      default: 'I Create Modern Websites That Help Businesses Grow.',
    },
    heroDescription: {
      type: String,
      default:
        'I build responsive, user-friendly websites tailored to personal brands, startups, coaching institutes, and businesses. From custom UI/UX design to robust full-stack web solutions, I craft high-speed digital experiences engineered to turn visitors into loyal clients. Every project is built with clean code, modern aesthetics, and SEO optimization to help your brand stand out and scale.',
    },
    bio: {
      type: String,
      default: 'Passionate MERN stack web developer with a keen eye for modern UI/UX design, performance optimization, and clean architecture. I love turning ideas into fast, elegant, and secure digital products.',
    },
    aboutIntro: {
      type: String,
      default: 'I am a web developer specializing in the MERN stack (MongoDB, Express, React, Node.js) with hands-on proficiency in Tailwind CSS, modern JavaScript, and responsive design systems. My focus is delivering production-ready, accessible, and fast websites that deliver measurable value for clients.',
    },
    background: {
      type: String,
      default: 'Computer Science & Engineering background with deep interest in full-stack web architectures, algorithms, and practical web security fundamentals.',
    },
    areasOfInterest: {
      type: [String],
      default: ['Full-Stack Web Development', 'Frontend Architecture & UI/UX', 'REST API Engineering', 'Performance Optimization', 'Cybersecurity Fundamentals'],
    },
    careerGoals: {
      type: String,
      default: 'To create high-impact web products, partner with growing businesses on custom web solutions, and continuously master cutting-edge modern web technologies.',
    },
    currentLearning: {
      type: String,
      default: 'Exploring Next.js App Router, advanced TypeScript patterns, microservice architectures, and Cloud Native deployments.',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'India',
    },
    email: {
      type: String,
      default: 'vikasmaurya195771@gmail.com',
    },
    phone: {
      type: String,
      default: '+91 6394195771',
    },
    whatsappNumber: {
      type: String,
      default: '916394195771',
    },
    availabilityStatus: {
      type: String,
      enum: ['Available for Freelance', 'Available for Full-time', 'Busy with Projects', 'Open to Collaborations'],
      default: 'Available for Freelance',
    },
    yearsExperience: {
      type: Number,
      default: 2,
    },
    completedProjects: {
      type: Number,
      default: 15,
    },
    clientSatisfaction: {
      type: Number,
      default: 100,
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      codepen: { type: String, default: 'https://codepen.io' },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
