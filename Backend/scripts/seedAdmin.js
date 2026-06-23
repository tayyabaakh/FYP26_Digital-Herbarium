/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────
 * Admin Seed Script
 *
 * PURPOSE:
 * Creates the one and only admin account directly
 * in the database. Admin can NEVER register through
 * the public signup API. This script is the only
 * legitimate way to create an admin.
 *
 * USAGE:
 *   node scripts/seedAdmin.js
 *
 * SAFETY:
 * - Checks if admin already exists before inserting
 * - Will NOT create duplicate admins
 * - Will NOT overwrite existing admin
 * - Exits cleanly after completion
 */

const bcrypt   = require('bcryptjs');
const pool     = require('../config/db');
require('dotenv').config();

// ─── Validate Environment Variables ──────────────────────────────────────────
const validateEnv = () => {
  const required = [
    'ADMIN_NAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n👉 Add them to your .env file and try again.');
    process.exit(1);
  }
};

// ─── Check If Admin Already Exists ───────────────────────────────────────────
const adminExists = async () => {
  const [rows] = await pool.query(
    `SELECT id, email, role 
     FROM users 
     WHERE role = 'admin' 
     LIMIT 1`
  );
  return rows.length > 0 ? rows[0] : null;
};

// ─── Insert Admin Into Database ───────────────────────────────────────────────
const insertAdmin = async (name, email, hashedPassword) => {
  const [result] = await pool.query(
    `INSERT INTO users 
      (name, email, password, role, is_active)
     VALUES 
      (?, ?, ?, 'admin', TRUE)`,
    [name, email, hashedPassword]
  );

  return result.insertId;
};

// ─── Main Seed Function ───────────────────────────────────────────────────────
const seedAdmin = async () => {
  console.log('\n🌿 KUH Pakistan – Admin Seeder');
  console.log('─'.repeat(45));

  try {
    // Step 1: Validate environment variables
    console.log('\n📋 Step 1: Validating environment variables...');
    validateEnv();
    console.log('   ✅ All required variables present');

    // Step 2: Check if admin already exists
    console.log('\n🔍 Step 2: Checking for existing admin...');
    const existing = await adminExists();

    if (existing) {
      console.log('   ⚠️  Admin already exists. Seeding skipped.');
      console.log(`   📧 Email : ${existing.email}`);
      console.log(`   🆔 ID    : ${existing.id}`);
      console.log(`   👤 Role  : ${existing.role}`);
      console.log('\n✅ Database is already seeded. No changes made.\n');
      process.exit(0);
    }

    console.log('   ✅ No existing admin found. Proceeding...');

    // Step 3: Read credentials from environment
    const name     = process.env.ADMIN_NAME.trim();
    const email    = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD.trim();

    console.log('\n🔐 Step 3: Hashing admin password...');

    // Salt rounds = 12 (production-grade; 10 is minimum, 12 is recommended)
    const saltRounds   = 12;
    const salt         = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`   ✅ Password hashed with bcrypt (salt rounds: ${saltRounds})`);
    console.log(`   🔒 Hash preview: ${hashedPassword.substring(0, 20)}...`);

    // Step 4: Insert admin into database
    console.log('\n💾 Step 4: Inserting admin into database...');
    const adminId = await insertAdmin(name, email, hashedPassword);

    console.log('   ✅ Admin inserted successfully');

    // Step 5: Verify insertion
    console.log('\n🔎 Step 5: Verifying insertion...');
    const [verification] = await pool.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM users 
       WHERE id = ?`,
      [adminId]
    );

    if (verification.length === 0) {
      throw new Error('Verification failed — admin not found after insert');
    }

    const admin = verification[0];

    console.log('\n' + '─'.repeat(45));
    console.log('🎉 Admin seeded successfully!\n');
    console.log(`   🆔 ID         : ${admin.id}`);
    console.log(`   👤 Name       : ${admin.name}`);
    console.log(`   📧 Email      : ${admin.email}`);
    console.log(`   🎭 Role       : ${admin.role}`);
    console.log(`   ✅ Active     : ${admin.is_active ? 'Yes' : 'No'}`);
    console.log(`   🕐 Created At : ${admin.created_at}`);
    console.log('─'.repeat(45));
    console.log('\n⚠️  IMPORTANT REMINDERS:');
    console.log('   1. Remove ADMIN_PASSWORD from .env after seeding in production');
    console.log('   2. Never commit your .env file to version control');
    console.log('   3. Store admin credentials in a secure password manager\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);

    // Handle duplicate email error specifically
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   📧 An account with this email already exists.');
      console.error('   💡 Change ADMIN_EMAIL in .env and try again.');
    }

    process.exit(1);
  }
};

// ─── Run ──────────────────────────────────────────────────────────────────────
seedAdmin();