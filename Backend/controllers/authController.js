/**
 * Flora-Digitalis Pakistan
 * Auth Controller (Refactored for normalized DB)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const crypto = require('crypto');
const db = require('../config/db'); // Your database connection pool (mysql2/pg)
const sendEmail = require('../services/resetpasswordEmail');
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
  name: user.name,
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
      !specialisation 
      // !document_url
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
        message: 'Invalid Email or Password',
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
  console.error("LOGIN ERROR:", error);

  return res.status(500).json({
    success: false,
    message: 'Login failed',
    error: error.message,
  });
}
};

// ─────────────────────────────────────────────
// GET PROFILE
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // 1. Verify req.user exists from middleware
    if (!req.user || !req.user.userId) {
      console.error('GetMe Error: req.user or req.user.userId is missing', req.user);
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication context',
      });
    }

    // 2. Query database using req.user.userId
    const [rows] = await pool.query(
      `SELECT id, email, role, is_active AS isActive
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

    // 3. Format user object to match login payload shape
    const user = {
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role,
      isActive: rows[0].isActive,
    };

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('GetMe Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

// @desc    Request Password Reset Link
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Query user by email (SQL)
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Security practice: Return same response whether user exists or not to prevent user enumeration
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset link was sent.' });
    }

    // 2. Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash token and set 15-minute expiration
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

    // 4. Update user record in SQL database
    await db.query(
      'UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?',
      [hashedToken, expireTime, user.id]
    );

    // 5. Send Email with unhashed reset token
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    // const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const emailMessage = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your KUH Digital Herbarium account.</p>
      <p>Please click the link below to set a new password (valid for 15 minutes):</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    `;

    await sendEmail({
      email: user.email,
      subject: 'KUH System - Password Reset Request',
      html: emailMessage,
    });

    res.status(200).json({ message: 'If an account exists, a reset link was sent.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Email could not be sent. Please try again.' });
  }
};

// @desc    Reset Password via Token
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    // 1. Hash incoming token param to match database record
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Query user with matching token that hasn't expired yet
    const [rows] = await db.query(
      'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expire > ?',
      [resetPasswordToken, new Date()]
    );
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 4. Update password and clear reset fields in SQL database
    await db.query(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error processing password reset.' });
  }
};

module.exports = {
  applyAsBotanist,
  forgotPassword,
  resetPassword,
  login,
  getMe,
};