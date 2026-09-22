/**
 * Flora-Digitalis Pakistan
 * Auth Controller (Refactored for normalized DB)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─────────────────────────────────────────────
// JWT GENERATOR
// ─────────────────────────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─────────────────────────────────────────────
// SAFE USER RESPONSE
// ─────────────────────────────────────────────
const safeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
  role: user.role,
  isActive: user.is_active,
});

// ─────────────────────────────────────────────
// APPLY AS BOTANIST
// ─────────────────────────────────────────────
const applyAsBotanist = async (req, res) => {
  try {
    const {
      full_name,
      name, // Fallback in case frontend sends 'name'
      email,
      password,
      phone,
      institution,
      qualification,
      specialisation,
      experience_years,
      portfolio_url,
      document_url,
    } = req.body;

    // Support either full_name or name key
    const applicantName = (full_name || name || '').trim();

    // 1. Validate required fields
    if (
      !applicantName ||
      !email ||
      !password ||
      !phone ||
      !institution ||
      !qualification ||
      !specialisation ||
      !document_url
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // 2. Check if email already exists in users or pending applications
    const [existingUser] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [normalizedEmail]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const [existingApp] = await pool.query(
      `SELECT id FROM botanist_applications WHERE email = ? AND status = 'pending'`,
      [normalizedEmail]
    );

    if (existingApp.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An application with this email is already under review.',
      });
    }

    // 3. Hash password (to store safely until approved)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Insert into botanist_applications table ONLY
    const [result] = await pool.query(
      `INSERT INTO botanist_applications (
        full_name,
        email,
        password,
        phone,
        institution,
        qualification,
        specialisation,
        experience_years,
        portfolio_url,
        document_url,
        status,
        applied_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        applicantName,
        normalizedEmail,
        hashedPassword,
        phone,
        institution,
        qualification,
        specialisation,
        experience_years || null,
        portfolio_url || null,
        document_url,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Botanist application submitted successfully and pending approval.',
      applicationId: result.insertId,
    });

  } catch (error) {
    console.error('Apply Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ─────────────────────────────────────────────
// LOGIN (USER / ADMIN / BOTANIST)
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // 1. Get user
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const user = rows[0];

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 3. Check if active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled',
      });
    }

    // 4. Generate token
    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      token,
      user: safeUser(user),
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

// ─────────────────────────────────────────────
// GET PROFILE
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, is_active
       FROM users
       WHERE id = ?`,
      [req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: safeUser(rows[0]),
    });

  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

module.exports = {
  applyAsBotanist,
  login,
  getMe,
};