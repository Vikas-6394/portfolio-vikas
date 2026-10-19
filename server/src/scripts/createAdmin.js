import readline from 'readline';
import { connectDB, closeDB } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n=== SECURE ADMIN CREATION CLI ===\n');
  await connectDB();

  try {
    const name = await question('Admin Full Name [Mr. Vikas Maurya]: ') || 'Mr. Vikas Maurya';
    const email = await question('Admin Email Address: ');
    const password = await question('Admin Password (min 8 chars): ');

    if (!email || !password || password.length < 8) {
      console.log('❌ Error: Valid email and minimum 8-character password are required.');
      process.exit(1);
    }

    const existing = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`❌ Error: An admin user with email ${email} already exists.`);
      process.exit(1);
    }

    const admin = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'superadmin',
    });

    console.log(`\n✅ Administrator created successfully!`);
    console.log(`ID: ${admin._id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    rl.close();
    await closeDB();
    process.exit(0);
  }
}

main();
