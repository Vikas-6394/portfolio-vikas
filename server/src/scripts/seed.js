import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import { ENV } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { Template } from '../models/Template.js';
import { Testimonial } from '../models/Testimonial.js';
import { SiteSetting } from '../models/SiteSetting.js';
import {
  defaultProfileData,
  defaultSkillsData,
  defaultServicesData,
  defaultProjectsData,
  defaultTemplatesData,
  defaultTestimonialsData,
} from '../utils/seedData.js';

export const runSeed = async () => {
  console.log('🌱 Starting Database Seeding for Mr. Vikas Maurya Portfolio...');
  if (mongoose.connection.readyState !== 1) {
    const conn = await connectDB();
    if (!conn) {
      console.error('Database connection failed. Aborting seed.');
      return;
    }
  }

  try {
    // 1. Admin User
    const existingAdmin = await AdminUser.findOne({ email: ENV.ADMIN_DEFAULT_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      await AdminUser.create({
        name: 'Mr. Vikas Maurya',
        email: ENV.ADMIN_DEFAULT_EMAIL,
        password: ENV.ADMIN_DEFAULT_PASSWORD,
        role: 'superadmin',
      });
      console.log(`👤 Admin created: ${ENV.ADMIN_DEFAULT_EMAIL}`);
    } else {
      existingAdmin.name = 'Mr. Vikas Maurya';
      await existingAdmin.save();
      console.log(`👤 Admin updated to Mr. Vikas Maurya: ${existingAdmin.email}`);
    }

    // 2. Profile
    await Profile.deleteMany({});
    await Profile.create(defaultProfileData);
    console.log('📄 Profile data seeded.');

    // 3. Site Settings
    await SiteSetting.deleteMany({});
    await SiteSetting.create({});
    console.log('⚙️ Site settings seeded.');

    // 4. Skills
    await Skill.deleteMany({});
    await Skill.insertMany(defaultSkillsData);
    console.log(`⚡ ${defaultSkillsData.length} Skills seeded.`);

    // 5. Services
    await Service.deleteMany({});
    await Service.insertMany(defaultServicesData);
    console.log(`💼 ${defaultServicesData.length} Services seeded.`);

    // 6. Projects
    await Project.deleteMany({});
    await Project.insertMany(defaultProjectsData);
    console.log(`🚀 ${defaultProjectsData.length} Projects seeded.`);

    // 7. Templates
    await Template.deleteMany({});
    await Template.insertMany(defaultTemplatesData);
    console.log(`🎨 ${defaultTemplatesData.length} Templates seeded.`);

    // 8. Testimonials
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(defaultTestimonialsData);
    console.log(`⭐ ${defaultTestimonialsData.length} Testimonials seeded.`);

    console.log('✅ Database Seeding Completed Successfully!\n');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed().then(async () => {
    await closeDB();
    process.exit(0);
  });
}
